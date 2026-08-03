import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repository =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'astro-pages-cms-starter';
const isProjectPage =
  process.env.GITHUB_ACTIONS === 'true' &&
  process.env.LIGHTHOUSE_LOCAL !== 'true';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://aixwim.github.io',
  base: isProjectPage ? `/${repository}/` : '/',
  integrations: [sitemap()],
  output: 'static',
});
