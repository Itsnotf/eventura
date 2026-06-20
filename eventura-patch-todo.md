# Patch Eventura → "Palembang Event Center" — Todo untuk Claude Code

**Repo:** https://github.com/Itsnotf/eventura.git · **Basis:** commit `a4937c8`
**Stack:** Laravel 12 · Fortify · Spatie Permission · Inertia 2 · React 19 · TypeScript · Tailwind 4 · MySQL

Patch ini mencakup 4 perubahan: (1) navbar publik role-aware, (2a) cover image di card paket, (2b) lokasi brand jadi embed Google Maps, (3) redesign halaman auth split-screen bertema publik, (4) rename aplikasi + penyesuaian scope ke Palembang.

> **Konvensi yang sudah disepakati:**
> - Role di sistem: `admin`, `vendor`, `user` (= "Customer"). Guest = belum login. Gunakan hook `useRole()` (`isAdmin / isVendor / isUser`) dan `usePage<SharedData>().props.auth` (`auth.user`, `auth.roles`, `auth.permissions` **sudah** dishare lewat `HandleInertiaRequests` — tidak perlu ubah backend untuk navbar).
> - Tema publik: token Tailwind `lp-*` (mis. `lp-primary`, `lp-on-primary`, `lp-surface`, `lp-on-surface`, `lp-on-surface-variant`, `lp-surface-container`, `lp-outline-variant`), font `font-playfair` (heading) & `font-manrope` (body), aksen teal.
> - Nama aplikasi = `config('app.name')` (single source of truth). Jangan hardcode "Eventura" lagi.

**Urutan kerja:** Task 0 → 1 → 2a → 2b → 3 → verifikasi akhir.

---

## Task 0 — Rename ke "Palembang Event Center" + scope Palembang

Sumber kebenaran nama = `config('app.name')` dari `.env`. Ganti semua hardcode "Eventura" agar membaca config / prop `name`.

**File & langkah:**

1. **`.env`** dan **`.env.example`**: set
   ```
   APP_NAME="Palembang Event Center"
   ```
   `MAIL_FROM_NAME` dan `VITE_APP_NAME` sudah turunan dari `${APP_NAME}` → otomatis ikut. Jalankan `php artisan config:clear`.

2. **`app/Notifications/VendorApplicationApproved.php`** & **`VendorApplicationRejected.php`**: pada `->subject(...)`, ganti string "Eventura" → `config('app.name')` (mis. `"Selamat! Aplikasi {$this->brandName} Disetujui — " . config('app.name')`).

3. **`resources/views/mail/vendor-application-approved.blade.php`** & **`vendor-application-rejected.blade.php`**: ganti tiap "Eventura" → `{{ config('app.name') }}`.

4. **`database/seeders/UserSeeder.php`**: `'name' => 'Admin Eventura'` → `'Admin Palembang Event Center'`.

5. **`database/seeders/SiteSettingsSeeder.php`** (penyesuaian nama + scope Palembang):
   - `about_title`: `'Tentang Eventura'` → `'Tentang Palembang Event Center'`.
   - `about_description`: tulis ulang—ganti "Eventura" → "Palembang Event Center" dan ubah framing "di seluruh Indonesia" → fokus **Palembang** (mis. "...menghubungkan calon klien dengan Event Organizer (EO) dan Wedding Organizer (WO) profesional di Palembang dan sekitarnya.").
   - `contact_address`: `'Jakarta, Indonesia'` → `'Palembang, Sumatera Selatan, Indonesia'`.

6. **`resources/js/pages/landing/tentang-kami.tsx`**: fallback default `get(settings, 'about_title', 'Tentang Eventura')` → `'Tentang Palembang Event Center'`.

7. **Sapuan akhir:** `grep -rn "Eventura" resources/ app/ database/` dan `grep -rni "seluruh indonesia\|di Indonesia" resources/js` — perbaiki sisa yang relevan (mis. copy hero di `welcome.tsx` bila masih bilang "Indonesia", sesuaikan ke Palembang). Catatan: copy footer landing diurus di Task 1.

**Acceptance:** Tidak ada lagi string literal "Eventura" di UI/email; judul tab, footer, dan email memakai "Palembang Event Center"; tidak ada error setelah `config:clear`.

---

## Task 1 — Navbar publik role-aware (`resources/js/layouts/landing-layout.tsx`)

Ini perubahan terbesar. Kerjakan sekalian penghapusan konstanta nama (Task 0) di file yang sama.

