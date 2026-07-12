import fs from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Provide the path to the teachable-export folder.');
const coursesDir = path.join(source, 'courses');
const entries = await fs.readdir(coursesDir, { withFileTypes: true });
const courses = [];
for (const entry of entries.filter(entry => entry.isDirectory() && !/^\d{2}-course-\d+$/.test(entry.name))) {
  const root = path.join(coursesDir, entry.name);
  const course = JSON.parse(await fs.readFile(path.join(root, 'course.json'), 'utf8'));
  const modules = JSON.parse(await fs.readFile(path.join(root, 'modules', 'structure.json'), 'utf8'))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const lessonsDir = path.join(root, 'lessons');
  const lessonFolders = (await fs.readdir(lessonsDir, { withFileTypes: true })).filter(entry => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const lessons = [];
  for (const folder of lessonFolders) {
    const lesson = JSON.parse(await fs.readFile(path.join(lessonsDir, folder.name, 'lesson.json'), 'utf8'));
    const lecture = lesson.lecture || lesson;
    const markdown = await fs.readFile(path.join(lessonsDir, folder.name, 'lesson.md'), 'utf8');
    const attachments = lecture.attachments || [];
    lessons.push({ id: String(lecture.id), title: lecture.name || folder.name, sectionId: String(lecture.lecture_section_id || ''), position: lecture.position || 0, markdown, quizzes: attachments.filter(item => item.kind === 'quiz' && item.quiz).map(item => item.quiz), activities: attachments.filter(item => ['open_response_question', 'native_comments'].includes(item.kind)).map(item => item.kind), assets: attachments.filter(item => item.url).map(item => ({ name: item.name || item.kind, kind: item.kind, url: item.url })) });
  }
  courses.push({ id: String(course.id), title: course.name, description: course.description || '', published: Boolean(course.is_published), image: course.image_url || '', modules: modules.map(module => ({ id: String(module.id), title: module.name || 'Learning section', position: module.position || 0 })), lessons });
}
await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/courses.json', JSON.stringify({ generatedAt: new Date().toISOString(), courses }, null, 2));
console.log(`Wrote ${courses.length} courses to data/courses.json`);
