import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const dataPath = path.join(root, 'data', 'courses.json');
const deployRoot = path.join(root, 'eff-leadership-academy');
const mediaRoot = path.join(deployRoot, 'assets', 'course-media');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

const safe = value => String(value || 'asset')
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9._-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 110) || 'asset';

const isVendorable = asset =>
  ['image', 'audio'].includes(String(asset.kind || '').toLowerCase()) &&
  /^https:\/\/uploads\.teachablecdn\.com\//i.test(asset.url || '');

let downloaded = 0;
let reused = 0;
const failures = [];

for (const course of data.courses) {
  for (const lesson of course.lessons || []) {
    for (const asset of lesson.assets || []) {
      if (!isVendorable(asset)) continue;
      const sourceUrl = asset.sourceUrl || asset.url;
      const urlPath = new URL(sourceUrl).pathname;
      const extension = path.extname(decodeURIComponent(urlPath)) || (asset.kind === 'audio' ? '.mp3' : '.jpg');
      const digest = crypto.createHash('sha1').update(sourceUrl).digest('hex').slice(0, 10);
      const filename = `${safe(course.id)}--${safe(lesson.id)}--${digest}--${safe(path.basename(asset.name || 'asset', path.extname(asset.name || '')))}${extension}`;
      const absolute = path.join(mediaRoot, filename);
      const relative = `assets/course-media/${filename}`;
      try {
        await fs.access(absolute);
        reused += 1;
      } catch {
        try {
          const response = await fetch(sourceUrl, { redirect: 'follow' });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const bytes = Buffer.from(await response.arrayBuffer());
          if (!bytes.length) throw new Error('empty response');
          await fs.mkdir(mediaRoot, { recursive: true });
          await fs.writeFile(absolute, bytes);
          downloaded += 1;
        } catch (error) {
          failures.push({ course: course.id, lesson: lesson.id, name: asset.name, error: error.message });
          continue;
        }
      }
      asset.sourceUrl = sourceUrl;
      asset.url = relative;
    }
  }
}

data.mediaMigratedAt = new Date().toISOString();
await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`);
await fs.writeFile(path.join(deployRoot, 'data', 'courses.json'), `${JSON.stringify(data, null, 2)}\n`);

console.log(JSON.stringify({ downloaded, reused, failures }, null, 2));