**Hapus & ganti sumber nama:**
- Hapus `const APP_NAME = 'Eventura';`.
- Ambil dari shared props: `const { auth, name } = usePage<SharedData>().props;`. Pakai `name` di logo nav, `<h2>` footer, dan copyright footer.

**Struktur navbar (desktop):**
- **Nav kiri (semua role):** Beranda (`/`), Explore Brand (`/explore`), Portfolio (`/portfolio`), **Daftarkan Brand** (`/join`), Tentang Kami (`/tentang-kami`), Kontak (`/kontak`).
  - "Daftarkan Brand" **hanya tampil saat** `!auth?.user || isUser` (guest + customer). Sembunyikan untuk vendor & admin.
- **Sisi kanan:**
  - **Guest** (`!auth?.user`): dua tombol → **Masuk** (link ke `login()`), **Daftar** (link ke `register()`). Gunakan helper Wayfinder dari `@/routes` (konsisten dengan `login.tsx` yang sudah meng-import `register` dari `@/routes`). Tombol "Daftar" pakai style primary (`bg-lp-primary text-lp-on-primary`), "Masuk" style ghost/outline.
  - **Logged-in** (semua role): ikon profil/avatar → dropdown. Pakai komponen Radix `DropdownMenu` + `<UserInfo user={auth.user} />` untuk avatar (lihat pola di `resources/js/components/nav-user.tsx` dan `user-menu-content.tsx`). Untuk **Pengaturan** pakai `edit()` dari `@/routes/profile`; untuk **Keluar** pakai `logout()` dari `@/routes` dengan `<Link as="button">` + `onClick` yang memanggil `router.flushAll()` (mirror persis `user-menu-content.tsx`).

**Isi dropdown per role (versi ringkas, sesuai keputusan 1a):**
| Role | Item dropdown |
|------|---------------|
| `user` (Customer) | Dashboard (`/dashboard`), Inquiry Saya (`/my-inquiries`), Pengaturan, Keluar — *Favorit & Rencana Acara dipindah jadi ikon langsung di navbar, lihat sub-bagian di bawah* |
| `vendor` | Dashboard (`/dashboard`), Brand Saya (`/brands`), Inquiry / Lead (`/inquiries`), Pengaturan, Keluar |
| `admin` | Dashboard (`/dashboard`), Brands (`/brands`), Vendor Applications (`/vendor-applications`), Pengaturan, Keluar |

Tentukan role aktif via `useRole()`. Sertakan label nama + email user di atas dropdown (pakai `UserInfo` dengan `showEmail`).

**Ikon akses cepat di navbar (khusus customer `user`):** sesuai permintaan "favorit + keranjang perencanaan di beranda biar tak usah buka profil". Di sisi kanan navbar, **sebelum** ikon profil, tambahkan dua ikon link (hanya saat `isUser`):
- **Favorit** — ikon `Heart` (lucide), link ke `/favorites`. Badge berisi jumlah favorit dari `auth.favorite_brand_ids.length` (sembunyikan badge bila 0).
- **Rencana Acara / "keranjang"** — ikon keranjang/`CalendarDays` (atau `ShoppingCart` bila lebih sesuai konsep keranjang), link ke `/event-plans`.
Kedua ikon ini menggantikan posisi Favorit & Rencana Acara yang sebelumnya ada di dropdown (lihat tabel — dropdown customer kini hanya Dashboard, Inquiry Saya, Pengaturan, Keluar). Untuk vendor & admin, ikon ini tidak ditampilkan (mereka tidak punya fitur favorit/rencana acara). Replikasikan juga di menu mobile.

**Menu mobile** (blok `{open && (...)}`): replikasi logika yang sama — nav statis (dengan aturan visibilitas "Daftarkan Brand"), lalu untuk guest tampilkan tombol Masuk + Daftar, untuk logged-in tampilkan daftar item dropdown sesuai role + Keluar.

**Acceptance:**
- Guest: lihat logo, nav statis (termasuk "Daftarkan Brand" sebelum "Tentang Kami"), tombol Masuk + Daftar. Tidak ada tombol "Dashboard".
- Customer: ikon profil → menu (Dashboard, Favorit, Rencana Acara, Inquiry Saya, Pengaturan, Keluar). "Daftarkan Brand" tetap tampil di nav.
- Vendor & Admin: ikon profil → menu sesuai tabel; "Daftarkan Brand" hilang dari nav.
- Logout berfungsi (POST ke `logout()`), responsif di mobile, nama aplikasi = "Palembang Event Center".

