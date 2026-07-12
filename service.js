(async () => {
  const root = document.querySelector('#scholarStatus');
  const client = window.effSupabase;
  const scholar = window.EFFPathways.scholar;
  const escapeScholar = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  if (!client) { root.innerHTML = '<h2>Account connection needed</h2><p>Return after the Academy connection is active.</p>'; return; }
  const {data:{session}} = await client.auth.getSession();
  if (!session) { root.innerHTML = '<h2>Start your Scholar Pathway</h2><p><a class="button primary" href="auth.html">Sign in to track eligibility</a></p>'; return; }
  await window.EFFAcademyAuth?.hydrate();
  const {courses} = await fetch('data/courses.json').then(r=>r.json());
  const courseMap = Object.fromEntries(courses.map(course=>[course.id,course]));
  const isComplete = id => { const course = courseMap[id]; return course && course.lessons.every(lesson => window.EFFAcademyAuth.complete(course.id, lesson.id)); };
  const completed = scholar.requirements.filter(isComplete);
  const [{data:service},{data:requirements}] = await Promise.all([
    client.from('academy_service_submissions').select('approved_hours,calculated_hours,status').eq('member_id',session.user.id),
    client.from('academy_member_requirements').select('*').eq('member_id',session.user.id).maybeSingle()
  ]);
  const hours = (service||[]).filter(row=>row.status==='Approved'||row.status==='Partially Approved').reduce((n,row)=>n+Number(row.approved_hours??row.calculated_hours??0),0);
  const verified = requirements && ['active_membership','official_membership_record','chapter_good_standing','member_good_standing','enrollment_verified','academic_requirements_verified','conduct_clear','financial_obligations_clear'].every(key=>requirements[key]);
  const eligible = completed.length === scholar.requirements.length && hours >= scholar.serviceHours && verified;
  root.innerHTML = `<p class="eyebrow">${eligible?'ELIGIBLE TO APPLY':'IN PROGRESS'}</p><h2>${eligible?'You are ready for the next step.':'Your Member Scholar checklist.'}</h2><p>Course completion: <b>${completed.length} of ${scholar.requirements.length}</b> · Verified service: <b>${hours.toFixed(2)} of ${scholar.serviceHours} hours</b> · Membership and standing: <b>${verified?'verified':'pending national verification'}</b></p><div class="credential-progress"><span style="width:${Math.round(((completed.length/scholar.requirements.length + Math.min(1,hours/scholar.serviceHours) + (verified?1:0))/3)*100)}%"></span></div><ul>${scholar.requirements.map(id=>`<li class="${isComplete(id)?'is-done':''}">${isComplete(id)?'✓':'○'} ${escapeScholar(courseMap[id]?.title||id)}</li>`).join('')}<li class="${hours>=25?'is-done':''}">${hours>=25?'✓':'○'} 25 verified approved service hours</li><li class="${verified?'is-done':''}">${verified?'✓':'○'} Membership, standing, enrollment, and academic requirements verified</li></ul>${eligible?'<a class="button primary" href="scholarship-application.html">Open scholarship application</a>':'<a class="button ghost" href="service.html">Continue service record</a>'}<p class="small-note">A national reviewer verifies eligibility before an application can move forward. Completion does not guarantee an award.</p>`;
})();
