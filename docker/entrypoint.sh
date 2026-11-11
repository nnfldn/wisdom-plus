#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Gunakan APP_KEY persisten dari environment untuk enkripsi dan session.
if [ -z "${APP_KEY:-}" ]; then
    echo "[entrypoint] APP_KEY wajib diset sebagai environment variable." >&2
    exit 1
fi

sed -i "s/listen 8080 default_server;/listen ${PORT:-8080} default_server;/" /etc/nginx/http.d/default.conf

# 2) Pastikan symlink storage tersedia (best-effort, abaikan kalau sudah).
php artisan storage:link --force --quiet || true

# 3) Clear stale caches, rediscover packages (production-only), then cache.
php artisan config:clear --quiet
php artisan route:clear --quiet
php artisan view:clear --quiet
php artisan package:discover --ansi
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4) Migrasi DB (idempotent). Pastikan database tujuan benar.
php artisan migrate --force --no-interaction
# Akun hanya diinisialisasi secara eksplisit, bukan di-reset setiap restart.

# 5) Jalankan command yang diminta (default: supervisord).
exec "$@"