---

## Task 2a — Cover image di card paket (`resources/js/pages/landing/brand-detail.tsx`)

`cover_image` sudah lengkap di backend (kolom model `BrandPackages`, upload di `BrandPackagesController@store/update`, input di form `brands-packages/create.tsx` & `edit.tsx`). **Hanya frontend** yang kurang.

**Langkah:**
1. Tambahkan field ke interface `BrandPackage` di file ini: `cover_image?: string | null;`.
2. Di komponen card paket (sekitar baris 280–360, ada dua varian render card), tambahkan gambar cover **full-width di atas card**:
   - Jika `pkg.cover_image` ada: `<img src={`/storage/${pkg.cover_image}`} alt={pkg.name} className="w-full aspect-[16/9] object-cover rounded-t-..." />` (samakan radius dengan sudut atas card).
   - Jika `null`: placeholder bertema — blok `aspect-[16/9]` dengan `bg-lp-surface-container` + ikon (mis. `ImageOff`/`CalendarPlus` dari lucide) di tengah, warna `text-lp-on-surface-variant`.
3. Pastikan layout card tetap rapi (gambar di atas, lalu nama/harga/aksi di bawah).

**Acceptance:** Paket dengan cover menampilkan gambarnya di card; paket tanpa cover menampilkan placeholder rapi (bukan kosong/rusak).

---

## Task 2b — Lokasi brand jadi embed Google Maps (tanpa migrasi)

**Keputusan:** pakai ulang kolom `address` yang ada (TIDAK ada migrasi baru). Yang disimpan = **URL `src` embed saja** (bukan tag `<iframe>` mentah). Render di frontend sebagai iframe, dengan fallback ke teks bila isinya bukan URL embed.

### Backend — normalisasi input

**`app/Http/Requests/BrandsRequest/CreateBrandRequest.php`** & **`UpdateBrandRequest.php`:**
- Tambahkan `prepareForValidation()` untuk mengekstrak `src` bila user menempel tag `<iframe>` utuh:
  ```php
  protected function prepareForValidation(): void
  {
      $value = $this->input('address');
      if ($value && preg_match('/<iframe[^>]*\ssrc=["\']([^"\']+)["\']/i', $value, $m)) {
          $this->merge(['address' => $m[1]]);
      }
  }
  ```
- Ubah rule `address`:
  ```php
  'address' => ['nullable', 'string', 'starts_with:https://www.google.com/maps/embed'],
  ```
- Tidak perlu ubah `BrandsController@store/update` (sudah menyimpan `$request->address`).

### Frontend — form input

**`resources/js/pages/brands/create.tsx`** & **`edit.tsx`** (field `address`):
- Ubah `<Label>` "Address" → **"Embed Google Maps Lokasi"**.
- Ganti `<Input>` menjadi `<textarea>` (snippet embed panjang); tetap `name="address"`, `defaultValue={brand.address}` pada edit.
- Tambah helper text: *"Buka Google Maps → pilih lokasi → Bagikan → tab 'Sematkan peta' → salin & tempel kode di sini."*
- `placeholder` contoh: `<iframe src="https://www.google.com/maps/embed?..." ...></iframe>`.

### Frontend — render

Buat util kecil (atau inline) untuk cek embed valid:
```ts
const isMapsEmbed = (v?: string | null) =>
    !!v && v.startsWith('https://www.google.com/maps/embed');
```

**`resources/js/pages/landing/brand-detail.tsx`** (blok address ~baris 453–458, di bawah ikon `MapPin`):
- Jika `isMapsEmbed(brand.address)`: render
  ```tsx
  <iframe
    src={brand.address}
    className="w-full h-64 rounded-lg border border-lp-outline-variant"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
    title={`Lokasi ${brand.name}`}
  />
  ```
- Else: fallback tampilkan `brand.address` sebagai teks (perilaku lama) — aman untuk data lama.

**`resources/js/pages/brands/show.tsx`** (preview admin/vendor, ~baris 272–282): terapkan logika `isMapsEmbed` yang sama (iframe bila embed, teks bila bukan).

### Seeder — `database/seeders/BrandSeeder.php`

