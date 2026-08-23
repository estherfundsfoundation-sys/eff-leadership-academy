-- Adds a separate university field for Leadership Academy learners and keeps
-- new profiles synchronized with Supabase Auth signup metadata.

alter table public.academy_profiles
  add column if not exists university text;

create or replace function public.handle_new_academy_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academy_profiles (
    id,
    email,
    full_name,
    university,
    chapter,
    position
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'university', ''),
    coalesce(new.raw_user_meta_data ->> 'chapter', ''),
    coalesce(new.raw_user_meta_data ->> 'position', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    university = excluded.university,
    chapter = excluded.chapter,
    position = excluded.position;
  return new;
end;
$$;

drop trigger if exists on_academy_user_created on auth.users;
create trigger on_academy_user_created
after insert or update of raw_user_meta_data, email on auth.users
for each row execute procedure public.handle_new_academy_user();
