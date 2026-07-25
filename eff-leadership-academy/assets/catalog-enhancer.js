window.EFFCatalog = (() => {
  const escapeCatalog = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const done = course => (course.lessons || []).filter(lesson => window.EFFAcademyAuth?.complete(course.id, lesson.id)).length;
  const hrefFor = course => course.externalUrl || `course.html?course=${encodeURIComponent(course.id)}`;

  function courseCard(course) {
    const completed = done(course);
    const lessonCount = (course.lessons || []).length;
    const progress = lessonCount ? `<span>${completed}/${lessonCount} lessons</span>` : '<span>8 interactive levels</span>';
    const target = course.externalUrl ? ' target="_blank" rel="noopener"' : '';
    return `<article class="course-card compact-card${course.featured ? ' featured-course-card' : ''}">
      <div>
        ${course.featured ? '<span class="featured-badge">NEW · FEATURED CERTIFICATE</span>' : ''}
        <h3>${escapeCatalog(course.title)}</h3>
        <p>${escapeCatalog(course.description).slice(0, 260)}${course.description.length > 260 ? '…' : ''}</p>
        <div class="meta"><span>${course.duration || `${(course.modules || []).length} sections`}</span>${progress}</div>
      </div>
      <a class="button primary" href="${escapeCatalog(hrefFor(course))}"${target}>${course.featured ? 'Start the course' : 'Open course'} →</a>
    </article>`;
  }

  async function render() {
    await window.EFFAcademyAuth?.hydrate();
    const {courses} = await fetch('data/courses.json').then(r => r.json());
    const root = document.querySelector('#courseCatalog');
    const featured = courses.filter(course => course.featured);
    const group = new Map();

    for (const course of courses.filter(course => !course.featured)) {
      const category = course.category || 'Existing EFF Leadership Training';
      if (!group.has(category)) group.set(category, []);
      group.get(category).push(course);
    }

    const featuredMarkup = featured.length
      ? `<section class="catalog-section featured-catalog-section"><p class="eyebrow">START HERE</p><h2>Featured student-support training</h2><p>Practical, source-backed courses for leaders who want to help students move forward safely.</p>${featured.map(courseCard).join('')}</section>`
      : '';
    const catalogMarkup = [...group.entries()].map(([category, list]) => `<section class="catalog-section"><h2>${escapeCatalog(category)}</h2><p>${list.length} course${list.length === 1 ? '' : 's'} available</p>${list.map(courseCard).join('')}</section>`).join('');

    root.innerHTML = featuredMarkup + catalogMarkup;
  }

  return {render};
})();