Ganti **semua** nilai `'address' => '...'` (7 brand) dengan **URL `src`** dari embed yang diberikan (sementara semua brand pakai lokasi sama, NAKA SIGNATURE Palembang):
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.4023916126876!2d104.74149459698945!3d-2.9857035193349106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b7508da0f56a1%3A0x8b64644ca138db6d!2sNAKA%20SIGNATURE!5e0!3m2!1sid!2sid!4v1781983009350!5m2!1sid!2sid
```
(Catat: simpan **URL-nya saja**, bukan tag `<iframe>`, agar konsisten dengan yang disimpan dari form.)

**Acceptance:**
- Form brand menerima paste tag `<iframe>` maupun URL embed; keduanya tersimpan sebagai URL `src`.
- Input non-embed ditolak validasi (`starts_with`).
- Halaman detail brand & halaman show menampilkan peta ter-embed; data lama/non-embed jatuh ke teks (tidak rusak).
- Setelah reseed, ke-7 brand menampilkan peta Palembang.

---

## Task 3 — Redesign auth split-screen bertema publik

**Keputusan:** gaya **split-screen**; tata di **layout bersama** sehingga **semua** halaman auth ikut (login, register, forgot/reset password, 2FA challenge, verify email, confirm password); copy **login + register** diprioritaskan & diterjemahkan ke **Bahasa Indonesia**.

**Langkah:**

1. **`resources/js/layouts/auth/auth-split-layout.tsx`**: jadikan ini template auth aktif & ubah temanya ke tema publik:
   - Panel kiri (hidden di mobile): area branding — background `lp-primary`/gradient teal, logo + `name` (dari `config('app.name')` via shared prop), tagline singkat khas Palembang Event Center, font `font-playfair`. Boleh sertakan ilustrasi/foto bila ada aset.
   - Panel kanan: area form, background `lp-surface`, heading `font-playfair` `text-lp-primary`, body `font-manrope`. Terima props `title` & `description`.
2. **`resources/js/layouts/auth-layout.tsx`**: ganti import template dari `auth-simple-layout` → `auth-split-layout` (agar SEMUA halaman auth yang memakai `AuthLayout` ikut tema baru).
3. **`resources/js/pages/auth/login.tsx`** & **`register.tsx`**: terjemahkan `title`/`description` & label ke Bahasa Indonesia (mis. "Masuk ke akun Anda" / "Masukkan email dan kata sandi Anda"; "Buat akun baru" / "Lengkapi data di bawah untuk mendaftar"), dan sesuaikan label field (Email, Kata Sandi, Konfirmasi Kata Sandi, Ingat saya) + teks tombol & tautan ("Belum punya akun? Daftar", dst).
4. Pastikan komponen UI (`Input`, `Button`, `Checkbox`, `Label`, `InputError`, `TextLink`) tampil selaras dengan token `lp-*`. Sesuaikan styling tombol submit ke `bg-lp-primary text-lp-on-primary`.
5. Halaman auth lain (forgot/reset/2FA/verify) cukup ikut tema lewat layout; terjemahan copy-nya opsional (boleh menyusul).

**Acceptance:** Login & register tampil split-screen, konsisten dengan tema landing, berbahasa Indonesia, dan fungsional (login, register, validasi error, 2FA challenge tetap jalan). Semua halaman auth memakai layout bertema yang sama.

---

## Task 4 — Kategori CC & Catering + filter Explore

Brand baru memakai kategori `CC` (Content Creator) dan `Catering` yang belum dikenal sistem. Tambahkan di **frontend dan backend** (keduanya wajib — filter punya whitelist di controller).

1. **`resources/js/pages/landing/explore.tsx`**: tambahkan opsi ke array `CATEGORIES` →
   ```ts
   { value: 'CC', label: 'Content Creator' },
   { value: 'Catering', label: 'Catering' },
   ```
   Sesuaikan juga teks header explore yang masih berbunyi "Temukan EO & WO terbaik di Indonesia" → mencakup semua kategori + scope Palembang.
2. **`app/Http/Controllers/LandingController.php`**: ada **dua** tempat dengan whitelist `in_array($request->category, ['EO', 'WO'])` (di `home()` ~baris 33 dan `explore()` ~baris 128). Ubah keduanya menjadi:
   ```php
   in_array($request->category, ['EO', 'WO', 'CC', 'Catering'])
   ```
   Backend memfilter via `whereJsonContains('category', $request->category)` — kode kategori harus persis sama dengan yang disimpan seeder (`'CC'`, `'Catering'`).

**Acceptance:** Tab kategori di Explore menampilkan EO, WO, Content Creator, Catering; filter benar-benar memfilter brand sesuai kategorinya (bukan diabaikan backend).

---

## Task 5 — Seed data 8 brand (file sudah disediakan)

Empat seeder berikut **sudah ditulis lengkap** dan disertakan terpisah (folder `seeders/`). Tinggal **timpa** file dengan nama sama di `database/seeders/`:

- `ServiceCategorySeeder.php` — menambah kategori layanan **"Konten & Media Sosial"** (slug `konten-media-sosial`) untuk paket CC.
- `UserSeeder.php` — admin di-rename + **8 akun vendor** (1 pemilik per brand) + 4 customer. Semua password `password`.
- `BrandSeeder.php` — **8 brand** (3 WO, 2 EO, 2 CC, 1 Catering) dengan `address` berisi embed Maps Palembang, WhatsApp `0895620512465`, dan handle Instagram bersih. `logo` & `cover_image` sengaja `null`.
- `BrandPackagesSeeder.php` — **36 paket** sesuai dokumen, harga tunggal di `price_start` (`price_end = null`), daftar fasilitas di `description`, kategori layanan dipetakan (WO/EO → Paket Lengkap, CC → Konten & Media Sosial, Catering → Catering).

Urutan `DatabaseSeeder` yang ada sudah benar (ServiceCategory → User → Brand → BrandPackages). Jalankan:
```bash
php artisan migrate:fresh --seed
```
Setelah itu **logo brand, cover image brand, cover image paket, dan portofolio diisi manual** oleh pemilik (Kyn) — bukan bagian seeder.

**Catatan:** seeder sekunder (`TestimonialSeeder`, `FavoritesSeeder`, `PortfolioSeeder`) memakai `continue` saat slug brand tak ditemukan, jadi tidak crash. Karena brand "Endless" kini berslug `endless-creative-production` (sebelumnya `endless-production`) dan "Kuliner Wong Kito" brand baru, baris demo lama yang menunjuk slug usang akan dilewati — aman, hanya sebagian data demo testimoni/favorit yang tidak terisi untuk kedua brand itu.

---

## Verifikasi akhir

```bash
# Backend & seeder
php artisan config:clear
php artisan migrate:fresh --seed   # pastikan seeder baru jalan tanpa error

