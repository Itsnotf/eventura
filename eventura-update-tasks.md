# Eventura — Rencana Update & Task Breakdown (v2 — FINAL / PM-Decided)

> **Status:** FINAL. Semua keputusan yang sebelumnya menunggu konfirmasi **sudah diputuskan** (lihat §1). Tidak ada lagi item menggantung. **Claude Code dapat langsung mengeksekusi** sesuai urutan.
>
> **Peran saya di dokumen ini:** Project Manager. Saya yang bertanggung jawab atas keputusan ruang lingkup & desain produk di bawah ini. Bila Claude Code menemukan ambiguitas teknis murni, putuskan dengan cara paling sederhana yang konsisten dengan §2 lalu catat di PR — **jangan menghentikan eksekusi untuk pertanyaan produk yang sudah dijawab di §1.**
>
> **Stack:** Laravel 12 · Inertia 2 · React 19 · TypeScript · Tailwind 4 · Fortify (auth + 2FA) · Spatie Permission · shadcn/ui.

---

## 0. Cara Pakai Dokumen Ini (untuk Claude Code)

1. **Kerjakan per fase, berurutan** (Fase 0 → 5). Fase bawah bergantung pada fase atas.
2. **Satu task = satu unit kerja.** Selesaikan, ceklis `[x]`, commit, lanjut. Buat commit kecil per task dengan pesan jelas yang menyebut ID task (mis. `feat(1.3): vendor application public form`).
3. **Baca §1 (Keputusan FINAL) dan §2 (Konvensi) sebelum koding apa pun.** Itu sumber kebenaran.
4. **Aditif & tidak merusak.** Migration aditif; route/fitur/perilaku lama tetap jalan kecuali task memintanya diubah.
5. **Semua operasi tulis lewat Form Request + validasi.** Semua otorisasi lewat permission/role + cek kepemilikan (§2).
6. **Setiap modul baru wajib: minimal 1 Pest feature test happy-path + 1 test otorisasi negatif** (mis. vendor lain tak bisa mengelola data orang lain).
7. **Setiap modul baru wajib punya seeder demo idempotent** agar UI tidak kosong saat dev (§1-D14).
8. Label ukuran tiap task: **(S)** ≤½ hari · **(M)** ~1–2 hari · **(L)** ~3–5 hari (untuk satu agen fokus; perkiraan kasar, bukan kontrak).

---

## 1. Keputusan FINAL (Decision Log) — terkunci

> Ini hasil diskusi + keputusan PM. Perubahan ruang lingkup harus memperbarui bagian ini lebih dulu.

**Peran & akses**
- **D1 — Tiga peran:** `admin` (kelola semua), `vendor` (kelola HANYA data miliknya), `user` (pelanggan: testimoni+rating, simulasi, favorit, menghubungi vendor).
- **D2 — Testimoni TERKURASI:** vendor memilih testimoni mana yang tampil publik; vendor TIDAK bisa mengedit isi/rating, hanya publish/unpublish.
- **D3 — Rating menyatu dengan testimoni:** tidak ada modul rating terpisah. Satu testimoni = teks + bintang 1–5. **Rata-rata dihitung hanya dari testimoni yang dipublikasikan**, ditampilkan beserta jumlahnya.
- **D6 — Registrasi:** `user` daftar sendiri (publik, otomatis role `user`). `vendor` lewat `/join` (form + unggah berkas) → disetujui admin. Registrasi publik tidak pernah membuat vendor/admin.

**Simulasi & konversi**
- **D4 — Simulasi berujung aksi:** dari satu rencana, user bisa menghubungi para vendor di dalamnya (memicu Inquiry).
- **D5 — Estimasi = RENTANG:** total simulasi = Σ price_start … Σ price_end (bukan satu angka).
- **D8 — WhatsApp tetap ada** sebagai opsi sekunder; Inquiry adalah penangkap lead utama di platform.

