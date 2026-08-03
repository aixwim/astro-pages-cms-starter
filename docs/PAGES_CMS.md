# Panduan Pages CMS Aixwim

Pages CMS membaca `.pages.yml` sebagai sumber konfigurasi editor. Buka [app.pagescms.org](https://app.pagescms.org), masuk dengan GitHub, pasang GitHub App pada akun pemilik repository, lalu pilih `aixwim/astro-pages-cms-starter` dan branch `main`.

## Area yang tersedia

- **Site Settings** — nama merek, tagline, deskripsi, email, dan folder Google Drive.
- **Insights** — membuat dan mengedit posting Markdown dengan judul, ringkasan, tanggal, kategori, topik, tag, gambar SEO, alt text, draft, featured, tanggal pembaruan, dan rich text.
- **Robots.txt** — editor teks untuk aturan crawler.
- **Images** — unggah WebP, PNG, JPG, JPEG, dan SVG ke `public/images`.
- **Google Drive Sync** — aset sinkronisasi berada di `public/drive`.

## Alur posting yang aman

1. Buat posting dari koleksi **Insights**.
2. Pilih satu kategori dan satu topik utama.
3. Isi ringkasan 70–170 karakter, minimal tiga tag, gambar 1200×630, dan alt text yang menjelaskan visual.
4. Tulis isi dengan heading H2 dan contoh yang dapat dipraktikkan.
5. Simpan sebagai draft untuk review; gunakan `featured` hanya untuk satu prioritas editorial.
6. Jalankan **Validate all posts** sebelum publikasi.
7. Setelah siap, gunakan **Deploy site** atau biarkan push ke `main` menjalankan deployment otomatis.

Build juga menjalankan `taxonomy:sync`. Jika kategori, topik, tag, atau nama gambar belum lengkap, pipeline akan melengkapi metadata dari isi artikel lalu menjalankan validasi.

## Aturan gambar SEO

Gunakan nama file lowercase berbasis slug, misalnya:

`images/posts/cara-belajar-dengan-ai.webp`

Hindari `IMG_1234.png`, UUID, teks promosi di dalam gambar, dan gambar yang tidak berkaitan dengan artikel. Gambar utama dipakai untuk halaman artikel, Open Graph, Twitter Card, dan structured data.

## Action Pages CMS

- **Validate all posts** menjalankan format check, content check, taxonomy check, agent check, build, dan link check.
- **Validate site** pada `robots.txt` menjalankan pemeriksaan yang sama.
- **Deploy site** memulai workflow GitHub Pages untuk branch yang sedang dibuka.

Jika action tidak muncul, pastikan GitHub Actions aktif dan `.pages.yml` sudah terbaca pada branch `main`. Pages CMS menyimpan konfigurasi melalui cache; refresh repository setelah commit konfigurasi.
