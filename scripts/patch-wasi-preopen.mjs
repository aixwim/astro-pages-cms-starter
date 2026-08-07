/**
 * TERMUX-PATCH — Workaround Astro 7 + rolldown-wasi di Termux (aarch64/Android)
 * Dipanggil otomatis via "postinstall" (package.json) agar tahan `npm install`.
 *
 * Masalah yang diperbaiki:
 *  1. WASI preopen "/" -> "/" gagal (UVWASI_EACCES) — root Android tak bisa
 *     dibaca app Termux. Di-patch ke "/" -> process.cwd().
 *  2. Binding native rolldown android-arm64 SIGILL (instruksi CPU tak didukung)
 *     -> dinonaktifkan agar fallback wasm32-wasi terpakai.
 *  3. Vite: path guest-absolute (mis. /node_modules/...) dari rolldown-wasi
 *     perlu dinormalisasi ke path host (cwd + path) sebelum fs host dipakai.
 *  4. Vite: output dir diubah ke bentuk guest (cwd-stripped) agar rolldown-wasi
 *     menulis ke lokasi host yang benar (bukan nested duplicate).
 *  5. Astro: virtual module content (astro:content-module-imports /
 *     astro:asset-imports) di-resolve ke virtual id, bukan host file path.
 *  6. Astro: cache metadata compiler memakai raw path (guest) secara konsisten
 *     antara main module & virtual module load.
 *
 * Semua patch idempotent (tidak dobel saat dijalankan ulang).
 */
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function patchFile(rel, replacements) {
  const file = join(root, rel);
  if (!existsSync(file)) {
    console.log(`- lewati (tidak ada): ${rel}`);
    return;
  }
  let src = readFileSync(file, 'utf8');
  let changed = false;
  for (const [label, pattern, rep] of replacements) {
    if (src.includes(label)) {
      console.log(`  = sudah ter-patch: ${rel} (${label})`);
      continue;
    }
    const isRegex = pattern instanceof RegExp;
    const found = isRegex ? pattern.test(src) : src.includes(pattern);
    if (!found) {
      console.log(`  ! pola tak ditemukan: ${rel} (${label})`);
      continue;
    }
    src = src.replace(pattern, rep);
    changed = true;
    console.log(`  ✔ ${label}: ${rel}`);
  }
  if (changed) writeFileSync(file, src);
}

console.log(
  '== TERMUX-PATCH: WASI preopen "/" -> cwd (satteri & astro compiler) ==',
);
for (const rel of [
  'node_modules/@bruits/satteri-wasm32-wasi/satteri_napi.wasi.cjs',
  'node_modules/@bruits/satteri-wasm32-wasi/wasi-worker.mjs',
  'node_modules/@astrojs/compiler-binding-wasm32-wasi/astro.wasi.cjs',
  'node_modules/@astrojs/compiler-binding-wasm32-wasi/wasi-worker.mjs',
]) {
  // marker: deteksi state TERPATCH ([__rootDir]: process.cwd()) — bukan komentar
  patchFile(rel, [
    [
      '[__rootDir]: process.cwd()',
      /\[\s*__rootDir\s*\]\s*:\s*__rootDir\s*,?/g,
      '[__rootDir]: process.cwd(),',
    ],
  ]);
}

