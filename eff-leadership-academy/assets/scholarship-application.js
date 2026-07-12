const scholarshipClient=window.effSupabase;
const scholarshipNotice=document.querySelector('#applicationNotice');
const scholarshipForm=document.querySelector('#scholarshipForm');
let openCycle=null;

async function scholarshipApp(){
  if(!scholarshipClient){scholarshipNotice.innerHTML='<b>Scholarship setup is still being connected.</b><p>Please return shortly.</p>';return;}
  const {data:{session}}=await scholarshipClient.auth.getSession();
  if(!session){scholarshipNotice.innerHTML='<b>Member sign-in required</b><p><a href="auth.html">Create or sign into your Academy account &rarr;</a> before applying.</p>';return;}
  const [{data:profile},{data:cycles,error}]=await Promise.all([
    scholarshipClient.from('academy_profiles').select('full_name,email,chapter').eq('id',session.user.id).maybeSingle(),
    scholarshipClient.from('academy_scholarship_cycles').select('*').eq('status','Open').order('created_at',{ascending:false}).limit(1)
  ]);
  if(error){scholarshipNotice.innerHTML='<b>Scholarship cycle not available yet.</b><p>EFF Nationals will open the next member scholarship cycle here.</p>';return;}
  openCycle=cycles?.[0];
  if(!openCycle){scholarshipNotice.innerHTML='<b>No scholarship cycle is open right now.</b><p>Check back soon for the next EFF Members-Only Scholarship opportunity.</p>';return;}
  scholarshipNotice.hidden=true; scholarshipForm.hidden=false;
  document.querySelector('#cycleTitle').textContent=openCycle.title||'EFF Members-Only Scholarship';
  scholarshipForm.fullName.value=profile?.full_name||''; scholarshipForm.email.value=profile?.email||session.user.email||''; scholarshipForm.chapter.value=profile?.chapter||'';
  const {data:existing}=await scholarshipClient.from('academy_scholarship_applications').select('*').eq('cycle_id',openCycle.id).eq('member_id',session.user.id).maybeSingle();
  if(existing){['school','graduation','gpa','financialNeed','leadership','service','essay'].forEach(name=>{if(existing[name])scholarshipForm.elements[name].value=existing[name]});}
  const save=async(final=false)=>{
    const fields=Object.fromEntries(new FormData(scholarshipForm).entries());
    const payload={cycle_id:openCycle.id,member_id:session.user.id,full_name:fields.fullName,chapter:fields.chapter,school:fields.school,graduation:fields.graduation,gpa:fields.gpa,financial_need:fields.financialNeed,leadership:fields.leadership,service:fields.service,essay:fields.essay,status:final?'Submitted':'Draft',submitted_at:final?new Date().toISOString():null};
    const {error:saveError}=await scholarshipClient.from('academy_scholarship_applications').upsert(payload,{onConflict:'cycle_id,member_id'});
    if(saveError){scholarshipNotice.hidden=false;scholarshipNotice.textContent='Your application could not be saved yet. Please try again.';return false;}
    scholarshipNotice.hidden=false;scholarshipNotice.innerHTML=final?'<b>Application submitted.</b><p>EFF Nationals will review your application and contact you through your Academy email.</p>':'<b>Draft saved.</b><p>You can return and finish your application before the deadline.</p>';return true;
  };
  document.querySelector('#saveApplication').onclick=()=>save(false);
  scholarshipForm.onsubmit=async event=>{event.preventDefault();if(!scholarshipForm.reportValidity())return;if(await save(true))scholarshipForm.hidden=true;};
}
scholarshipApp();