# Frontend
npm run build                      # pastikan tidak ada error TypeScript/build
```

Cek manual:
- Login sebagai masing-masing role (admin / vendor / user) → verifikasi navbar publik & dropdown sesuai tabel Task 1.
- Sebagai customer: ikon Favorit (dengan badge) & Rencana Acara muncul langsung di navbar; vendor/admin tidak.
- Buka Explore → tab kategori menampilkan EO, WO, Content Creator, Catering dan filternya berfungsi.
- Setelah `migrate:fresh --seed`: ada 8 brand dengan paket lengkap, peta Palembang tampil di detail, tombol WhatsApp mengarah ke `wa.me/62895620512465`, dan link Instagram tiap brand benar.
- Buka detail brand → card paket (cover/placeholder) + peta ter-embed (Task 2a & 2b).
- Buka `/login` & `/register` → tampilan split-screen bertema (Task 3).
- Judul tab & footer = "Palembang Event Center"; copy mengarah ke Palembang (Task 0).

**Catatan untuk BAB 3:** kolom `address` kini menyimpan URL embed maps (bukan alamat teks). Jika ingin kamus data rapi, rename kolom `address` → `maps_embed` di kemudian hari (migrasi sepele) — di luar scope patch ini sesuai keputusan.

---

## Changelog — Perubahan yang Sudah Diterapkan

> Dicatat oleh Claude Code pada 2026-06-21.

### Task 0 — Rename Eventura → Palembang Event Center ✅

| File | Perubahan |
|------|-----------|
| `.env` | `APP_NAME="Eventura"` → `"Palembang Event Center"` |
| `.env.example` | `APP_NAME=Laravel` → `"Palembang Event Center"` |
| `app/Notifications/VendorApplicationApproved.php` | Subject hardcode `"— Eventura"` → `"— " . config('app.name')` |
| `app/Notifications/VendorApplicationRejected.php` | Subject hardcode `"— Eventura"` → `"— " . config('app.name')` |
| `resources/views/mail/vendor-application-approved.blade.php` | Dua kemunculan `Eventura` → `{{ config('app.name') }}` |
| `resources/views/mail/vendor-application-rejected.blade.php` | `ke Eventura` → `ke {{ config('app.name') }}` |
| `database/seeders/SiteSettingsSeeder.php` | `about_title`, `about_tagline`, `about_description`, `about_vision` diganti scope Palembang; `contact_address` → Palembang |
| `resources/js/pages/landing/tentang-kami.tsx` | Fallback `'Tentang Eventura'` → `'Tentang Palembang Event Center'` |

> `UserSeeder.php` & `BrandSeeder.php` sudah menggunakan konten baru sebelum patch — tidak diubah.

### Task 1 — Navbar publik role-aware ✅

| File | Perubahan |
|------|-----------|
| `resources/js/layouts/landing-layout.tsx` | **Tulis ulang lengkap.** Hapus `const APP_NAME = 'Eventura'`, ambil `name` dari shared props. Nav kiri: + "Daftarkan Brand" (hanya guest/user). Sisi kanan: guest → Masuk + Daftar; logged-in → dropdown role-aware (admin/vendor/user) via Radix `DropdownMenu` + `UserInfo`. Quick-icons Favorit (Heart + badge) & Rencana Acara (CalendarDays) hanya untuk role `user`. Menu mobile mereplikasi logika yang sama. Footer pakai `{name}` + scope Palembang. |

### Task 2a — Cover image di card paket ✅

| File | Perubahan |
|------|-----------|
| `resources/js/pages/landing/brand-detail.tsx` | Import `ImageOff` dari lucide. Tambah block cover image (`aspect-[16/9]`) di atas kedua varian card paket (featured & regular). Jika `pkg.cover_image` ada: `<img />`; jika `null`: placeholder `ImageOff`. |

### Task 2b — Lokasi brand jadi embed Google Maps ✅

| File | Perubahan |
|------|-----------|
| `app/Http/Requests/BrandsRequest/CreateBrandRequest.php` | Tambah `prepareForValidation()` (ekstrak `src` dari tag `<iframe>`); ubah rule `address` → `starts_with:https://www.google.com/maps/embed`; update `category.*` → `in:EO,WO,CC,Catering` |
| `app/Http/Requests/BrandsRequest/UpdateBrandRequest.php` | Sama dengan Create |
| `resources/js/pages/brands/create.tsx` | Label "Address" → "Embed Google Maps Lokasi"; placeholder → contoh `<iframe>`; tambah helper text |
| `resources/js/pages/brands/edit.tsx` | Sama dengan create.tsx |
| `resources/js/pages/landing/brand-detail.tsx` | Tambah util `isMapsEmbed()`; blok address: jika embed → render `<iframe>`; jika bukan → fallback teks |
| `resources/js/pages/brands/show.tsx` | Tambah util `isMapsEmbed()`; blok Address: iframe bila embed, teks bila bukan; label "Address" → "Lokasi" |

