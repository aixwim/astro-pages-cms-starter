import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repository =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'astro-pages-cms-starter';
const isProjectPage =
  process.env.GITHUB_ACTIONS === 'true' &&
  process.env.LIGHTHOUSE_LOCAL !== 'true';
const site = process.env.SITE_URL ?? 'https://aixwim.github.io';
const automaticBase = isProjectPage ? `/${repository}/` : '/';
const configuredBase = process.env.BASE_PATH || automaticBase;
const base =
  configuredBase === '/'
    ? '/'
    : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  output: 'static',
});
