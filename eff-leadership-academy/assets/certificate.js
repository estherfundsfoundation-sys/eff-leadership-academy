(async()=>{
  const root=document.querySelector('#certificateRoot'),safe=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const client=window.effSupabase;
  if(!client){root.innerHTML='<section class="certificate-error"><h1>Certificate service unavailable</h1><p>Please contact EFF Nationals for assistance.</p></section>';return}
  const {data:{session}}=await client.auth.getSession();
  if(!session){location.href=`auth.html?next=${encodeURIComponent(location.pathname+location.search)}`;return}
  const courseId=new URLSearchParams(location.search).get('course');
  const data=await fetch('data/courses.json').then(r=>r.json()),course=data.courses.find(c=>c.id===courseId);
  if(!course){root.innerHTML='<section class="certificate-error"><h1>Pathway not found</h1><a class="button primary" href="academy.html">Return to pathways</a></section>';return}
  const [{data:progress},{data:profile}]=await Promise.all([
    client.from('academy_progress').select('lesson_id,updated_at').eq('user_id',session.user.id).eq('course_id',course.id),
    client.from('academy_profiles').select('full_name,chapter,position').eq('id',session.user.id).maybeSingle()
  ]);
  const done=new Set((progress||[]).map(x=>x.lesson_id)),complete=course.lessons.every(l=>done.has(l.id));
  if(!complete){root.innerHTML=`<section class="certificate-error"><p class="eyebrow">NOT YET AVAILABLE</p><h1>Complete the full pathway first.</h1><p>Your record shows ${done.size} of ${course.lessons.length} lessons complete.</p><a class="button primary" href="course.html?course=${encodeURIComponent(course.id)}">Continue training</a></section>`;return}
  const completion=(progress||[]).reduce((latest,row)=>new Date(row.updated_at)>new Date(latest)?row.updated_at:latest,progress?.[0]?.updated_at||new Date().toISOString());
  const name=profile?.full_name||session.user.user_metadata?.full_name||session.user.email,chapter=profile?.chapter||'Esther Funds Foundation',role=profile?.position||'Chapter Leader';
  const bytes=new TextEncoder().encode(`${session.user.id}:${course.id}:${completion.slice(0,10)}`),hash=await crypto.subtle.digest('SHA-256',bytes),code=Array.from(new Uint8Array(hash)).slice(0,6).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
  const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(completion));
  root.innerHTML=`<section class="certificate"><div class="certificate-border"><img src="assets/eff-logo.png" alt="Esther Funds Foundation" class="certificate-logo"><p class="certificate-kicker">ESTHER FUNDS FOUNDATION</p><h1>Certificate of Completion</h1><p class="certificate-presented">This certificate is proudly presented to</p><h2>${safe(name)}</h2><p class="certificate-copy">for successfully completing the leadership pathway</p><h3>${safe(course.title||course.name)}</h3><p class="certificate-meta">${safe(role)} · ${safe(chapter)}</p><div class="certificate-signatures"><div><span>${safe(date)}</span><b>Date of completion</b></div><div><span>Shayna Vincent</span><b>Executive Director</b></div></div><p class="certificate-id">Credential ID: EFF-${safe(code)}</p></div></section><div class="certificate-actions no-print"><button class="button primary" onclick="window.print()">Download / Print certificate</button><a class="button ghost" href="dashboard.html">Return to my learning</a></div>`;
})();
