export const topics = [
  {
    slug: 'ai-teknologi',
    name: 'AI & Teknologi Digital',
    eyebrow: 'Memahami dunia digital',
    description:
      'Panduan praktis untuk memakai AI dan teknologi dengan aman, kritis, serta berguna dalam kehidupan sehari-hari.',
    categories: ['Teknologi', 'Literasi Digital', 'Keamanan', 'Privasi'],
    featuredId: '2026-08-03-keamanan-digital-praktis',
  },
  {
    slug: 'karier-produktivitas',
    name: 'Karier & Produktivitas',
    eyebrow: 'Bekerja lebih jernih',
    description:
      'Sistem kerja modern untuk menjaga fokus, mengelola pengetahuan, dan berkolaborasi tanpa mengorbankan energi.',
    categories: ['Produktivitas', 'Kerja Modern'],
    featuredId: '2026-08-03-produktivitas-berbasis-energi',
  },
  {
    slug: 'belajar-keterampilan',
    name: 'Belajar & Keterampilan',
    eyebrow: 'Bertumbuh secara berkelanjutan',
    description:
      'Metode belajar, latihan, dan kreativitas yang membantu pengetahuan berubah menjadi kemampuan nyata.',
    categories: ['Pembelajaran', 'Kreativitas'],
    featuredId: '2026-08-03-belajar-mendalam-di-era-informasi',
  },
] as const;

export type Topic = (typeof topics)[number];

export function getTopicByCategory(category: string): Topic {
  return (
    topics.find((topic) =>
      (topic.categories as readonly string[]).includes(category),
    ) ?? topics[0]
  );
}
