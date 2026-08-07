import { access, readdir, readFile } from 'node:fs/promises';
const dir = new URL('../src/content/posts/', import.meta.url);
const files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
const seen = new Set(),
  errors = [];
for (const file of files) {
  const text = await readFile(new URL(file, dir), 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    errors.push(`${file}: frontmatter tidak valid`);
    continue;
  }
  const front = Object.fromEntries(
    match[1].split('\n').map((line) => {
      const i = line.indexOf(':');
      return i < 0
        ? [line, '']
        : [
            line.slice(0, i).trim(),
            line
              .slice(i + 1)
              .trim()
              .replace(/^["']|["']$/g, ''),
          ];
    }),
  );
  for (const key of [
    'title',
    'description',
    'publishedAt',
    'category',
    'topic',
    'tags',
    'image',
    'imageAlt',
    'featured',
  ])
    if (!front[key]) errors.push(`${file}: ${key} wajib diisi`);
  if (front.title?.length < 20 || front.title?.length > 80)
    errors.push(`${file}: panjang title harus 20–80 karakter`);
  if (front.description?.length < 70 || front.description?.length > 170)
    errors.push(`${file}: panjang description harus 70–170 karakter`);
  const normalized = front.title?.toLowerCase();
  if (seen.has(normalized)) errors.push(`${file}: title duplikat`);
  seen.add(normalized);
  const words = match[2].trim().split(/\s+/).filter(Boolean).length;
  if (words < 450) errors.push(`${file}: isi terlalu tipis (${words} kata)`);
  if (!/^## /m.test(match[2]))
    errors.push(`${file}: minimal satu heading H2 diperlukan`);
  if (
    !['ai-teknologi', 'karier-produktivitas', 'belajar-keterampilan'].includes(
      front.topic,
    )
  )
    errors.push(`${file}: topic tidak dikenal`);
  if (!/^\[[^\]]+(?:,[^\]]+){2,}\]$/.test(front.tags ?? ''))
    errors.push(`${file}: minimal tiga tag wajib diisi`);
  // Dedupe: beberapa posting boleh berbagi gambar kanonik (hemat bandwidth).
  // Yang wajib: nama SEO (lowercase, dash, .webp) DAN file benar-benar ada.
  if (!/^images\/posts\/[a-z0-9-]+\.webp$/.test(front.image))
    errors.push(`${file}: nama image tidak SEO: ${front.image}`);
  else {
    const img = new URL('../public/' + front.image, import.meta.url);
    try {
      await access(img);
    } catch {
      errors.push(`${file}: image tidak ditemukan: ${front.image}`);
    }
  }
}
if (files.length < 10)
  errors.push(`Jumlah artikel ${files.length}; minimal 10`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content check passed: ${files.length} artikel unik dan lengkap.`);
