import { readdir, readFile, writeFile } from 'node:fs/promises';

const dir = new URL('../src/content/posts/', import.meta.url);
const topicByCategory = {
  Teknologi: 'ai-teknologi',
  'Literasi Digital': 'ai-teknologi',
  Keamanan: 'ai-teknologi',
  Privasi: 'ai-teknologi',
  Produktivitas: 'karier-produktivitas',
  'Kerja Modern': 'karier-produktivitas',
  Pembelajaran: 'belajar-keterampilan',
  Kreativitas: 'belajar-keterampilan',
};
const categoryRules = {
  Keamanan: ['aman', 'keamanan', 'phishing', 'sandi', 'risiko'],
  Privasi: ['privasi', 'data pribadi', 'pelacakan', 'izin aplikasi'],
  'Literasi Digital': ['informasi', 'hoaks', 'sumber', 'klaim', 'internet'],
  Teknologi: ['ai', 'kecerdasan buatan', 'aplikasi', 'teknologi', 'otomasi'],
  Produktivitas: ['produktivitas', 'fokus', 'workflow', 'alur kerja', 'energi'],
  'Kerja Modern': ['rapat', 'kolaborasi', 'tim', 'kerja jarak jauh'],
  Pembelajaran: ['belajar', 'keterampilan', 'latihan', 'memahami', 'mahasiswa'],
  Kreativitas: ['kreatif', 'karya', 'menulis', 'ide', 'ritual'],
};
const tagRules = {
  ai: [' ai ', 'kecerdasan buatan', 'gemini', 'model bahasa'],
  keamanan: ['aman', 'keamanan', 'risiko', 'phishing'],
  privasi: ['privasi', 'data pribadi', 'izin aplikasi'],
  produktivitas: ['produktivitas', 'workflow', 'alur kerja', 'fokus'],
  karier: ['karier', 'pekerjaan', 'profesional'],
  belajar: ['belajar', 'pembelajaran', 'memahami'],
  keterampilan: ['keterampilan', 'latihan', 'kemampuan'],
  kreativitas: ['kreatif', 'karya', 'ide'],
  kolaborasi: ['kolaborasi', 'rapat', 'tim'],
  'literasi-digital': ['literasi', 'informasi', 'internet', 'sumber'],
};

function chooseCategory(text) {
  return Object.entries(categoryRules)
    .map(([category, words]) => [
      category,
      words.filter((word) => text.includes(word)).length,
    ])
    .sort((a, b) => b[1] - a[1])[0][0];
}

for (const file of (await readdir(dir)).filter((name) =>
  name.endsWith('.md'),
)) {
  const url = new URL(file, dir);
  const source = await readFile(url, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) continue;
  let front = match[1];
  const body = match[2];
  const text = (' ' + front + '\n' + body + ' ').toLowerCase();
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  const title = front.match(/^title:\s*['"]?(.+?)['"]?$/m)?.[1] ?? slug;
  const currentCategory = front.match(/^category:\s*(.+)$/m)?.[1]?.trim();
  const category =
    !currentCategory || currentCategory === 'Wawasan'
      ? chooseCategory(text)
      : currentCategory;
  const topic =
    topicByCategory[category] ?? topicByCategory[chooseCategory(text)];
  const tags = Object.entries(tagRules)
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([tag]) => tag)
    .slice(0, 5);
  const fallbackTags =
    topic === 'ai-teknologi'
      ? ['teknologi-digital', 'panduan-praktis']
      : topic === 'karier-produktivitas'
        ? ['kerja-modern', 'panduan-praktis']
        : ['pengembangan-diri', 'panduan-praktis'];
  for (const tag of fallbackTags)
    if (tags.length < 3 && !tags.includes(tag)) tags.push(tag);

  if (currentCategory)
    front = front.replace(/^category:.*$/m, 'category: ' + category);
  else front += '\ncategory: ' + category;
  if (/^topic:/m.test(front))
    front = front.replace(/^topic:.*$/m, 'topic: ' + topic);
  else
    front = front.replace(
      /^category:.*$/m,
      (line) => line + '\ntopic: ' + topic,
    );
  if (/^tags:/m.test(front))
    front = front.replace(/^tags:.*$/m, 'tags: [' + tags.join(', ') + ']');
  else
    front = front.replace(
      /^topic:.*$/m,
      (line) => line + '\ntags: [' + tags.join(', ') + ']',
    );
  const image = 'images/posts/' + slug + '.webp';
  const imageAlt = 'Ilustrasi editorial untuk ' + title;
  if (/^image:/m.test(front))
    front = front.replace(/^image:.*$/m, 'image: ' + image);
  else
    front = front.replace(/^tags:.*$/m, (line) => line + '\nimage: ' + image);
  if (/^imageAlt:/m.test(front))
    front = front.replace(
      /^imageAlt:.*$/m,
      "imageAlt: '" + imageAlt.replaceAll("'", "''") + "'",
    );
  else
    front = front.replace(
      /^image:.*$/m,
      (line) => line + "\nimageAlt: '" + imageAlt.replaceAll("'", "''") + "'",
    );
  const next = '---\n' + front + '\n---\n' + body;
  if (next !== source) await writeFile(url, next);
}
console.log('Taxonomy enriched from article content.');