**Keputusan PM baru (yang tadinya terbuka — sekarang DIPUTUSKAN):**
- **D9 — Daftar Kategori Layanan (FINAL):** seed 10 kategori berikut → **Paket Lengkap (Full Event/Wedding)**, **Catering**, **Dekorasi**, **Dokumentasi (Foto & Video)**, **Rias & Busana**, **Sound System & Lighting**, **Venue / Gedung**, **MC & Hiburan**, **Undangan & Souvenir**, **Lainnya**. (Admin tetap bisa menambah/ubah lewat CRUD.)
- **D10 — Paket bundel vs single-service (R1 diputuskan):** TIDAK ada perombakan model. Tiap paket di-tag **satu** `service_category` utama, dan kolom ini **wajib (required)** ke depan. **Backfill** semua paket existing ke kategori **"Paket Lengkap"**. Simulasi memilih **maksimal satu paket per kategori** lintas vendor; paket bundel tetap bisa dipilih (mengisi slot "Paket Lengkap"). Vendor didorong (lewat UI, bukan paksaan) membuat paket per-layanan agar mix-and-match maksimal.
- **D11 — Badge "Terverifikasi" pada testimoni (R3 diputuskan):** setiap `user` login boleh menulis **1 testimoni per brand**. Badge "Terverifikasi" ditampilkan bila user tsb punya ≥1 Inquiry ke brand itu — **dihitung saat render (query), tanpa kolom baru**, sehingga aman terhadap urutan fase (kalau modul Inquiry belum ada, badge sekadar tidak muncul). Tidak memblok penulisan testimoni.
- **D12 — Dashboard pelanggan:** `DashboardController` menangani **tiga** cabang peran. `user` mendapat dashboard aktivitas (rencana, favorit, inquiry terkirim). Halaman aktivitas pelanggan berada di **app shell terotentikasi** (layout dashboard), bukan di landing publik.
- **D13 — Navigasi per peran:** sidebar/menu bercabang sesuai peran (admin / vendor / user). Item yang tak relevan dengan peran tidak ditampilkan.
- **D14 — Seed data demo:** setiap modul baru menyertakan seeder demo idempotent (testimoni, favorit, inquiry, rencana, kategori) untuk pengembangan.

**Di luar ruang lingkup**
- **D7 — Monetisasi:** belum dibahas → jangan bangun fitur berbayar. (Catatan keterkaitan teknis di §6.)

---

## 2. Konvensi & Aturan Main (WAJIB sebelum koding)

**Penamaan model & tabel**
- Ikuti konvensi codebase: **nama model JAMAK** (`Brands`, `BrandPackages`, …). Model baru: `Testimonials`, `Favorites`, `Inquiries`, `EventPlans`, `EventPlanItems`, `ServiceCategories`, `BrandUnavailableDates`, `VendorApplications`.
- Selalu **set `protected $table` eksplisit** dan **sebut FK eksplisit** di relasi (gaya model yang ada). Jangan andalkan tebakan pluralizer.
- *(Standardisasi ke nama tunggal idiomatis = refactor masa depan, DI LUAR ruang lingkup. Jangan rename model lama.)*

**RBAC / permission**
- Pola permission: string `'{resource} {action}'` (mis. `'testimonials index'`). Controller dashboard `implements HasMiddleware` + `public static function middleware()` dengan `new Middleware('permission:...', only:[...])`.
- **Wajib tambah `Gate::before` admin** di `AppServiceProvider::boot()`:
  `Gate::before(fn ($user) => $user->hasRole('admin') ? true : null);`
- **Scoping kepemilikan vendor** (pola dari `BrandPackagesController`):
  `if (!$user->hasRole('admin') && $user->brand && $resource->brand_id != $user->brand->id) { abort(403); }`
- **Semua seeder permission/role idempotent** (`firstOrCreate`) agar bisa dijalankan ulang di DB existing.

**Validasi & upload**
- Upload lewat Form Request dengan `mimes` + `max` (ikuti `StoreImagePortfolioRequest`). Disk: `public`. Berkas dokumen vendor: `pdf,jpg,jpeg,png`, `max:5120`.
- **Mata uang = Rupiah, integer, tanpa desimal.**

**Frontend**
- Halaman dashboard: `resources/js/pages/<modul>/`. Halaman publik: `resources/js/pages/landing/`. Aktivitas pelanggan: app shell terotentikasi.
- **Pakai komponen shadcn/ui yang ada** (`resources/js/components/ui/`). Jangan tambah dependency UI baru tanpa alasan kuat.
- Perbarui **navigasi** (mis. `nav-main.tsx`, `app-sidebar.tsx`) per peran setiap kali modul baru ditambahkan (D13).
- Untuk state yang dibutuhkan lintas halaman (status favorit, flag peran), **tambahkan ke shared props Inertia** di `HandleInertiaRequests::share()` bila perlu (mis. daftar `favorite_brand_ids` untuk user login).

**Testing & DoD** → lihat §7.

---

## 3. Ringkasan Perubahan Database

