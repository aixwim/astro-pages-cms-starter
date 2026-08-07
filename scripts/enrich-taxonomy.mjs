import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

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
const focusBySlug = {
  'audit-privasi-digital-pribadi': 'audit privasi digital',
  'belajar-mendalam-di-era-informasi': 'cara belajar mendalam',
  'berpikir-kritis-di-internet': 'cara berpikir kritis di internet',
  'cara-belajar-dengan-ai': 'cara belajar dengan AI',
  'cara-menggunakan-ai-dengan-aman': 'cara menggunakan AI dengan aman',
  'keamanan-digital-praktis': 'keamanan digital praktis',
  'membangun-sistem-catatan-digital': 'sistem catatan digital',
  'memilih-alat-ai-untuk-pekerjaan': 'memilih alat AI untuk pekerjaan',
  'produktivitas-berbasis-energi': 'produktivitas berbasis energi',
  'rapat-online-efektif': 'cara rapat online efektif',
  'ritual-kreatif-yang-bisa-dipertahankan': 'ritual kreatif',
  'strategi-belajar-keterampilan-baru': 'strategi belajar keterampilan baru',
  'workflow-ai-untuk-produktivitas-kerja': 'AI untuk produktivitas kerja',
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
  // Pertahankan referensi gambar yang sudah valid (mis. hasil dedupe),
  // fallback ke slug-based hanya jika file belum ada di public/.
  const currentImage = /^image:\s*(.+)$/m.exec(front)?.[1]?.trim();
  const defaultImage = 'images/posts/' + slug + '.webp';
  const image =
    currentImage &&
    existsSync(new URL('../public/' + currentImage, import.meta.url))
      ? currentImage
      : defaultImage;
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
  for (const field of [
    'seoTitle',
    'seoDescription',
    'focusKeyword',
    'canonicalUrl',
  ]) {
    if (!new RegExp('^' + field + ':', 'm').test(front))
      front += '\n' + field + ": ''";
  }
  const seoTitle =
    title.length <= 65 ? title : title.split(':')[0].trim().slice(0, 65).trim();
  const seoDescription =
    front.match(/^description:\s*['"]([\s\S]*?)['"]$/m)?.[1] ?? '';
  const focusKeyword = focusBySlug[slug] ?? topic.replaceAll('-', ' ');
  const origin = process.env.SITE_URL ?? 'https://aixwim.github.io';
  const basePath = process.env.BASE_PATH ?? '/astro-pages-cms-starter/';
  const postId = file.replace(/\.md$/, '');
  const canonical = new URL(
    basePath + 'insights/' + postId + '/',
    origin,
  ).toString();
  const yaml = (value) => "'" + value.replaceAll("'", "''") + "'";
  front = front.replace(/^seoTitle:.*$/m, 'seoTitle: ' + yaml(seoTitle));
  front = front.replace(
    /^seoDescription:.*$/m,
    'seoDescription: ' + yaml(seoDescription),
  );
  front = front.replace(
    /^focusKeyword:.*$/m,
    'focusKeyword: ' + yaml(focusKeyword),
  );
  front = front.replace(
    /^canonicalUrl:.*$/m,
    'canonicalUrl: ' + yaml(canonical),
  );
  const next = '---\n' + front + '\n---\n' + body;
  if (next !== source) await writeFile(url, next);
}
console.log('Taxonomy enriched from article content.');
