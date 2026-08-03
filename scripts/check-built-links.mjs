import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repository ? '/' + repository + '/' : '/';
const html = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (entry.name.endsWith('.html')) html.push(target);
  }
}
await walk(root);
const failures = [];
for (const file of html) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
    const clean = decodeURI(raw.split(/[?#]/)[0]);
    if (!clean.startsWith('/')) continue;
    if (base !== '/' && !clean.startsWith(base)) {
      failures.push(
        path.relative(root, file) + ': URL di luar base path: ' + raw,
      );
      continue;
    }
    const relative = base === '/' ? clean.slice(1) : clean.slice(base.length);
    const target = path.join(
      root,
      relative.endsWith('/')
        ? relative + 'index.html'
        : relative || 'index.html',
    );
    try {
      await access(target);
    } catch {
      failures.push(path.relative(root, file) + ': target tidak ada: ' + raw);
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Link check passed: ' + html.length + ' halaman pada base ' + base);
