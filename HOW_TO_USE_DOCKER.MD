# Panduan Deployment Elaris Noir (Docker)

Panduan ini menjelaskan cara menggunakan Docker Compose untuk mengelola seluruh ekosistem Elaris Noir (Frontend & Backend). Menggunakan Docker Compose jauh lebih MUDAH daripada menjalankan Dockerfile satu per satu secara manual.

## 🚀 Mengapa Menggunakan Docker Compose?
- **Satu Perintah:** Cukup satu perintah untuk menjalankan BE dan FE sekaligus.
- **Manajemen Otomatis:** Otomatis mengatur port, environment variable, dan batas memori (RAM) sesuai konfigurasi.
- **Auto-Restart:** Jika server mati lalu nyala lagi, container akan otomatis jalan sendiri.
- **Log Terpusat:** Bisa melihat log BE dan FE dalam satu tampilan.

---

## 🛠️ Cara Deploy / Re-deploy
Setiap kali Anda melakukan perubahan kode di folder `fe` atau `be`, lakukan langkah berikut:

1. **Masuk ke folder project utama:**
   ```bash
   cd /home/arkan/projects/Elaris-Noir-
   ```

2. **Update, Build, dan Jalankan:**
   Perintah ini akan mendeteksi perubahan, membangun ulang image, dan menjalankan ulang container di latar belakang.
   ```bash
   docker compose up -d --build
   ```

3. **Cek status layanan:**
   ```bash
   docker ps
   ```
   Anda akan melihat dua container: `elaris-fe` dan `elaris-be`.

---

## 🔍 Perintah Berguna Lainnya

- **Melihat Log (Monitoring):**
  ```bash
  docker compose logs -f
  ```
- **Menghentikan Semua Layanan:**
  ```bash
  docker compose down
  ```
- **Melihat Penggunaan RAM:**
  ```bash
  docker stats
  ```

---

## ⚙️ Detail Konfigurasi
- **Frontend:** Berjalan di port `3005` (Internal `3000`).
- **Backend:** Berjalan di port `8088` (Internal `8080`).
- **RAM Limit:** FE dibatasi **384MB**, BE dibatasi **128MB**. Ini sangat aman dan tidak akan memakan RAM 10GB lagi seperti sebelumnya.
- **Proxy:** Caddy akan mengarahkan trafik dari domain `elarisnoir.my.id` ke port-port di atas secara otomatis.