**Tabel baru**

| Tabel | Fungsi | Task |
|---|---|---|
| `vendor_applications` | Aplikasi pendaftaran vendor + berkas | 1.3/1.4 |
| `service_categories` | Master kategori layanan | 2.1 |
| `testimonials` | Testimoni + rating (terkurasi) | 3.1 |
| `favorites` | Shortlist vendor milik user | 3.2 |
| `event_plans` | Header rencana/simulasi | 4.1 |
| `event_plan_items` | Item paket dalam rencana | 4.1 |
| `inquiries` | Lead dari user ke vendor | 4.2 |
| `brand_unavailable_dates` | Tanggal vendor penuh | 4.3 |

**Perubahan kolom**

| Tabel | Perubahan | Task |
|---|---|---|
| `brand_packages` | `price_start`,`price_end`: `string` → `unsignedBigInteger` | 2.2 |
| `brand_packages` | + `service_category_id` (FK, **required** ke depan; backfill "Paket Lengkap") | 2.1 |
| `brands` | + `is_verified` (bool default false), `verified_at` (nullable) | 3.3 |

---

## 4. Ringkasan Permission Baru

Tambahkan ke `PermissionSeeder`; assign ke peran via `RoleSeeder` (admin lolos via `Gate::before`).

- **vendor_applications:** `index`,`show`,`approve`,`reject` → admin
- **service_categories:** `index`,`create`,`edit`,`delete` → admin
- **brands:** `verify` → admin
- **testimonials:** `create` → user; `index`,`moderate` (milik sendiri) → vendor
- **favorites:** `index`,`create`,`delete` → user
- **event_plans:** `index`,`create`,`edit`,`delete` → user
- **inquiries:** `create` → user; `index`,`show`,`update` (milik sendiri) → vendor
- **availability:** `manage` → vendor

> **Wajib:** permission modul lama (`brands edit/show`, `brands packages *`, `brands portfolios *`) **di-grant ke role `vendor`** (saat ini role itu tak punya permission = bug). Lihat 1.1.

---

## 5. Peta Fase, Milestone & Effort

```
M1  Pondasi      = FASE 0 (hygiene)  + FASE 1 (peran & akun)
M2  Enabler      = FASE 2 (kategori layanan + harga numerik)
M3  Engagement   = FASE 3 (testimoni+rating, favorit, verified)
M4  Diferensiator= FASE 4 (simulasi, inquiry, ketersediaan)
M5  Discovery    = FASE 5 (filter + banding)
```

**Tabel ringkas effort & milestone**

| Task | Judul singkat | Ukuran | Milestone |
|---|---|---|---|
| 0.1 | Hapus controller duplikat | S | M1 |
| 0.2 | Hapus halaman React duplikat | S | M1 |
| 0.3 | Fix otorisasi + pesan di Brands.update | S | M1 |
| 0.4 | Perketat kepemilikan brand | S | M1 |
| 0.5 | Hilangkan write-on-read featured | M | M1 |
| 1.1 | Restrukturisasi peran & permission | L | M1 |
| 1.2 | Registrasi user (role-aware) | M | M1 |
| 1.3 | Aplikasi vendor — publik | M | M1 |
| 1.4 | Aplikasi vendor — admin (approve) | L | M1 |
| 1.5 | Routing dashboard 3 peran + nav | M | M1 |
| 2.1 | Kategori layanan pada paket | L | M2 |
| 2.2 | Harga string → numerik | M | M2 |
| 3.1 | Testimoni + rating (terkurasi) | L | M3 |
| 3.2 | Favorit / shortlist | M | M3 |
| 3.3 | Badge terverifikasi | S | M3 |
| 4.1 | Simulasi / event plan | L | M4 |
| 4.2 | Inquiry / lead | L | M4 |
| 4.3 | Ketersediaan tanggal | M | M4 |
| 5.1 | Filter lanjutan + banding | L | M5 |

**Inti "loop produk" minimum** (jika ingin demo paling cepat bernilai): 1.1 → 1.2 → 2.1 → 2.2 → 4.1 → 4.2. Itu memberi: pelanggan bisa daftar, paket berkategori & berharga benar, menyusun simulasi, dan menghubungi vendor. Sisanya memperkaya kepercayaan & penemuan.

---

# FASE 0 — Hygiene & Perbaikan Bug

