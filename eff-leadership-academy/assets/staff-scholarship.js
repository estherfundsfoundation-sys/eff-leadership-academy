const client = window.effSupabase;
const gate = document.querySelector('#staffGate');
const dashboard = document.querySelector('#staffDashboard');
const safe = value => String(value || '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
const formatDate = value => value ? new Date(value).toLocaleDateString() : '—';

function scholarshipPanel(applications, profiles) {
  const byMember = Object.fromEntries((profiles || []).map(profile => [profile.id, profile]));
  const section = document.createElement('section');
  section.className = 'table-wrap';
  section.innerHTML = `<div class="table-title"><h2>Members-Only Scholarship</h2><span class="small-note">${applications.length} application${applications.length === 1 ? '' : 's'}</span></div><p class="small-note">Open recommendation letters, verify requirements, and record a review decision below.</p><div class="table-scroll"><table><thead><tr><th>Applicant</th><th>Service hours</th><th>Letter</th><th>Review</th></tr></thead><tbody id="scholarshipRows"></tbody></table></div>`;
  dashboard.append(section);
  const rows = section.querySelector('#scholarshipRows');
  rows.innerHTML = applications.map(app => {
    const profile = byMember[app.member_id] || {};
    const payload = app.payload || {};
    return `<tr data-application="${safe(app.id)}"><td><b>${safe(profile.full_name || payload.fullName || 'EFF member')}</b><br><small>${safe(profile.chapter || payload.chapter || 'Chapter not listed')} · ${formatDate(app.submitted_at)}</small></td><td>${safe(app.fall_service_hours || 0)} / 25</td><td>${app.recommendation_path ? `<button class="button ghost letter-link" data-path="${safe(app.recommendation_path)}">Open letter</button><br><small>${safe(app.recommendation_name)}</small>` : '<small>No letter uploaded</small>'}</td><td><select class="review-status"><option ${app.status === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option><option ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option><option ${app.status === 'Selected' ? 'selected' : ''}>Selected</option><option ${app.status === 'Not Selected' ? 'selected' : ''}>Not Selected</option><option ${app.status === 'Ineligible' ? 'selected' : ''}>Ineligible</option></select><textarea class="review-notes" placeholder="Private staff notes">${safe(app.reviewer_notes)}</textarea><button class="button primary save-review" data-id="${safe(app.id)}">Save review</button></td></tr>`;
  }).join('') || '<tr><td colspan="4">No scholarship applications have been submitted yet.</td></tr>';
  section.querySelectorAll('.letter-link').forEach(button => button.addEventListener('click', async () => {
    button.disabled = true;
    const { data, error } = await client.storage.from('academy-scholarship-letters').createSignedUrl(button.dataset.path, 300);
    button.disabled = false;
    if (error || !data?.signedUrl) { alert('The letter could not open. Please try again.'); return; }
    window.open(data.signedUrl, '_blank', 'noopener');
  }));
  section.querySelectorAll('.save-review').forEach(button => button.addEventListener('click', async () => {
    const row = button.closest('tr');
    button.disabled = true; button.textContent = 'Saving…';
    const { error } = await client.from('academy_scholarship_applications').update({ status: row.querySelector('.review-status').value, reviewer_notes: row.querySelector('.review-notes').value }).eq('id', button.dataset.id);
    button.disabled = false; button.textContent = error ? 'Try again' : 'Saved';
  }));
}

async function loadStaff() {
  if (!client) { gate.innerHTML = '<b>Setup needed</b><p>Add the Academy public Supabase values first, then return here.</p>'; return; }
  const { data: { session } } = await client.auth.getSession();
  if (!session) { gate.innerHTML = '<b>Staff sign-in required</b><p><a href="auth.html">Sign in with your designated EFF staff account →</a></p>'; return; }
  const { data: role } = await client.from('academy_staff').select('role').eq('email', session.user.email).maybeSingle();
  if (!role) { gate.innerHTML = '<b>Verified staff only</b><p>Your account is signed in, but it has not been assigned Academy staff access yet.</p>'; return; }
  const courseResponse = await fetch('data/courses.json');
  const courseCatalog = courseResponse.ok ? await courseResponse.json() : { courses: [] };
  const requiredCourse = (courseCatalog.courses || []).find(course => course.id === '2788873');
  const requiredLessonIds = new Set((requiredCourse?.lessons || []).map(lesson => String(lesson.id)));
  const requiredTotal = requiredLessonIds.size;
  const [{ data: profiles, error: profileError }, { data: progress, error: progressError }, { data: submissions, error: submissionError }, { data: applications, error: scholarshipError }] = await Promise.all([
    client.from('academy_profiles').select('id,email,full_name,university,chapter,position,member_type'),
    client.from('academy_progress').select('user_id,course_id,lesson_id,updated_at'),
    client.from('academy_submissions').select('user_id,lesson_id,assignment_title,response,submitted_at,status'),
    client.from('academy_scholarship_applications').select('id,member_id,payload,status,fall_service_hours,recommendation_path,recommendation_name,submitted_at,reviewer_notes').order('submitted_at', { ascending: false })
  ]);
  if (profileError || progressError || submissionError || scholarshipError) { gate.innerHTML = '<b>The Command Center could not load data yet.</b><p>Please refresh and try again.</p>'; return; }
  gate.hidden = true; dashboard.hidden = false;
  const grouped = {};
  for (const item of progress || []) {
    grouped[item.user_id] ||= { count: 0, requiredCompleted: new Set(), last: '' };
    grouped[item.user_id].count++;
    if (String(item.course_id) === '2788873' && requiredLessonIds.has(String(item.lesson_id))) grouped[item.user_id].requiredCompleted.add(String(item.lesson_id));
    if (!grouped[item.user_id].last || item.updated_at > grouped[item.user_id].last) grouped[item.user_id].last = item.updated_at;
  }
  const users = (profiles || []).map(profile => {
    const activity = grouped[profile.id] || { count: 0, requiredCompleted: new Set(), last: '' };
    return { ...profile, ...activity, requiredDone: activity.requiredCompleted.size, requiredTotal, requiredComplete: requiredTotal > 0 && activity.requiredCompleted.size === requiredTotal };
  });
  const byUser = Object.fromEntries(users.map(item => [item.id, item]));
  document.querySelector('#learnerCount').textContent = users.length;
  document.querySelector('#requiredCourseCount').textContent = users.filter(user => user.requiredComplete).length;
  document.querySelector('#submissionCount').textContent = (submissions || []).length;
  const draw = filter => document.querySelector('#staffRows').innerHTML = users.filter(row => JSON.stringify({...row, requiredCompleted: undefined}).toLowerCase().includes(filter.toLowerCase())).sort((a,b) => Number(b.requiredComplete)-Number(a.requiredComplete) || b.requiredDone-a.requiredDone).map(row => `<tr><td><b>${safe(row.full_name || 'EFF learner')}</b><br><small>${safe(row.email)}</small></td><td><b>${safe(row.university || 'University not listed')}</b><br><small>${safe(row.chapter || 'Chapter not listed')}</small></td><td>${safe(row.position || row.member_type || 'Role not set')}</td><td><span class="status ${row.requiredComplete ? 'status-complete' : ''}">${row.requiredComplete ? 'Completed' : 'In progress'}</span><br><small>${row.requiredDone} of ${row.requiredTotal} lessons</small></td><td>${formatDate(row.last)}</td></tr>`).join('') || '<tr><td colspan="5">No learners match that search.</td></tr>';
  draw(''); document.querySelector('#staffSearch').oninput = event => draw(event.target.value);
  document.querySelector('#submissionRows').innerHTML = (submissions || []).sort((a,b) => new Date(b.submitted_at)-new Date(a.submitted_at)).map(item => { const learner = byUser[item.user_id] || {}; return `<tr><td><b>${safe(learner.full_name || 'EFF learner')}</b><br><small>${safe(learner.email)}</small></td><td>${safe(item.assignment_title || item.lesson_id)}</td><td>${safe(item.response).slice(0,330)}${item.response?.length > 330 ? '…' : ''}</td><td>${formatDate(item.submitted_at)}</td></tr>`; }).join('') || '<tr><td colspan="4">No assignments submitted yet.</td></tr>';
  scholarshipPanel(applications || [], profiles || []);
}
loadStaff();
