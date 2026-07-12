-- EFF Leadership Academy expansion: service tracking, credentials and scholarship workflow.
-- Run after SUPABASE-ACADEMY-SETUP.sql. This adds tables; it does not delete existing Academy data.

create or replace function public.is_academy_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_staff where lower(email) = lower(coalesce(auth.jwt()->>'email','')));
$$;

create table if not exists public.academy_service_submissions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  member_name text not null,
  chapter text not null,
  service_date date not null,
  event_name text not null,
  organization text,
  service_category text not null,
  duties text not null,
  start_time time not null,
  end_time time not null,
  break_minutes integer not null default 0 check (break_minutes >= 0),
  calculated_hours numeric(5,2) not null default 0,
  approved_hours numeric(5,2),
  status text not null default 'Draft' check (status in ('Draft','Submitted','Pending Verification','Approved','Partially Approved','Returned for Correction','Rejected')),
  supervisor_name text,
  supervisor_email text,
  supervisor_role text,
  preapproved boolean not null default false,
  supporting_document_path text,
  photo_path text,
  reflection text not null default '',
  truthfulness_certified boolean not null default false,
  duplicate_alert boolean not null default false,
  overlapping_time_alert boolean not null default false,
  administrator_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_service_audit (
  id bigint generated always as identity primary key,
  service_submission_id uuid not null references public.academy_service_submissions(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  old_status text,
  new_status text,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.prepare_service_submission()
returns trigger language plpgsql set search_path = public as $$
declare end_timestamp timestamp; start_timestamp timestamp;
begin
  start_timestamp := new.service_date + new.start_time;
  end_timestamp := new.service_date + new.end_time;
  if end_timestamp <= start_timestamp then end_timestamp := end_timestamp + interval '1 day'; end if;
  new.calculated_hours := greatest(0, round((extract(epoch from (end_timestamp - start_timestamp))/3600 - new.break_minutes::numeric/60)::numeric, 2));
  new.duplicate_alert := exists(select 1 from public.academy_service_submissions s where s.member_id = new.member_id and s.service_date = new.service_date and lower(s.event_name) = lower(new.event_name) and s.id <> coalesce(new.id, gen_random_uuid()));
  new.overlapping_time_alert := exists(select 1 from public.academy_service_submissions s where s.member_id = new.member_id and s.service_date = new.service_date and new.start_time < s.end_time and new.end_time > s.start_time and s.id <> coalesce(new.id, gen_random_uuid()));
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists academy_service_prepare on public.academy_service_submissions;
create trigger academy_service_prepare before insert or update on public.academy_service_submissions for each row execute procedure public.prepare_service_submission();

create or replace function public.audit_service_submission()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_service_audit(service_submission_id,actor_id,action,old_status,new_status,notes)
  values(new.id,auth.uid(),case when tg_op = 'INSERT' then 'Created' when old.status is distinct from new.status then 'Status changed' else 'Updated' end,case when tg_op = 'INSERT' then null else old.status end,new.status,new.administrator_notes);
  return new;
end;
$$;
drop trigger if exists academy_service_audit on public.academy_service_submissions;
create trigger academy_service_audit after insert or update on public.academy_service_submissions for each row execute procedure public.audit_service_submission();

create table if not exists public.academy_member_requirements (
  member_id uuid primary key references auth.users(id) on delete cascade,
  active_membership boolean not null default false,
  official_membership_record boolean not null default false,
  chapter_good_standing boolean not null default false,
  member_good_standing boolean not null default false,
  enrollment_verified boolean not null default false,
  academic_requirements_verified boolean not null default false,
  conduct_clear boolean not null default false,
  financial_obligations_clear boolean not null default false,
  administrator_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_scholarship_cycles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  opens_at timestamptz,
  closes_at timestamptz,
  award_amount numeric(12,2),
  status text not null default 'Draft' check (status in ('Draft','Open','Closed','Archived')),
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.academy_scholarship_cycles(id) on delete restrict,
  member_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'Not Started' check (status in ('Not Started','In Progress','Missing Requirement','Pending Verification','Eligible to Apply','Application Submitted','Under Review','Selected','Not Selected','Ineligible')),
  submitted_at timestamptz,
  reviewer_score numeric(6,2),
  reviewer_notes text,
  conflict_disclosed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cycle_id,member_id)
);

create table if not exists public.academy_credentials (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references auth.users(id) on delete cascade,
  credential_key text not null,
  credential_title text not null,
  certificate_number text not null unique,
  status text not null default 'Issued' check (status in ('Issued','Revoked')),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_reason text,
  unique(member_id,credential_key)
);

alter table public.academy_service_submissions enable row level security;
alter table public.academy_service_audit enable row level security;
alter table public.academy_member_requirements enable row level security;
alter table public.academy_scholarship_cycles enable row level security;
alter table public.academy_scholarship_applications enable row level security;
alter table public.academy_credentials enable row level security;

drop policy if exists "service own read" on public.academy_service_submissions;
create policy "service own read" on public.academy_service_submissions for select to authenticated using (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "service own insert" on public.academy_service_submissions;
create policy "service own insert" on public.academy_service_submissions for insert to authenticated with check (member_id = auth.uid());
drop policy if exists "service own update" on public.academy_service_submissions;
create policy "service own update" on public.academy_service_submissions for update to authenticated using (member_id = auth.uid() or public.is_academy_staff()) with check (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "service audit read" on public.academy_service_audit;
create policy "service audit read" on public.academy_service_audit for select to authenticated using (public.is_academy_staff() or exists(select 1 from public.academy_service_submissions s where s.id = service_submission_id and s.member_id = auth.uid()));
drop policy if exists "requirements own read" on public.academy_member_requirements;
create policy "requirements own read" on public.academy_member_requirements for select to authenticated using (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "requirements staff write" on public.academy_member_requirements;
create policy "requirements staff write" on public.academy_member_requirements for all to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff());
drop policy if exists "cycles public read" on public.academy_scholarship_cycles;
create policy "cycles public read" on public.academy_scholarship_cycles for select to authenticated using (status = 'Open' or public.is_academy_staff());
drop policy if exists "cycles staff manage" on public.academy_scholarship_cycles;
create policy "cycles staff manage" on public.academy_scholarship_cycles for all to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff());
drop policy if exists "applications own read" on public.academy_scholarship_applications;
create policy "applications own read" on public.academy_scholarship_applications for select to authenticated using (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "applications own write" on public.academy_scholarship_applications;
create policy "applications own write" on public.academy_scholarship_applications for insert to authenticated with check (member_id = auth.uid());
drop policy if exists "applications own update" on public.academy_scholarship_applications;
create policy "applications own update" on public.academy_scholarship_applications for update to authenticated using (member_id = auth.uid() or public.is_academy_staff()) with check (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "credentials own read" on public.academy_credentials;
create policy "credentials own read" on public.academy_credentials for select to authenticated using (member_id = auth.uid() or public.is_academy_staff());
drop policy if exists "credentials staff manage" on public.academy_credentials;
create policy "credentials staff manage" on public.academy_credentials for all to authenticated using (public.is_academy_staff()) with check (public.is_academy_staff());
