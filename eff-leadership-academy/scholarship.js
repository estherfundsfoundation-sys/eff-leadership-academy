const applicationClient = window.effSupabase;
const applicationForm = document.querySelector('#scholarshipForm');
const applicationNotice = document.querySelector('#applicationNotice');
let activeCycle, activeUser;
const setApplicationNotice = text => { applicationNotice.innerHTML = `<b>Scholarship application</b><p>${text}</p>`; };
async function saveApplication(submit) {
  const form = new FormData(applicationForm);
  const payload = Object.fromEntries(form.entries());
  const {error} = await applicationClient.from('academy_scholarship_applications').upsert({cycle_id:activeCycle.id,member_id:activeUser.id,payload,status:submit?'Application Submitted':'In Progress',submitted_at:submit?new Date().toISOString():null,updated_at:new Date().toISOString()},{onConflict:'cycle_id,member_id'});
  if(error) return setApplicationNotice(error.message);
  setApplicationNotice(submit?'Your application was submitted. EFF staff will update your application status after review.':'Your application was saved. You can return before the deadline to continue or submit.');
}
(async()=>{
  if(!applicationClient){setApplicationNotice('The Academy connection is not ready.');return;}
  const {data:{session}}=await applicationClient.auth.getSession();
  if(!session){setApplicationNotice('Please <a href="auth.html">sign in</a> before starting an application.');return;}
  activeUser=session.user;
  const [{data:cycle},{data:profile}]=await Promise.all([applicationClient.from('academy_scholarship_cycles').select('*').eq('status','Open').order('closes_at',{ascending:true}).limit(1).maybeSingle(),applicationClient.from('academy_profiles').select('full_name,chapter').eq('id',session.user.id).maybeSingle()]);
  if(!cycle){setApplicationNotice('There is not an open Members-Only Scholarship cycle at this time. EFF staff will publish one here when applications open.');return;}
  activeCycle=cycle;document.querySelector('#cycleTitle').textContent=cycle.title;applicationForm.hidden=false;applicationNotice.hidden=true;
  const {data:existing}=await applicationClient.from('academy_scholarship_applications').select('payload,status').eq('cycle_id',cycle.id).eq('member_id',session.user.id).maybeSingle();
  const saved=existing?.payload||{};for(const [name,field] of Object.entries(applicationForm.elements)){if(field?.name&&saved[field.name])field.value=saved[field.name];}applicationForm.fullName.value=saved.fullName||profile?.full_name||'';applicationForm.chapter.value=saved.chapter||profile?.chapter||'';applicationForm.email.value=saved.email||session.user.email||'';
  document.querySelector('#saveApplication').onclick=()=>saveApplication(false);applicationForm.onsubmit=event=>{event.preventDefault();saveApplication(true);};
})();