### [ ] 0.1 — Hapus controller duplikat (dead code) **(S)**
- **Konteks:** `app/Http/Controllers/ImagePorfolioController.php` (salah eja) berisi class identik dengan `ImagePortfolioController.php`; tak ter-autoload, hanya membingungkan.
- **Aksi:** hapus file salah eja. Pastikan `routes/web.php` tetap menunjuk `ImagePortfolioController`.
- **Selesai bila:** file terhapus; upload/hapus gambar portfolio tetap berfungsi.

### [ ] 0.2 — Hapus halaman React duplikat **(S)**
- **Aksi:** verifikasi `resources/js/pages/brands-portfolios/show_new.tsx` tak direferensikan, lalu hapus. (`show.tsx` yang dipakai.)
- **Selesai bila:** file terhapus; halaman detail portfolio dashboard normal.

### [ ] 0.3 — Fix otorisasi & pesan tidak profesional di `BrandsController::update` **(S)**
- **Konteks:** non-admin yang mengedit brand orang lain mendapat flash `'success'` berisi `'gak boleh nakal yah.'`.
- **Aksi:** ganti `abort(403)` (mengikuti pola penolakan `BrandPackagesController`). Hapus semua teks slang.
- **Selesai bila:** non-admin mengubah brand bukan miliknya → 403; tak ada teks tidak profesional.

### [ ] 0.4 — Perketat kepemilikan brand di `store`/`update` **(S)**
- **Aksi:** untuk non-admin, paksa `user_id = Auth::id()` (abaikan input); cegah brand kedua (`User::brand` = `hasOne`). Selaraskan dengan pola `BrandPackagesController`.
- **Selesai bila:** non-admin tak bisa membuat brand atas nama orang lain / brand ganda.

### [ ] 0.5 — Hilangkan write-on-read pada rotasi "featured" **(M)**
- **Konteks:** `LandingController::home()` `increment('featured_count')` tiap GET `/` → menulis DB tiap kunjungan, rawan race, tak bisa di-cache.
- **Aksi:** refactor agar pemilihan featured **tidak menulis DB tiap request**. Pilih salah satu & jelaskan di PR: (a) cache daftar featured TTL pendek (mis. 10 menit); atau (b) pindah rotasi `featured_count` ke scheduled command (cron). Pertahankan semangat rotasi adil.
- **Selesai bila:** memuat `/` berulang tak menghasilkan UPDATE `brands` tiap request; vendor tetap terotasi adil.

---

# FASE 1 — Fondasi: Peran & Akun (A)

### [ ] 1.1 — Restrukturisasi peran & permission (admin/vendor/user) **(L)**
- **Konteks:** sekarang hanya `admin` & `user` (yang berarti vendor) dan role itu tak punya permission. Pindah ke D1.
- **Aksi:**
  1. **Migration data (DB existing):** rename role `user` → `vendor` (assignment lama otomatis ikut → pemilik brand existing jadi `vendor`). Buat role baru `user` (pelanggan).
  2. **Install baru — `RoleSeeder`/`UserSeeder` (idempotent):** tiga role `admin`,`vendor`,`user`; brand owner seeder di-assign `vendor`.
  3. **`PermissionSeeder` (idempotent):** tambah semua permission §4.
  4. **Assign ke role:** `vendor` ← permission vendor (modul lama `brands edit/show`, `brands packages *`, `brands portfolios *` + `testimonials index/moderate`, `inquiries index/show/update`, `availability manage`); `user` ← `testimonials create`, `favorites *`, `event_plans *`, `inquiries create`.
  5. **`Gate::before` admin** di `AppServiceProvider::boot()` (§2).
  6. **Grep** pemakaian literal role `'user'`; sesuaikan makna (vendor vs pelanggan).
- **Selesai bila:** pemilik brand existing tetap bisa mengelola brand-nya sebagai `vendor`; admin akses semua tanpa grant manual; pelanggan baru ber-role `user`.

### [ ] 1.2 — Registrasi mandiri pelanggan (role-aware) **(M)**
- **Aksi:**
  1. `canRegister: true` pada view login Fortify; pastikan link "Daftar" muncul & `auth/register.tsx` dapat diakses.
  2. **`app/Actions/Fortify/CreateNewUser.php`:** setelah create user → `$user->assignRole('user')`. Tak ada opsi memilih role di form publik.
  3. Pastikan alur verifikasi email existing tetap jalan untuk user baru.
- **Selesai bila:** orang asing bisa daftar via halaman registrasi & otomatis role `user`; tak ada jalur publik jadi vendor/admin.

