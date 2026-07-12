(async () => {
  const root = document.querySelector('#certificationGrid');
  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  await window.EFFAcademyAuth?.hydrate();
  const { courses } = await fetch('data/courses.json').then(r => r.json());
  const courseMap = Object.fromEntries(courses.map(course => [course.id, course]));
  const done = course => course && course.lessons.length && course.lessons.every(lesson => window.EFFAcademyAuth?.complete(course.id, lesson.id));
  const display = pathway => {
    const items = pathway.requirements.map(id => courseMap[id]).filter(Boolean);
    const completed = items.filter(done).length;
    const percent = items.length ? Math.round(completed / items.length * 100) : 0;
    const ready = completed === items.length;
    return `<article class="credential-card ${ready ? 'ready' : ''}"><p class="eyebrow">${ready ? 'READY FOR VERIFICATION' : 'IN PROGRESS'}</p><h2>${esc(pathway.title)}</h2><p>${esc(pathway.description)}</p><div class="credential-progress"><span style="width:${percent}%"></span></div><b>${completed} of ${items.length} requirements complete · ${percent}%</b><ul>${items.map(course => `<li class="${done(course) ? 'is-done' : ''}">${done(course) ? '✓' : '○'} ${esc(course.title)}</li>`).join('')}</ul>${pathway.note ? `<p class="small-note">${esc(pathway.note)}</p>` : ''}${ready ? '<a class="button primary" href="dashboard.html">Request verification</a>' : '<a class="button ghost" href="academy.html">Continue learning</a>'}</article>`;
  };
  const scholar = window.EFFPathways.scholar;
  root.innerHTML = `<article class="scholar-hero"><p class="eyebrow">MEMBERS-ONLY OPPORTUNITY</p><h2>${esc(scholar.title)}</h2><p>${esc(scholar.description)}</p><div class="journey">Learn <span>→</span> Lead <span>→</span> Serve <span>→</span> Verify <span>→</span> Qualify <span>→</span> Apply</div><p><b>Complete ${scholar.requirements.length} required courses and ${scholar.serviceHours} verified approved service hours.</b></p><div class="scholar-actions"><a class="button light" href="service.html">Track service hours</a><a class="button ghost" href="scholarship.html">View scholarship eligibility</a></div><p class="small-note">${esc(scholar.disclaimer)}</p></article>${window.EFFPathways.certifications.map(display).join('')}`;
})();