### Task 3 — Auth split-screen bertema publik ✅

| File | Perubahan |
|------|-----------|
| `resources/js/layouts/auth/auth-split-layout.tsx` | **Tulis ulang.** Panel kiri: `bg-lp-primary` + gradient teal, logo, nama app, tagline khas Palembang (`font-playfair`). Panel kanan: `bg-lp-surface`, heading `font-playfair text-lp-primary`. |
| `resources/js/layouts/auth-layout.tsx` | Ganti import `auth-simple-layout` → `auth-split-layout` |
| `resources/js/pages/auth/login.tsx` | Terjemahkan ke Bahasa Indonesia: title, description, label Email/Kata Sandi, "Lupa kata sandi?", "Ingat saya", tombol "Masuk", link "Belum punya akun? Daftar". Tambah `bg-lp-primary` pada tombol submit. |
| `resources/js/pages/auth/register.tsx` | Terjemahkan ke Bahasa Indonesia: title, description, label Nama/Email/Kata Sandi/Konfirmasi, tombol "Daftar", link "Sudah punya akun? Masuk". Tambah `bg-lp-primary` pada tombol submit. |

### Task 4 — Kategori CC & Catering + filter Explore ✅

| File | Perubahan |
|------|-----------|
| `resources/js/pages/landing/explore.tsx` | Tambah `{ value: 'CC', label: 'Content Creator' }` dan `{ value: 'Catering', label: 'Catering' }` ke array `CATEGORIES`. Teks header diperbarui ke scope Palembang. |
| `app/Http/Controllers/LandingController.php` | Dua whitelist `in_array($request->category, ['EO', 'WO'])` → `['EO', 'WO', 'CC', 'Catering']` (method `home()` dan `explore()`). |

### Perintah setelah patch

```bash
php artisan config:clear
# Opsional setelah update seeder:
php artisan migrate:fresh --seed
# Build frontend:
npm run build
```
