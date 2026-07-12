const serviceClient = window.effSupabase;
const serviceMessage = document.querySelector('#serviceMessage');
const serviceForm = document.querySelector('#serviceForm');
const showService = text => { serviceMessage.hidden = false; serviceMessage.innerHTML = `<b>Service-hours update</b><p>${text}</p>`; };
const escapeService = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function estimatedHours() { const start = serviceForm.startTime.value, end = serviceForm.endTime.value, pause = Number(serviceForm.breakMinutes.value || 0); if (!start || !end) return 0; let minutes = (new Date(`2000-01-01T${end}`) - new Date(`2000-01-01T${start}`)) / 60000; if (minutes <= 0) minutes += 1440; return Math.max(0, (minutes - pause) / 60); }
function updateEstimate() { document.querySelector('#serviceTotal').textContent = `Estimated hours: ${estimatedHours().toFixed(2)}`; }
['startTime','endTime','breakMinutes'].forEach(name => serviceForm[name].addEventListener('input', updateEstimate));
async function loadService() {
  if (!serviceClient) { showService('The Academy connection is not ready yet.'); return; }
  const { data: { session } } = await serviceClient.auth.getSession();
  if (!session) { showService('Please <a href="auth.html">sign in</a> before logging service hours.'); return; }
  const { data: profile } = await serviceClient.from('academy_profiles').select('full_name,chapter').eq('id', session.user.id).maybeSingle();
  const { data: rows, error } = await serviceClient.from('academy_service_submissions').select('service_date,event_name,calculated_hours,approved_hours,status,administrator_notes').eq('member_id', session.user.id).order('service_date', { ascending: false });
  if (error) { showService('Service tracking will activate after EFF staff run the Academy expansion setup.'); return; }
  const approved = (rows || []).filter(row => row.status === 'Approved' || row.status === 'Partially Approved').reduce((sum,row) => sum + Number(row.approved_hours ?? row.calculated_hours ?? 0),0);
  const pending = (rows || []).filter(row => ['Submitted','Pending Verification','Returned for Correction'].includes(row.status)).reduce((sum,row) => sum + Number(row.calculated_hours || 0),0);
  const pct = Math.min(100, approved / 25 * 100);
  document.querySelector('#serviceRing').style.setProperty('--percent', `${pct}%`);
  document.querySelector('#serviceRing').innerHTML = `<b>${approved.toFixed(2)}<br><small>of 25</small></b>`;
  document.querySelector('#serviceTotals').textContent = `${pending.toFixed(2)} pending review · ${Math.max(0,25-approved).toFixed(2)} approved hours remaining`;
  document.querySelector('#serviceRows').innerHTML = (rows || []).map(row => `<tr><td>${escapeService(row.service_date)}</td><td>${escapeService(row.event_name)}</td><td>${Number(row.approved_hours ?? row.calculated_hours ?? 0).toFixed(2)}</td><td><span class="status">${escapeService(row.status)}</span></td><td>${escapeService(row.administrator_notes || '—')}</td></tr>`).join('') || '<tr><td colspan="5">No service submissions yet.</td></tr>';
  serviceForm.dataset.memberName = profile?.full_name || session.user.email;
  serviceForm.dataset.chapter = profile?.chapter || 'EFF National Member';
  serviceForm.dataset.userId = session.user.id;
}
serviceForm.addEventListener('submit', async event => { event.preventDefault(); if (!serviceClient || !serviceForm.dataset.userId) return; const form = new FormData(serviceForm); const payload = {member_id:serviceForm.dataset.userId,member_name:serviceForm.dataset.memberName,chapter:serviceForm.dataset.chapter,service_date:form.get('serviceDate'),event_name:form.get('eventName'),organization:form.get('organization'),service_category:form.get('category'),duties:form.get('duties'),start_time:form.get('startTime'),end_time:form.get('endTime'),break_minutes:Number(form.get('breakMinutes')||0),status:'Submitted',supervisor_name:form.get('supervisorName'),supervisor_email:form.get('supervisorEmail'),supervisor_role:form.get('supervisorRole'),preapproved:form.get('preapproved') === 'true',reflection:form.get('reflection'),truthfulness_certified:form.get('truthfulness') === 'on'}; const {error} = await serviceClient.from('academy_service_submissions').insert(payload); if(error) return showService(error.message); serviceForm.reset(); updateEstimate(); showService('Your service record was submitted for verification. Hours do not count toward scholarship eligibility until an authorized reviewer approves them.'); loadService(); });
loadService();
