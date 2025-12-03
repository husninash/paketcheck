# 🚀 Panduan Integrasi Supabase untuk SIGAP

## ✅ Status Integrasi

Aplikasi SIGAP Anda sekarang sudah **ter connected dengan Supabase** dan siap digunakan!

## 📋 Yang Sudah Terintegrasi

### ✅ Backend API (Server)
**File:** `/supabase/functions/server/index.tsx`

**Endpoints yang Tersedia:**
- `POST /make-server-ad438ac4/auth/signup` - Daftar akun baru
- `GET /make-server-ad438ac4/paket` - Get semua paket
- `GET /make-server-ad438ac4/paket/:id` - Get paket by ID
- `POST /make-server-ad438ac4/paket` - Tambah paket baru (requires auth)
- `PUT /make-server-ad438ac4/paket/:id/status` - Update status paket (requires auth)
- `POST /make-server-ad438ac4/paket/:id/pickup` - Tandai diambil + upload foto (requires auth)
- `DELETE /make-server-ad438ac4/paket/:id` - Hapus paket (requires auth)
- `GET /make-server-ad438ac4/riwayat` - Get riwayat pengambilan
- `GET /make-server-ad438ac4/petugas` - Get daftar petugas (requires auth)
- `GET /make-server-ad438ac4/logs` - Get activity logs (requires auth)
- `GET /make-server-ad438ac4/stats` - Get statistik (requires auth)

### ✅ Database Storage
**Menggunakan:** Supabase KV Store (PostgreSQL)

**Data yang Disimpan:**
- `paket:{id}` → Data paket lengkap
- `user:{id}` → Data user (admin/petugas)
- `riwayat:{id}` → History pengambilan paket
- `log:{timestamp}` → Activity logs

### ✅ File Storage
**Bucket:** `make-ad438ac4-bukti-paket` (private bucket)

**Menyimpan:** Foto bukti serah terima paket dengan signed URLs

### ✅ Authentication
**Menggunakan:** Supabase Auth

**Fitur:**
- Sign up dengan email + password
- Login dengan role-based access (admin/petugas)
- Auto-confirm email (karena email server belum dikonfigurasi)
- Session management

### ✅ Frontend Integration
**File:** `/utils/api.ts` - Helper functions untuk memanggil API

**App.tsx sudah diupdate:**
- State management terhubung dengan Supabase
- Auto-load data saat app start
- Auto-check auth state
- Real-time refresh setelah CRUD operations

---

## 🎯 Cara Menggunakan

### 1️⃣ Membuat Akun Admin/Petugas Pertama

Karena ini sistem baru, Anda perlu membuat akun pertama secara manual:

**Option A: Via Browser Console**
```javascript
// Buka browser console (F12) di aplikasi
const response = await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ad438ac4/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'admin@unhan.ac.id',
    password: 'admin123',
    name: 'Admin Utama',
    role: 'admin'
  })
});
const data = await response.json();
console.log(data);
```

**Option B: Via API Testing Tool (Postman/Insomnia)**
```
POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ad438ac4/auth/signup

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ANON_KEY

Body:
{
  "email": "admin@unhan.ac.id",
  "password": "admin123",
  "name": "Admin Utama",
  "role": "admin"
}
```

### 2️⃣ Login ke Sistem

1. Buka aplikasi SIGAP
2. Klik tombol **"Login"** di navbar
3. Masukkan kredensial:
   - **Email:** admin@unhan.ac.id
   - **Password:** admin123
   - **Role:** Administrator
4. Klik **"Login"**

### 3️⃣ Menggunakan Fitur

**✅ Tambah Paket (Petugas/Admin)**
- Masuk ke menu "Tambah Paket"
- Isi form data paket
- Klik "Simpan"
- Data otomatis tersimpan ke Supabase

**✅ Tandai Paket Diambil**
- Masuk ke menu "Data Paket"
- Klik tombol ✓ (checkmark) di kolom Aksi
- Upload foto bukti serah terima
- Centang konfirmasi
- Klik "Simpan & Tandai Diambil"
- Foto akan diupload ke Supabase Storage

