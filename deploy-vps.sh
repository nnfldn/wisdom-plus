#!/bin/bash
# WisDom+ VPS Automated Setup Script
# Run this script on a fresh Ubuntu 22.04 / 24.04 VPS as root.

set -e

echo "==========================================="
echo "   🚀 Memulai Setup VPS untuk WisDom+ 🚀   "
echo "==========================================="

# 1. Update OS
echo "[1/4] Mengupdate sistem operasi..."
apt update && apt upgrade -y

# 2. Setup Swap Memori (Sangat Penting untuk VPS 1GB RAM)
echo "[2/5] Menyiapkan 2GB Swap Memory agar Docker tidak OOM..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    echo "Swap 2GB berhasil diaktifkan."
else
    echo "Swap memory sudah aktif, melewati tahap ini."
fi

# 3. Instalasi Docker & Docker Compose
echo "[3/5] Menginstal Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "Docker berhasil diinstal."
else
    echo "Docker sudah terinstal, melewati tahap ini."
fi

# 4. Setup UFW Firewall
echo "[4/5] Mengkonfigurasi Firewall (UFW)..."
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw --force enable

# 5. Instruksi Selanjutnya
echo "[5/5] Selesai!"
echo "==========================================="
echo "✅ Server siap digunakan!"
echo "Langkah selanjutnya:"
echo "1. Pindahkan (clone/copy) kode project ini ke server."
echo "2. Buat file .env dari .env.example dan isi kredensial Supabase Anda."
echo "3. Build image: docker build -t wisdom-plus ."
echo "4. Jalankan container dengan environment production sesuai README.md."
echo "==========================================="
