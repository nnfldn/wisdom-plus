# WisDom+ — Wisma Domba Farm

Aplikasi manajemen peternakan domba dengan portal publik dan panel admin. Dibangun menggunakan Laravel 13, Inertia 2, React 18, Tailwind CSS 3, dan Vite 7, dengan dukungan PWA.

## Fitur

- Pendataan domba, identitas dan pemindaian QR, riwayat kesehatan, serta pembiakan.
- Pencatatan penjualan, pembayaran, pelanggan, dan distribusi.
- Dashboard, riwayat aktivitas, serta pengelolaan akun dengan peran `admin` dan `super-admin`.
- Portal katalog, berita, profil peternakan, dan pengelolaan konten.
- Unggah gambar ke Supabase Storage dan proxy chatbot eksternal melalui backend.

Halaman pakan saat ini menampilkan data domba; pencatatan pakan tersendiri belum tersedia.

## Menjalankan lokal

Siapkan PHP 8.3+, Composer 2, Node.js 22.12+, dan PostgreSQL. Image Docker menggunakan PHP 8.4 dan Node.js 22.

```bash
composer install
npm ci
cp .env.example .env
php artisan key:generate
```

Isi koneksi `DB_*` di `.env` untuk database pengembangan. Untuk Supabase PostgreSQL, gunakan host, port, nama pengguna, dan kata sandi dari dashboard proyek Anda. Konfigurasikan `SUPABASE_*` jika memakai unggahan gambar dan `CHATBOT_*` jika memakai chatbot. Seluruh kunci rahasia tetap berada di backend.

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
composer dev
```

Buka <http://127.0.0.1:8000>. `composer dev` menjalankan server Laravel, queue worker, dan Vite. Seeder membuat akun dari `SEED_SUPERADMIN_*` dan `SEED_ADMIN_*`; jika kata sandi kosong, kata sandi acak ditampilkan di terminal. Seeder lokal juga mengisi data contoh. Menjalankan seeder akun lagi akan memperbarui kata sandi akun tersebut.

## Build dan pemeriksaan

```bash
npm run build
composer validate --no-check-publish
find app bootstrap config database routes -name '*.php' -exec php -l {} \;
php artisan route:list
```

Repo ini belum memiliki suite pengujian otomatis. Build frontend dan pemeriksaan sintaks tidak menggantikan pengujian alur bisnis pada database pengembangan.

Folder `vendor`, `node_modules`, `public/build`, cache, log, dan unggahan lokal tidak disimpan di Git. Dependency dipasang dari `composer.lock` dan `package-lock.json`; aset production dibangun saat membuat image.

## Deployment Docker / Railway

```bash
docker build -t wisdom-plus .
```

Siapkan environment production dengan `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `APP_KEY` persisten, koneksi PostgreSQL, serta konfigurasi storage/chatbot yang diperlukan. Buat `APP_KEY` dengan `php artisan key:generate --show`. Jangan commit environment atau kredensial.

```bash
docker run -d --name wisdom-plus --env-file .env.production -p 8080:8080 wisdom-plus
```

Entrypoint membuat cache Laravel dan menjalankan migrasi sebelum memulai nginx, PHP-FPM, queue worker, serta scheduler melalui Supervisor. Pastikan database yang dituju benar sebelum menjalankan container. `PORT` dapat diatur oleh platform; default `8080`. Healthcheck tersedia di `/healthz`.

Inisialisasi akun production secara eksplisit setelah deployment pertama:

```bash
docker exec wisdom-plus php artisan db:seed --class=ProductionSeeder --force
```

Pada Railway, gunakan `Dockerfile` dan konfigurasi `railway.toml`, lalu isi environment melalui pengaturan layanan. Simpan file unggahan di Supabase atau storage persisten; filesystem container bersifat sementara.

## Struktur kode

| Direktori | Isi |
| --- | --- |
| `app/Http` | Controller, validasi request, middleware, resource API |
| `app/Models`, `app/Policies` | Model data dan otorisasi |
| `app/Services` | Integrasi storage dan chatbot |
| `database` | Migrasi, factory, dan seeder |
| `resources/js` | Halaman React, layout, dan komponen |
| `routes` | Rute web, API, autentikasi, dan console |
| `docker` | Konfigurasi nginx, PHP-FPM, Supervisor, dan entrypoint |
