const client = window.effSupabase;
const notice = document.querySelector('#applicationNotice');
const form = document.querySelector('#scholarshipForm');
let cycle;
let user;
let existingApplication;

const message = (title, body) => {
  notice.hidden = false;
  notice.innerHTML = `<b>${title}</b><p>${body}</p>`;
};

const safeName = name => String(name || 'recommendation').replace(/[^a-z0-9._-]/gi, '-').replace(/-+/g, '-');

async function loadApplication() {
  if (!client) { message('Scholarship setup is still being connected.', 'Please return shortly.'); return; }
  const { data: { session } } = await client.auth.getSession();
  if (!session) { message('Member sign-in required', '<a href="auth.html">Create or sign into your Academy account →</a> before applying.'); return; }
  user = session.user;
  const [{ data: profile }, { data: cycles, error: cycleError }] = await Promise.all([
    client.from('academy_profiles').select('full_name,email,chapter').eq('id', user.id).maybeSingle(),
    client.from('academy_scholarship_cycles').select('*').eq('status', 'Open').order('created_at', { ascending: false }).limit(1)
  ]);
  if (cycleError || !cycles?.length) { message('No scholarship cycle is open right now.', 'Check back soon for the next EFF Members-Only Scholarship opportunity.'); return; }
  cycle = cycles[0];
  const { data, error } = await client.from('academy_scholarship_applications').select('*').eq('cycle_id', cycle.id).eq('member_id', user.id).maybeSingle();
  if (error) { message('Your application could not load yet.', 'Please refresh and try again.'); return; }
  existingApplication = data;
  document.querySelector('#cycleTitle').textContent = cycle.title || 'EFF Members-Only Scholarship';
  form.fullName.value = profile?.full_name || '';
  form.email.value = profile?.email || user.email || '';
  form.chapter.value = profile?.chapter || '';
  const saved = existingApplication?.payload || {};
  ['school','graduation','gpa','financialNeed','leadership','service','essay'].forEach(key => { if (saved[key]) form.elements[key].value = saved[key]; });
  if (existingApplication?.fall_service_hours) form.fallServiceHours.value = existingApplication.fall_service_hours;
  if (existingApplication?.eligibility_acknowledged) form.eligibilityAcknowledged.checked = true;
  if (existingApplication?.recommendation_name) {
    form.recommendationLetter.required = false;
    form.recommendationLetter.closest('label').querySelector('small').textContent = `Letter on file: ${existingApplication.recommendation_name}. Choose a new file only if you want to replace it.`;
  }
  if (existingApplication?.status && existingApplication.status !== 'Draft') {
    document.querySelector('#eligibilityMessage').innerHTML = `<b>Application status: ${existingApplication.status}</b><p>EFF Nationals will verify your chapter membership, Academy courses, service hours, and recommendation letter.</p>`;
  }
  notice.hidden = true;
  form.hidden = false;
}

async function uploadLetter(file) {
  if (!file) return { path: existingApplication?.recommendation_path, name: existingApplication?.recommendation_name };
  const path = `${user.id}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await client.storage.from('academy-scholarship-letters').upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw new Error('Your recommendation letter could not upload. Please try a PDF, DOC, or DOCX file.');
  return { path, name: file.name };
}

async function saveApplication(finalSubmission) {
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const letter = form.recommendationLetter.files[0];
  if (finalSubmission && Number(values.fallServiceHours) < 25) throw new Error('Please enter at least 25 approved fall service hours before submitting.');
  if (finalSubmission && !letter && !existingApplication?.recommendation_path) throw new Error('Please upload your recommendation letter before submitting.');
  const upload = await uploadLetter(letter);
  const payload = {
    fullName: values.fullName, chapter: values.chapter, school: values.school, graduation: values.graduation,
    email: values.email, gpa: values.gpa, financialNeed: values.financialNeed, leadership: values.leadership,
    service: values.service, essay: values.essay
  };
  const record = {
    cycle_id: cycle.id, member_id: user.id, payload,
    fall_service_hours: Number(values.fallServiceHours || 0),
    recommendation_path: upload.path || null, recommendation_name: upload.name || null,
    eligibility_acknowledged: Boolean(values.eligibilityAcknowledged),
    status: finalSubmission ? 'Pending Verification' : 'Draft',
    submitted_at: finalSubmission ? new Date().toISOString() : null
  };
  const { data, error } = await client.from('academy_scholarship_applications').upsert(record, { onConflict: 'cycle_id,member_id' }).select().single();
  if (error) throw new Error('Your application could not be saved. Please try again.');
  existingApplication = data;
  return data;
}

document.querySelector('#saveApplication').addEventListener('click', async () => {
  try { await saveApplication(false); message('Draft saved.', 'You can return and finish your application before the deadline.'); }
  catch (error) { message('We could not save that yet.', error.message); }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type="submit"]');
  button.disabled = true; button.textContent = 'Submitting…';
  try {
    await saveApplication(true);
    form.hidden = true;
    message('Application submitted for verification.', 'EFF Nationals will review your application, recommendation letter, service hours, and course completion. Your scholarship eligibility is confirmed only after their review.');
  } catch (error) { message('We could not submit that yet.', error.message); }
  finally { button.disabled = false; button.textContent = 'Submit for verification'; }
});

loadApplication();
