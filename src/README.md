# 📦 SIGAP - Sistem Informasi Gerbang Paket

**Sistem Monitoring dan Penerimaan Paket Asrama Universitas Pertahanan**

## 🎯 Fitur Utama

### Halaman Publik
- ✅ Lihat daftar paket yang tersedia
- ✅ Cek status paket (Belum Diambil / Sudah Diambil)
- ✅ Lihat detail paket

### Dashboard Petugas
- ✅ Data Paket - Kelola semua paket masuk
- ✅ Tambah Paket - Input paket baru
- ✅ Riwayat Pengambilan - History paket yang sudah diambil
- ✅ Tandai Paket Diambil + Upload Foto Bukti

### Dashboard Admin
- ✅ Semua fitur Petugas +
- ✅ Statistik Dashboard (Total Paket, Status, dll)
- ✅ Manajemen Petugas
- ✅ Log Aktivitas - Track semua aksi pengguna

## 🎨 Design System

- **Warna Utama:** Hijau Militer (#2E4D3E)
- **Font:** Inter
- **Icons:** Lucide React
- **Style:** Modern dengan rounded corners & shadow ringan

## 🚀 Teknologi

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase Edge Functions (Hono)
- **Database:** Supabase (PostgreSQL KV Store)
- **Storage:** Supabase Storage (Foto bukti)
- **Auth:** Supabase Authentication

## 📖 Cara Menggunakan

### 1. Membuat Akun Admin Pertama

Gunakan Supabase Dashboard atau API tool untuk membuat akun:

```bash
POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ad438ac4/auth/signup

Body:
{
  "email": "admin@unhan.ac.id",
  "password": "admin123",
  "name": "Admin Utama",
  "role": "admin"
}
```

### 2. Login

1. Klik tombol "Login" di navbar
2. Masukkan email dan password
3. Pilih role (Admin/Petugas)
4. Klik "Login"

### 3. Mulai Menggunakan

- **Tambah Paket:** Menu "Tambah Paket" → Isi form → Simpan
- **Tandai Diambil:** Menu "Data Paket" → Klik ✓ → Upload foto → Konfirmasi
- **Lihat Riwayat:** Menu "Riwayat" → Klik "Lihat Bukti" untuk foto
- **Statistik:** Dashboard admin untuk lihat overview

## 📚 Dokumentasi Lengkap

Lihat file **[SUPABASE_GUIDE.md](./SUPABASE_GUIDE.md)** untuk:
- ✅ Panduan integrasi Supabase lengkap
- ✅ Endpoint API yang tersedia
- ✅ Struktur database
- ✅ Troubleshooting
- ✅ Best practices

## 🔐 Keamanan

- ✅ Autentikasi berbasis JWT (Supabase Auth)
- ✅ Role-based access (Admin/Petugas)
- ✅ Private storage untuk foto bukti
- ✅ Signed URLs untuk akses gambar
- ✅ Server-side validation

## 🎯 Fitur Khusus

### Modal Konfirmasi Pengambilan Paket
- ✅ Upload foto bukti serah terima
- ✅ Validasi file (format & ukuran)
- ✅ Preview foto sebelum upload
- ✅ Drag & drop support
- ✅ Checkbox konfirmasi petugas

## 📞 Development

```bash
# Aplikasi sudah deployed di Figma Make
# Tidak perlu setup lokal, langsung bisa digunakan!
```

## ⚠️ Catatan Penting

- Sistem ini untuk **prototyping** dan **demo purposes**
- Untuk production, pertimbangkan tambahan:
  - Rate limiting
  - Data encryption
  - Audit logging yang lebih detail
  - Email confirmation
  - Backup system

## 🎉 Status

✅ **Sistem sudah terintegrasi penuh dengan Supabase dan siap digunakan!**

---

**© 2025 Universitas Pertahanan**