### [ ] 1.3 — Aplikasi Vendor — sisi PUBLIK (form + berkas) **(M)**
- **Spesifikasi:**
  - **Migration `vendor_applications`:** `id`, `applicant_name`, `email`, `phone`, `brand_name`, `category` (json/string EO/WO), `message` (text null), `document` (string path), `status` (string default `pending`), `reviewed_by` (FK users null), `reviewed_at` (null), `timestamps`. Index `status`.
  - **Model `VendorApplications`** (`$table` eksplisit; relasi `reviewer`→User).
  - **Form Request:** nama/email/phone required; `document` `required|mimes:pdf,jpg,jpeg,png|max:5120`; category valid.
  - **Controller publik `apply()`**: simpan `status=pending`, berkas ke disk `public`; notifikasi admin (boleh sederhana).
  - **Route publik** `POST /join` (atau `/join/apply`), beri rate limit.
  - **Frontend:** ubah `landing/join.tsx` jadi form (nama, email, phone, nama brand, kategori, pesan, upload) + validasi + state sukses.
- **Selesai bila:** pengunjung mengirim aplikasi vendor + berkas dari `/join`; tersimpan `pending`.

### [ ] 1.4 — Aplikasi Vendor — sisi ADMIN (review & approve) **(L)**
- **Spesifikasi:**
  - **Controller admin** (permission `vendor applications *`): `index` (+ filter status), `show` (+ unduh berkas), `approve`, `reject`.
  - **`approve`:** buat **User** baru role `vendor` (atau kaitkan bila email ada); buat **Brand** awal dari data aplikasi (atau arahkan ke form pembuatan brand ter-prefill); set `status=approved`, isi `reviewed_by`/`reviewed_at`; **set brand `is_verified=true`** (lihat 3.3); kirim undangan/kredensial ke vendor (boleh: email reset password).
  - **`reject`:** `status=rejected` (+ alasan opsional); beri tahu pelamar.
  - **Route** (grup auth): resource/eksplisit + `approve`/`reject`.
  - **Frontend:** `vendor-applications/index.tsx` & `show.tsx`; menu sidebar admin.
- **Selesai bila:** admin melihat daftar aplikasi, membuka berkas, menyetujui (→ akun vendor + brand terverifikasi) / menolak; pelamar dapat hasilnya.

### [ ] 1.5 — Routing dashboard 3 peran + navigasi per peran **(M)**
- **Konteks (D12/D13):** `DashboardController::index` kini bercabang admin vs (vendor punya brand) vs (tanpa brand). Tambahkan cabang **pelanggan (`user`)**.
- **Aksi:**
  - `DashboardController`: untuk role `user`, render dashboard aktivitas pelanggan (kerangka dulu; diisi di 3.2/4.1/4.2 — favorit, rencana, inquiry terkirim).
  - **Navigasi (`nav-main.tsx`/`app-sidebar.tsx`)** bercabang per peran: **admin** (users, roles, brands, applications, service categories), **vendor** (brand, packages, portfolios, testimonials, inquiries, availability), **user** (favorites, event plans, inquiries terkirim). Sembunyikan item tak relevan.
- **Selesai bila:** tiap peran login melihat dashboard & menu yang sesuai tanpa item/route yang tak boleh diaksesnya.

---

# FASE 2 — Enabler (E)

### [ ] 2.1 — Kategori Layanan pada Paket **(L)**
- **Keputusan terkait:** D9 (daftar), D10 (wajib + backfill "Paket Lengkap").
- **Spesifikasi:**
  - **Migration `service_categories`:** `id`, `name`, `slug` (unique), `icon` (string null), `timestamps`.
  - **Migration ubah `brand_packages`:** tambah `service_category_id` (FK→`service_categories`). Tahapan aman: tambah **nullable** dulu → **backfill** semua paket existing ke kategori **"Paket Lengkap"** → set **NOT NULL** (atau pertahankan FK + validasi required di aplikasi). `onDelete('restrict')` atau `set null` (pilih `restrict` agar kategori terpakai tak terhapus diam-diam; sediakan guard di admin delete).
  - **Model `ServiceCategories`** (`hasMany` packages) + relasi `serviceCategory()` di `BrandPackages`.
  - **Seeder** 10 kategori D9 (idempotent).
  - **Admin CRUD** `service_categories` (permission `service_categories *`): controller + `resources/js/pages/service-categories/`.
  - **Form paket (create/edit vendor):** Select `service_category_id`; `CreateBrandPackagesRequest`/`Update` → `service_category_id` `required|exists:service_categories,id`.
