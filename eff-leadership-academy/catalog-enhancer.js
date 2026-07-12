window.EFFCatalog = (() => {
  const escapeCatalog = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const done = course => course.lessons.filter(lesson => window.EFFAcademyAuth?.complete(course.id, lesson.id)).length;
  async function render() {
    await window.EFFAcademyAuth?.hydrate();
    const {courses} = await fetch('courses.json').then(r => r.json());
    const root = document.querySelector('#courseCatalog');
    const group = new Map();
    for (const course of courses) { const category = course.category || 'Existing EFF Leadership Training'; if (!group.has(category)) group.set(category, []); group.get(category).push(course); }
    root.innerHTML = [...group.entries()].map(([category, list]) => `<section class="catalog-section"><h2>${escapeCatalog(category)}</h2><p>${list.length} course${list.length === 1 ? '' : 's'} available</p>${list.map(course => { const completed = done(course); return `<article class="course-card compact-card"><div><h3>${escapeCatalog(course.title)}</h3><p>${escapeCatalog(course.description).slice(0,210)}${course.description.length > 210 ? '…' : ''}</p><div class="meta"><span>${course.duration || `${course.modules.length} sections`}</span><span>${completed}/${course.lessons.length} lessons</span></div></div><a class="button primary" href="course.html?course=${encodeURIComponent(course.id)}">Open course →</a></article>`; }).join('')}</section>`).join('');
  }
  return {render};
})();
const message = document.querySelector('#authMessage');
const show = text => { message.hidden = false; message.innerHTML = `<b>Account update</b><p>${text}</p>`; };
const client = window.effSupabase;

if (!client) show('The account connection is not added yet. EFF staff: add the public Supabase project values to assets/supabase-config.js after completing the Academy SQL setup.');

document.querySelector('#signInForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const form = new FormData(event.currentTarget);
  const { error } = await client.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
  if (error) return show(error.message);
  location.href = 'dashboard.html';
});

document.querySelector('#signUpForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const form = new FormData(event.currentTarget);
  const fullName = form.get('name').trim();
  const chapter = form.get('chapter').trim();
  const position = form.get('position');
  const { error } = await client.auth.signUp({
    email: form.get('email'),
    password: form.get('password'),
    options: {
      data: { full_name: fullName, chapter, position },
      emailRedirectTo: location.origin + '/dashboard.html'
    }
  });
  if (error) return show(error.message);
  show('Your account and EFF leadership profile are ready to verify. Check your inbox—and your spam folder—for the confirmation email, then return here to sign in.');
  event.currentTarget.reset();
});
