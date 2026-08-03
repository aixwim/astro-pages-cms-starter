import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(20).max(80),
    description: z.string().min(70).max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Redaksi Aixwim'),
    category: z.string().default('Wawasan'),
    topic: z.enum([
      'ai-teknologi',
      'karier-produktivitas',
      'belajar-keterampilan',
    ]),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    imageAlt: z.string().min(20).max(180),
    seoTitle: z.string().min(20).max(65).optional(),
    seoDescription: z.string().min(70).max(170).optional(),
    focusKeyword: z.string().max(80).optional(),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});
export const collections = { posts };