- **Selesai bila:** admin kelola kategori; tiap paket (lama & baru) punya kategori; data siap untuk simulasi & filter.

### [ ] 2.2 — Harga: string → numerik (bug → enabler) **(M)**
- **Konteks:** `price_start`/`price_end` `string` → `withMin` membandingkan leksikografis. Contoh nyata: "Bunga Raya" termurah Rp 8.000.000 tapi tampil "Mulai dari Rp 28.000.000" karena `"8000000">"28000000"`.
- **Spesifikasi:**
  - **Migration ubah `brand_packages`:** `price_start`,`price_end` → `unsignedBigInteger`. **Backfill aman** (cast string→int; tangani non-numerik).
  - **Validasi:** `required|integer|min:0`; `price_end >= price_start`.
  - **Frontend:** input numerik + format Rupiah (pemisah ribuan) di UI.
  - **Audit** semua pemakaian (`withMin`, "Mulai dari", kartu brand) agar konsisten numerik.
- **Selesai bila:** `withMin('packages','price_start')` benar secara numerik; "Mulai dari" = paket termurah sesungguhnya; total simulasi bisa dijumlahkan benar.

---

# FASE 3 — Engagement & Kepercayaan (B)

### [ ] 3.1 — Testimoni + Rating (terkurasi) **(L)**
- **Keputusan terkait:** D2, D3, D11.
- **Spesifikasi:**
  - **Migration `testimonials`:** `id`, `brand_id` (FK cascade), `user_id` (FK cascade), `rating` (unsignedTinyInteger 1–5), `body` (text), `is_published` (bool default **false**), `published_at` (null), `timestamps`. **Unique (`brand_id`,`user_id`)**. Index `brand_id`,`is_published`.
  - **Model `Testimonials`** (relasi `brand`,`user`; cast `is_published`).
  - **Pelanggan (permission `testimonials create`):** form rating+teks untuk sebuah brand → `is_published=false`. Form Request (`rating` 1–5, `body` required, blok duplikat per brand). **Tidak** wajib pernah Inquiry untuk menulis (D11).
  - **Vendor (permission `testimonials index`/`moderate`, scoping sendiri):** daftar testimoni brand-nya; publish/unpublish (set `is_published`+`published_at`). **Vendor tak boleh ubah `body`/`rating`.**
  - **Publik (`landing/brand-detail.tsx`):** tampilkan hanya `is_published=true`; tampilkan **rata-rata rating + jumlah** dari yang terpublikasi. **Badge "Terverifikasi"** per testimoni bila penulisnya punya ≥1 Inquiry ke brand tsb — query saat render, tanpa kolom baru (D11).
  - **Frontend:** komponen form testimoni (brand detail), daftar testimoni publik, halaman moderasi vendor `testimonials/index.tsx`.
  - **Seeder demo** testimoni (sebagian published).
- **Selesai bila:** pelanggan login mengirim 1 testimoni+rating/brand; vendor memilih yang tampil; publik hanya menampilkan yang dipublikasikan + rata-ratanya + badge verified bila relevan.

### [ ] 3.2 — Favorit / Shortlist **(M)**
- **Spesifikasi:**
  - **Migration `favorites`:** `id`, `user_id` (FK cascade), `brand_id` (FK cascade), `timestamps`. **Unique (`user_id`,`brand_id`)**.
  - **Model `Favorites`** (relasi `user`,`brand`).
  - **Controller (permission `favorites *`):** `index` (favorit user), `store` (toggle), `destroy`.
  - **Shared props:** sertakan `favorite_brand_ids` untuk user login di `HandleInertiaRequests` agar ikon hati tahu state.
  - **Frontend:** ikon hati (toggle) di kartu brand (home/explore) & brand detail; halaman favorit di area pelanggan (terkait 1.5). Tamu → diarahkan login saat memfavoritkan.
- **Selesai bila:** user login menandai/melepas favorit & melihat daftarnya; state hati konsisten lintas halaman.

### [ ] 3.3 — Badge "Terverifikasi" pada Brand **(S)**
- **Spesifikasi:**
  - **Migration ubah `brands`:** + `is_verified` (bool default false), `verified_at` (null); tambah ke `$fillable`/`casts`.
  - **Admin:** aksi `verify`/`unverify` (permission `brands verify`); otomatis `true` saat aplikasi vendor disetujui (1.4).
  - **Frontend:** badge "Terverifikasi" di kartu brand (home/explore) & brand detail bila `is_verified`.
