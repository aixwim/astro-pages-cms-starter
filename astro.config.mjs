import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Plugin khusus Termux: rolldown-wasi mengembalikan path guest-absolute
// (mis. /node_modules/...) yang tidak bisa dibaca Vite di sisi host.
// Hook load ini menormalkan ke path host (cwd + guestPath).
// Virtual module astro yang berujung ke file di .astro/ (astro meresolvenya ke
// host path, yang tak bisa dibaca rolldown-wasi). Kita intercept lebih dulu dan
// sediakan kontennya langsung dari sisi host.
const astroFileVirtualModules = {
  'astro:content-module-imports': '.astro/content-modules.mjs',
  'astro:asset-imports': '.astro/content-assets.mjs',
};

const termuxGuestPathPlugin = {
  name: 'termux-guest-path-loader',
  enforce: 'pre',
  resolveId(id) {
    if (typeof id === 'string' && astroFileVirtualModules[id]) {
      return '\0termux:' + id;
    }
  },
  load(id) {
    if (typeof id === 'string' && id.startsWith('\0termux:astro:')) {
      const file = astroFileVirtualModules[id.slice('\0termux:'.length)];
      if (file) return readFileSync(join(process.cwd(), file), 'utf-8');
    }
    if (typeof id === 'string' && id.startsWith('/') && !existsSync(id)) {
      const host = join(process.cwd(), id.replace(/^\/+/, ''));
      if (existsSync(host)) return readFileSync(host, 'utf-8');
    }
  },
};

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
  vite: {
    plugins: [termuxGuestPathPlugin],
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 900,
    },
  },
  output: 'static',
  // Optimasi: minify HTML + prefetch internal link (strategi hover)
  compressHTML: true,
  prefetch: true,
  build: {
    // Inline stylesheet kecil otomatis -> kurangi request render-blocking
    inlineStylesheets: 'auto',
  },
});
