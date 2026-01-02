# Erza Restaurant - Warung Sedap Nusantara

## Deskripsi Project
Website restoran Indonesia modern dengan sistem manajemen admin, autentikasi pengguna, dan keranjang belanja. Dibangun menggunakan React + Vite + TypeScript dengan Supabase sebagai backend (database, auth, storage).

---

## Tech Stack
- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** TailwindCSS + Custom CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Icons:** Lucide React
- **Routing:** React Router DOM v6

---

## Fitur Utama

### 🛒 Public (Customer)
- Landing page dengan hero section
- Menu makanan & minuman dengan kategori
- Keranjang belanja (cart)
- Pencarian produk
- Halaman About Us dengan lokasi & kontak
- Autentikasi (Login/Register)

### 👤 User (Authenticated)
- Akses ke keranjang belanja
- Checkout pesanan
- Lihat profil

### 👑 Admin Dashboard
- **Dashboard:** Overview statistik
- **Products:** CRUD produk (nama, deskripsi, harga, gambar, kategori, kalori)
- **Users:** Manajemen user, ubah role (admin/user), hapus user
- **Settings:** Pengaturan toko dinamis:
  - Logo & nama toko
  - Tagline
  - Nomor telepon, email, alamat
  - Jam operasional
  - Google Maps embed URL

---

## Database Schema (Supabase)

### Tabel `products`
| Column      | Type        | Description           |
|-------------|-------------|-----------------------|
| id          | UUID        | Primary key           |
| name        | TEXT        | Nama produk           |
| description | TEXT        | Deskripsi             |
| price       | INTEGER     | Harga dalam Rupiah    |
| image_url   | TEXT        | URL gambar produk     |
| category    | TEXT        | makanan/minuman/snack |
| calories    | INTEGER     | Kalori (opsional)     |
| created_at  | TIMESTAMPTZ | Tanggal dibuat        |

### Tabel `profiles`
| Column      | Type        | Description            |
|-------------|-------------|------------------------|
| id          | UUID        | User ID (FK auth.users)|
| email       | TEXT        | Email user             |
| full_name   | TEXT        | Nama lengkap           |
| username    | TEXT        | Username               |
| avatar_url  | TEXT        | URL foto profil        |
| role        | TEXT        | 'admin' atau 'user'    |

### Tabel `site_settings`
| Column      | Type        | Description            |
|-------------|-------------|------------------------|
| id          | UUID        | Primary key            |
| key         | TEXT        | Nama setting (unique)  |
| value       | TEXT        | Nilai setting          |
| updated_at  | TIMESTAMPTZ | Terakhir diupdate      |

**Settings yang tersedia:**
- `store_name` - Nama toko
- `store_tagline` - Tagline/slogan
- `logo_url` - URL logo
- `phone` - Nomor telepon
- `email` - Email kontak
- `address` - Alamat lengkap
- `operating_hours` - Jam operasional
- `maps_embed_url` - Google Maps embed URL

---

## Struktur Folder
```
src/
├── components/
│   ├── admin/          # Komponen admin (ProductFormModal, etc)
│   ├── common/         # Navbar, Footer
│   ├── home/           # Hero, FeaturedMenu, etc
│   ├── menu/           # MenuSection
│   └── about/          # AboutUs
├── hooks/
│   ├── useAuth.tsx     # Authentication hook
│   ├── useProducts.ts  # Fetch products
│   └── useSiteSettings.ts # Fetch site settings
├── layouts/
│   └── AdminLayout.tsx # Layout admin dengan sidebar
├── lib/
│   └── supabase.ts     # Supabase client
├── pages/
│   ├── admin/          # AdminDashboard, AdminProducts, AdminUsers, AdminSettings
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   ├── AboutPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── routes/
│   └── AppRoutes.tsx   # Routing configuration
└── types/
    └── index.ts        # TypeScript interfaces
```

---

## Autentikasi & Authorization
- **Supabase Auth** untuk login/register
- **Role-based access:** Admin email (admin@gmail.com) otomatis jadi admin
- **RLS Policies:** Keamanan di level database
  - Products: Public read, Admin write
  - Profiles: User bisa update sendiri, Admin bisa lihat/edit semua
  - Site Settings: Public read, Admin write

---

## Yang Belum Diimplementasi
- [ ] Integrasi pembayaran (Midtrans/Xendit)
- [ ] Order management system
- [ ] Order history untuk user
- [ ] Notifikasi (email/WhatsApp)
- [ ] Profile page untuk user edit data diri

---

## Cara Menjalankan
```bash
cd ErzaRestaurant
npm install
npm run dev
```

**Environment Variables (.env):**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