- **Selesai bila:** admin menandai brand terverifikasi; badge tampil; approval aplikasi otomatis memverifikasi.

---

# FASE 4 — Diferensiator (C)

### [ ] 4.1 — Simulasi / Rencana Acara (Event Plan) **(L)**
- **Keputusan terkait:** D4, D5, D10.
- **Spesifikasi:**
  - **Migration `event_plans`:** `id`, `user_id` (FK cascade), `name` (string), `event_date` (date null), `notes` (text null), `timestamps`.
  - **Migration `event_plan_items`:** `id`, `event_plan_id` (FK cascade), `brand_id` (FK), `brand_package_id` (FK null, `onDelete('set null')`), `service_category_id` (FK null, untuk grouping), `price_start_snapshot` (unsignedBigInteger), `price_end_snapshot` (unsignedBigInteger), `timestamps`. (Snapshot harga → total stabil walau paket diubah/dihapus; tampilkan sebagai **estimasi**.)
  - **Model `EventPlans`** (`hasMany` items) + **`EventPlanItems`** (relasi `plan`,`brand`,`package`,`serviceCategory`).
  - **Controller (permission `event_plans *`, scoping user):** `index`,`create`/`store`,`show`,`update`,`destroy`; `addItem` (ambil snapshot harga saat menambah), `removeItem`.
  - **Aturan (D10):** **maksimal satu paket per `service_category` per plan**; bila kategori sama ditambah lagi, UI mengganti pilihan.
  - **Total:** **Σ price_start_snapshot … Σ price_end_snapshot**, dikelompokkan per kategori.
  - **Frontend:** tombol "Tambahkan ke Rencana" di kartu paket (brand detail) + pemilih/pembuat plan; `event-plans/show.tsx` (item per kategori, total rentang menonjol) + `index.tsx`; tombol **"Hubungi semua vendor di rencana ini"** (→ 4.2).
  - **Seeder demo** 1–2 rencana.
- **Selesai bila:** user login membuat rencana, menambah/menghapus paket lintas vendor (maks 1/kategori), melihat estimasi total rentang; tersedia aksi menghubungi semua vendor.

### [ ] 4.2 — Inquiry / Lead **(L)**
- **Keputusan terkait:** D4, D8.
- **Spesifikasi:**
  - **Migration `inquiries`:** `id`, `brand_id` (FK cascade), `user_id` (FK cascade), `event_plan_id` (FK null), `brand_package_id` (FK null), `event_date` (date null), `guest_count` (unsignedInteger null), `budget` (unsignedBigInteger null), `message` (text), `status` (string default `new`: new/read/responded/archived), `timestamps`. Index `brand_id`,`status`.
  - **Model `Inquiries`** (relasi `brand`,`user`,`plan`,`package`).
  - **Pelanggan (permission `inquiries create`):** form terstruktur di brand detail (tanggal, jumlah tamu, budget, pesan) → `status=new`. Dari event plan: "hubungi semua vendor" membuat **satu inquiry per vendor** (lampirkan `event_plan_id` + konteks paket). Form Request validasi.
  - **Vendor (permission `inquiries index/show/update`, scoping sendiri):** **inbox lead** di dashboard — daftar, detail, ubah status.
  - **WhatsApp:** pertahankan tombol & tracking existing (sekunder).
  - **Frontend:** komponen form inquiry (brand detail), `inquiries/index.tsx` + `show.tsx` (vendor), integrasi tombol "hubungi semua" di event plan; ringkasan inquiry terkirim di dashboard pelanggan (1.5).
  - **Tie-in D11:** inilah sumber data badge "Terverifikasi" testimoni (dihitung saat render di 3.1).
  - **Seeder demo** beberapa inquiry.
- **Selesai bila:** user login mengirim inquiry (langsung / dari rencana ke banyak vendor); vendor kelola lead di inbox; WhatsApp tetap jalan; badge verified testimoni mulai akurat.