console.log('== TERMUX-PATCH: rolldown-wasi tambah preopen "/" -> cwd ==');
for (const rel of [
  'node_modules/@rolldown/binding-wasm32-wasi/rolldown-binding.wasi.cjs',
  'node_modules/@rolldown/binding-wasm32-wasi/wasi-worker.mjs',
]) {
  // marker: deteksi state TERPATCH ("'/': process.cwd()") — bukan komentar
  patchFile(rel, [
    [
      "'/': process.cwd()",
      /preopens:\s*\{\s*['"]\.['"]\s*:\s*process\.cwd\(\),\s*/g,
      "preopens: {\n    '.': process.cwd(),\n    '/': process.cwd(),\n",
    ],
  ]);
}

console.log('== TERMUX-PATCH: nonaktifkan binding native rolldown (SIGILL) ==');
{
  const native = join(root, 'node_modules/@rolldown/binding-android-arm64');
  const disabled = join(
    root,
    'node_modules/@rolldown/binding-android-arm64-DISABLED',
  );
  if (existsSync(native) && !existsSync(disabled)) {
    renameSync(native, disabled);
    console.log('  ✔ native rolldown android-arm64 dinonaktifkan (rename)');
  } else {
    console.log('  = binding native sudah dinonaktifkan / tidak ada');
  }
}

console.log('== TERMUX-PATCH: vite extractExportsData (guest -> host path) ==');
patchFile('node_modules/vite/dist/node/chunks/node.js', [
  [
    'TERMUX PATCH: normalisasi guest path -> host path (untuk fs.readFileSync di bawah)',
    `async function extractExportsData(environment, filePath) {
	await init;`,
    `async function extractExportsData(environment, filePath) {
	// TERMUX PATCH: normalisasi guest path -> host path (untuk fs.readFileSync di bawah)
	if (typeof filePath === "string" && filePath.startsWith("/") && !fs.existsSync(filePath)) {
		const __alt = path.join(process.cwd(), filePath.replace(/^\\/+/, ""));
		if (fs.existsSync(__alt)) filePath = __alt;
	}
	await init;`,
  ],
]);

console.log('== TERMUX-PATCH: vite write dir -> guest form ==');
patchFile('node_modules/vite/dist/node/chunks/node.js', [
  [
    'TERMUX PATCH: rolldown-wasi butuh dir guest',
    `		for (const output of arraify(rolldownOptions.output)) res.push(await bundle[options.write ? "write" : "generate"](output));`,
    `		for (const output of arraify(rolldownOptions.output)) {
			// TERMUX PATCH: rolldown-wasi butuh dir guest (strip cwd + "/") agar
			// fs proxy menulis ke lokasi host yang benar (bukan nested duplicate)
			let __out = output;
			if (__out && typeof __out.dir === "string" && __out.dir.startsWith(process.cwd())) {
				__out = { ...__out, dir: "/" + __out.dir.slice(process.cwd().length).replace(/^\\/+/, "") };
			}
			res.push(await bundle[options.write ? "write" : "generate"](__out));
		}`,
  ],
]);

console.log('== TERMUX-PATCH: astro content virtual module -> virtual id ==');
patchFile(
  'node_modules/astro/dist/content/vite-plugin-content-virtual-mod.js',
  [
    [
      'TERMUX PATCH: kembalikan virtual id',
      `        if (id === MODULES_MJS_ID) {
          const modules = new URL(MODULES_IMPORTS_FILE, settings.dotAstroDir);
          if (fs.existsSync(modules)) {
            return {
              id: fileURLToPath(modules),
              meta: createContentDataIncrementalMetadata()
            };
          }
          return MODULES_MJS_VIRTUAL_ID;
        }`,
      `        if (id === MODULES_MJS_ID) {
          // TERMUX PATCH: kembalikan virtual id (bukan host path) agar
          // rolldown-wasi memuat lewat load hook (host-side readFileSync)
          const modules = new URL(MODULES_IMPORTS_FILE, settings.dotAstroDir);
          if (fs.existsSync(modules)) {
            return MODULES_MJS_VIRTUAL_ID;
          }
          return MODULES_MJS_VIRTUAL_ID;
        }`,
    ],
    [
      'TERMUX PATCH: virtual id, bukan host path',
      `        if (id === ASSET_IMPORTS_VIRTUAL_ID) {
          const assetImportsFile = new URL(ASSET_IMPORTS_FILE, settings.dotAstroDir);
          if (fs.existsSync(assetImportsFile)) {
            return {
              id: fileURLToPath(assetImportsFile),
              meta: createContentDataIncrementalMetadata()
            };
          }
          return ASSET_IMPORTS_RESOLVED_STUB_ID;
        }`,
      `        if (id === ASSET_IMPORTS_VIRTUAL_ID) {
          // TERMUX PATCH: virtual id (bukan host path)
          const assetImportsFile = new URL(ASSET_IMPORTS_FILE, settings.dotAstroDir);
          if (fs.existsSync(assetImportsFile)) {
            return ASSET_IMPORTS_RESOLVED_STUB_ID;
          }
          return ASSET_IMPORTS_RESOLVED_STUB_ID;
        }`,
    ],
  ],
);

console.log('== TERMUX-PATCH: astro metadata cache raw path (virtual load) ==');
patchFile('node_modules/astro/dist/vite-plugin-astro/index.js', [
  [
    'TERMUX PATCH: gunakan raw path',
    `          const filename = normalizePath(normalizeFilename(parsedId.filename, config.root));
          let compileMetadata = astroFileToCompileMetadata.get(filename);`,
    `          // TERMUX PATCH: gunakan raw path (guest) — konsisten dengan main
          // module handler (juga raw) agar cache metadata compiler cocok
          const filename = normalizePath(parsedId.filename);
          let compileMetadata = astroFileToCompileMetadata.get(filename);`,
  ],
]);

console.log('\nSelesai.');