**✅ Lihat Riwayat**
- Masuk ke menu "Riwayat Pengambilan"
- Lihat semua paket yang sudah diambil
- Klik "Lihat Bukti" untuk melihat foto

**✅ Statistik (Admin)**
- Dashboard admin menampilkan:
  - Total Paket
  - Belum Diambil
  - Sudah Diambil
  - Total di Riwayat

**✅ Log Aktivitas (Admin)**
- Semua aksi tercatat otomatis:
  - Tambah paket
  - Update status
  - Hapus paket
  - Tandai diambil

---

## 🔐 Keamanan

### Data yang Protected dengan Auth:
- ✅ Tambah paket
- ✅ Update status paket
- ✅ Hapus paket
- ✅ Upload foto bukti
- ✅ Lihat log aktivitas
- ✅ Lihat daftar petugas

### Data Public (Tanpa Auth):
- ✅ Lihat daftar paket (halaman beranda)
- ✅ Lihat riwayat pengambilan

---

## 📝 Struktur Database (KV Store)

### Paket
```typescript
{
  id: "PKT1234567890",
  name: "John Doe",
  nim: "123456",
  prodi: "Teknik Informatika",
  phoneNumber: "08123456789",
  packageType: "Paket Biasa",
  status: "Belum Diambil" | "Sudah Diambil",
  arrivalDate: "2025-12-03",
  pickupDate: "2025-12-04" | null,
  buktiPhoto: "https://signed-url..." | null,
  petugas: "Nama Petugas" | null,
  createdBy: "user-uuid",
  createdAt: "2025-12-03T10:00:00Z"
}
```

### User
```typescript
{
  id: "user-uuid",
  email: "admin@unhan.ac.id",
  name: "Admin Utama",
  role: "admin" | "petugas",
  nim: "123456" (optional),
  createdAt: "2025-12-03T10:00:00Z"
}
```

### Riwayat
```typescript
{
  id: "PKT1234567890",
  name: "John Doe",
  nim: "123456",
  prodi: "Teknik Informatika",
  pickupDate: "2025-12-04",
  petugas: "Nama Petugas",
  buktiPhoto: "https://signed-url...",
  // ... data lainnya dari paket
}
```

### Log
```typescript
{
  timestamp: "2025-12-03T10:00:00Z",
  user: "admin@unhan.ac.id",
  action: "Tambah Paket",
  detail: "John Doe - 123456"
}
```

---

## 🐛 Troubleshooting

### ❌ "Unauthorized" Error
**Solusi:** Pastikan sudah login terlebih dahulu. Token auth otomatis diambil dari session.

### ❌ "Failed to fetch paket"
**Solusi:** 
1. Check console browser untuk error detail
2. Pastikan server Supabase running
3. Check network tab untuk response error

### ❌ "Failed to upload photo"
**Solusi:**
1. Pastikan file size < 5MB
2. Format harus .jpg, .png, atau .heic
3. Check bucket sudah dibuat (otomatis saat server start)

### ❌ Data tidak muncul
**Solusi:**
1. Refresh browser
2. Check console untuk error
3. Coba logout dan login lagi

---

## 🚀 Next Steps (Opsional)

### 1. Setup Email Server
Jika ingin email confirmation real:
- Setup SMTP di Supabase Dashboard
- Ubah `email_confirm: true` menjadi `false` di signup endpoint

### 2. Tambah Social Login
Untuk login dengan Google, etc:
- Aktifkan provider di Supabase Dashboard → Authentication → Providers
- Ikuti panduan: https://supabase.com/docs/guides/auth/social-login

### 3. Real-time Updates
Tambahkan Supabase Realtime untuk auto-refresh data tanpa reload:
```typescript
supabase
  .channel('paket-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'kv_store_ad438ac4' }, 
    payload => {
      refreshData();
    }
  )
  .subscribe();
```

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check error di browser console (F12)
2. Check server logs di Supabase Dashboard → Edge Functions → Logs
3. Check database di Supabase Dashboard → Table Editor

---

## ✨ Selamat! Sistem SIGAP Anda Sudah Siap Digunakan dengan Database Real! 🎉