### [ ] 4.3 — Cek Ketersediaan Tanggal **(M)**
- **Spesifikasi:**
  - **Migration `brand_unavailable_dates`:** `id`, `brand_id` (FK cascade), `date` (date), `note` (string null), `timestamps`. **Unique (`brand_id`,`date`)**. Index `brand_id`,`date`.
  - **Model `BrandUnavailableDates`** (relasi `brand`).
  - **Vendor (permission `availability manage`, scoping sendiri):** halaman kelola (tandai/lepas tanggal) — kalender/daftar; controller `index`/`store`/`destroy`.
  - **Publik:** indikator ketersediaan di brand detail; pada **form inquiry**, bila `event_date` termasuk tak tersedia → **peringatan** (tetap boleh kirim; default peringatan saja).
  - **Frontend:** `availability/index.tsx` (vendor); indikator di brand detail & form inquiry.
- **Selesai bila:** vendor menandai tanggal penuh; user melihat/mengecek & diperingatkan saat memilih tanggal tak tersedia.

---

# FASE 5 — Discovery (D)

### [ ] 5.1 — Filter Lanjutan + Banding Vendor **(L)**
- **Prasyarat:** Fase 2 & 3 selesai (harga numerik, kategori, rating, verified) agar filter punya data.
- **Spesifikasi:**
  - **`LandingController::explore`:** tambah filter `price_min`/`price_max` (numerik via `withMin`), `city`/lokasi (dari `address`), `service_category` (join paket→kategori), `rating_min` (rata-rata testimoni terpublikasi), `verified` (bool). Tambah **sort**: harga (murah/mahal), rating, terbaru. Pertahankan paginasi + `withQueryString`.
  - **Banding:** pilih 2–3 vendor → halaman berdampingan (rentang harga, kategori, rata-rata rating, verified, contoh paket).
  - **Route:** explore existing + compare baru (mis. `/compare?brands=...`).
  - **Frontend:** panel filter di `landing/explore.tsx`; mekanisme pilih-untuk-banding + `landing/compare.tsx`.
- **Selesai bila:** user memfilter & mengurutkan berdasarkan harga, kota, kategori, rating, verifikasi; serta membandingkan 2–3 vendor berdampingan.

---

## 6. Catatan Teknis & Risiko (yang tersisa setelah keputusan diambil)

- **T1 — Migrasi data DB existing (kritis):** rename role (1.1), ubah tipe harga (2.2), tambah & backfill kategori (2.1) menyentuh data nyata. **Uji di salinan DB** sebelum produksi; sediakan jalur `down()` yang masuk akal; jalankan seeder idempoten sehingga aman diulang.
- **T2 — Snapshot harga event plan:** disengaja (D5/4.1) demi kestabilan total; tandai jelas sebagai **estimasi** di UI. Bila paket dihapus, item tetap valid lewat snapshot (`brand_package_id` di-set null).
- **T3 — Rata-rata rating terkurasi:** dihitung dari testimoni terpublikasi saja (D3) — disengaja; **jangan** tampilkan "rata-rata semua testimoni" agar tak menyesatkan.
- **T4 — Keterkaitan monetisasi (D7):** bila kelak ada "featured berbayar", itu bisa berbenturan dengan rotasi adil (0.5). Tak ada yang dibangun sekarang; cukup disadari saat model bisnis ditentukan.
- **T5 — Konsistensi penamaan:** sengaja mempertahankan nama model jamak; standardisasi ke tunggal = refactor terpisah di luar ruang lingkup.

---

## 7. Definition of Done (berlaku untuk setiap task)

Sebuah task dianggap selesai bila SEMUA terpenuhi:
1. **Fungsional:** memenuhi blok "Selesai bila" pada task.
2. **Migrasi & model:** migration jalan bersih (up & down), model punya `$table`/`$fillable`/`casts`/relasi eksplisit.
3. **Otorisasi:** dijaga permission/role + cek kepemilikan; admin lolos via `Gate::before`; vendor hanya datanya sendiri; pelanggan hanya miliknya.
4. **Validasi:** semua input lewat Form Request.
5. **Frontend:** halaman/komponen Inertia memakai shadcn/ui yang ada; navigasi per peran (D13) diperbarui bila modul menambah menu.
6. **Test:** ≥1 Pest feature test happy-path + ≥1 test otorisasi negatif lulus.
7. **Seed demo (modul baru):** seeder idempotent tersedia (D14).
8. **Tidak regresi:** route & fitur lama tetap jalan; `php artisan test` hijau.
9. **Bersih:** tak ada dead code/teks tidak profesional yang ditinggalkan; commit jelas menyebut ID task.

---

*Dokumen ini final per sesi terakhir. Setiap perubahan ruang lingkup wajib memperbarui §1 (Decision Log) lebih dulu agar eksekusi tidak melenceng.*
