# Eventura — TODO Lanjutan (disesuaikan kondisi repo terkini)

> Konteks: rencana v3 dieksekusi **sebagian**. Yang masuk hanya **lapisan backend data + beberapa perbaikan logika controller + seeder**. **Nol file frontend diubah**, sehingga semua pekerjaan UI (R3/R4) belum jalan — dan beberapa perubahan backend kini membuat frontend lama **tidak sinkron / putus**. TODO ini hanya memuat yang **masih perlu dikerjakan**, sudah disesuaikan dengan keadaan repo sekarang.
>
> **Untuk Claude Code:** kerjakan berurutan (Fase 1 → 4). Konvensi & Definition of Done sama seperti `eventura-v3-plan.md` (§2, §DoD): nama model jamak, `$table`/FK eksplisit, semua tulis via Form Request, otorisasi via permission + cek kepemilikan, `Gate::before` admin, pakai shadcn/ui yang ada, ≥1 Pest test happy-path + 1 otorisasi negatif per perubahan logika. Ukuran: **(S)** ≤½ hari · **(M)** ~1–2 hari · **(L)** ~3–5 hari.

---

## ✅ Sudah selesai (JANGAN diulang)

Terverifikasi di repo:
- **R0.1** Typo `RoleController` (`'update   '`) → sudah `only: ['edit', 'update']`. Aman.
- **R0.2 (backend)** Middleware verify/unverify → sudah `permission:brands verify`. *(Tombol di frontend belum di-gate — lihat Fase 1.2.)*
- **R1.1/R1.2/R1.3** Migration: kolom event-driven `inquiries` (`read_at`, `vendor_response`, `responded_at`, `is_archived`, `closed_at`), `event_plan_items` (`price_start_snapshot`, `price_end_snapshot`, FK `nullOnDelete`), tabel `site_settings` + model `SiteSettings`. Aman.
- **R2.1 (backend)** Rata-rata rating dihitung dari **semua** testimoni di `LandingController::brandDetail` + accessor `averageRating`/`reviewsCount` pada model `Brands`. *(Pastikan frontend menampilkan angka yang dikirim — biasanya sudah.)*
- **R2.2 (backend)** Status inquiry event-driven di `InquiriesController`: `respond`/`archive`/`unarchive`/`close`, `read` otomatis saat dibuka, `updateStatus` lama dihapus, route baru terdaftar. *(Frontend belum disesuaikan — lihat Fase 1.1.)*
- **R5** Seluruh seeder dirombak (7 brand + semua modul).

## ⛔ Belum dikerjakan / kini tidak sinkron (isi TODO ini)

- Semua frontend (R3/R4): toast publik, dashboard per role, redesign publik, dialog shadcn, pengelompokan permission, dll.
- Frontend inquiry **putus** (memanggil route `/status` yang sudah dihapus) — Fase 1.1.
- Simulasi (event plan) **putus** — controller & frontend masih memakai kolom `price_snapshot` yang sudah di-rename; total juga belum berupa rentang — Fase 1.3.
- Tombol verifikasi belum di-gate — Fase 1.2.
- Backend yang belum: kategori vendor EO/WO, notifikasi email, controller+halaman SiteSettings (Tentang/Kontak).

---

# FASE 1 — Perbaiki yang kini tidak sinkron (URGENT)

> Backend sudah berubah tapi frontend belum mengikuti, sehingga ada UI yang putus/menyesatkan. Bereskan dulu.

### [ ] 1.1 — Sinkronkan UI inquiry dengan alur status event-driven **(M)**
- **Kondisi sekarang:** `resources/js/pages/inquiries/show.tsx` (baris ~57–63) masih memakai dropdown status manual dan memanggil `patch('/inquiries/${id}/status')` — **route ini sudah dihapus**, jadi aksi tersebut error. Backend kini menyediakan `respond`, `archive`/`unarchive` (vendor), dan `close` (customer).
- **Aksi (vendor — `inquiries/show.tsx` & `inquiries/index.tsx`):**
  - **Hapus** dropdown status manual + pemanggilan `/status`.
  - Tambah **form Balasan**: textarea `vendor_response` → `POST /inquiries/{id}/respond` (`inquiries.respond`). Setelah dibalas, tampilkan balasan + status otomatis "Direspons".
  - Tambah tombol **Arsipkan/Buka Arsip** → `POST /inquiries/{id}/archive` / `/unarchive`. Di `index`, dukung filter `?archived=1` (backend sudah menyiapkan `showArchived`).
  - Tampilkan badge status yang jujur (Terkirim/Dibaca/Direspons/Selesai) — status `read` sudah otomatis terisi saat halaman dibuka.
- **Aksi (customer — `inquiries/my-inquiries.tsx`):**
  - Tampilkan **balasan vendor** (`vendor_response`) bila ada.
  - Tambah tombol **"Tandai Selesai"** → `POST /inquiries/{id}/close` (`inquiries.close`).
- **Selesai bila:** tidak ada lagi pemanggilan `/inquiries/{id}/status`; vendor membalas lewat form (status jadi "Direspons" otomatis) & bisa mengarsip; customer melihat balasan & bisa menutup; tidak ada aksi yang menabrak route yang sudah dihapus.

### [ ] 1.2 — Gate tombol verifikasi brand di frontend **(S)**
- **Kondisi sekarang:** `resources/js/pages/brands/show.tsx` (baris ~102–118) menampilkan tombol "Verifikasi Brand"/"Cabut Verifikasi" hanya berdasarkan `is_verified`, tanpa cek permission. Vendor masih melihatnya; klik kini kena 403.
- **Aksi:** sembunyikan kedua tombol kecuali user punya permission `brands verify` (mis. pakai hook `useRole`/cek `permissions` yang sudah dibagikan ke frontend, seperti pola `hasAnyPermission`). Backend tetap sebagai penjaga sebenarnya (sudah benar).
- **Selesai bila:** hanya admin yang melihat tombol verifikasi; vendor tidak melihatnya sama sekali.

### [ ] 1.3 — Sinkronkan simulasi (event plan) dengan skema baru + tampilkan RENTANG **(M)**  ← gap yang sebelumnya terlewat
- **Kondisi sekarang (RUSAK):** migration sudah me-*rename* `price_snapshot` → `price_start_snapshot` dan menambah `price_end_snapshot`, TAPI kode belum ikut:
  - `app/Http/Controllers/EventPlansController.php` baris **62** (`->sum('price_snapshot')`) dan **98** (`addItem` menyimpan `'price_snapshot' => ...`) merujuk kolom yang **sudah tidak ada** → `addItem` akan error & total salah.
  - Frontend masih merujuk `price_snapshot`: `resources/js/pages/event-plans/show.tsx` (baris 20, 123), `event-plans/index.tsx` (baris 15, 127), dan `resources/js/pages/inquiries/show.tsx` (baris 11, 119 — saat menampilkan item rencana di detail inquiry).
  - Total masih satu angka (`totalBudget`), bukan rentang (langgar D5).
- **Aksi (backend `EventPlansController`):**
  - `addItem`: simpan **`price_start_snapshot` = `$package->price_start`** dan **`price_end_snapshot` = `$package->price_end`** (ganti `price_snapshot`).
  - `show`: hitung **dua total** — `totalStart = items->sum('price_start_snapshot')` dan `totalEnd = items->sum('price_end_snapshot')` — kirim keduanya sebagai rentang.
  - Pastikan `$fillable` model `EventPlanItems` memuat `price_start_snapshot` & `price_end_snapshot` (bukan `price_snapshot`).
- **Aksi (frontend):**
  - `event-plans/show.tsx` & `index.tsx`: ganti `price_snapshot` → tampilkan **rentang per item** (`price_start_snapshot` … `price_end_snapshot`) dan **total sebagai rentang** (Σ start … Σ end), beri label "Estimasi".
  - `inquiries/show.tsx`: ganti referensi `price_snapshot` ke kolom baru agar tidak error saat menampilkan item rencana terkait.
- **Selesai bila:** menambah paket ke rencana tidak error; setiap item & total ditampilkan sebagai **rentang** (Σ start … Σ end); tidak ada lagi referensi `price_snapshot` di seluruh `app/` & `resources/js/`.

---

# FASE 2 — Feedback Aksi & Konsistensi UI (shadcn)

### [ ] 2.1 — Jembatan flash → toast + Toaster di halaman publik **(M)**  ← keluhan "toast publik belum muncul"
- **Kondisi sekarang:** `<Toaster/>` hanya dipasang di `resources/js/layouts/app-layout.tsx` (shell dashboard). Halaman publik tidak memasangnya, dan tidak ada jembatan flash→toast — sehingga aksi seperti kirim inquiry/testimoni/favorit di halaman publik senyap meski controller mengirim flash. `sonner` sudah terinstall.
- **Aksi:**
  - Buat komponen/hook `FlashToaster` yang membaca `usePage().props.flash` (`success`/`error`) lalu memicu `toast.success`/`toast.error` saat berubah.
  - Pastikan `HandleInertiaRequests::share()` membagikan `flash` (success & error) secara global.
  - Pasang `<Toaster/>` + `<FlashToaster/>` di **kedua** layout — dashboard (`app-layout`) DAN layout publik/landing (cari layout yang membungkus `welcome.tsx`/`brand-detail.tsx`); idealnya di root.
- **Selesai bila:** mengirim inquiry/testimoni/aplikasi & toggle favorit memunculkan toast sukses/gagal, baik di halaman publik maupun dashboard.

### [ ] 2.2 — Komponen `ConfirmDialog` reusable + ganti semua dialog native **(M)**
- **Kondisi sekarang:** 7 pemakaian `confirm()`/`alert()` native: `event-plans/show.tsx:58`, `event-plans/index.tsx:142`, `vendor-applications/show.tsx:42` & `:48`, `service-categories/index.tsx:28`, `availability/index.tsx:35`, dan `alert()` di `brands-portfolios/show.tsx:129`. Pola kanonik `components/delete-button.tsx` (shadcn `AlertDialog` + `toast.promise`) sudah ada.
- **Aksi:** buat `ConfirmDialog` generik (judul, deskripsi, label aksi, varian destructive, callback + `toast.promise`) yang menggeneralisasi `delete-button`. Ganti **semua** pemakaian native dengannya; ubah `alert()` jadi `toast.error`.
- **Selesai bila:** tidak ada lagi `window.confirm`/`alert()` di `resources/js`; semua konfirmasi memakai shadcn; semua hasil aksi memberi toast.

### [ ] 2.3 — Pengelompokan & label permission yang rapi **(M)**
- **Kondisi sekarang:** `resources/js/components/permission-picker.tsx` hanya punya grup `users`, `roles`, `brands`, `brands packages`, `brands portfolios`. Semua modul baru (vendor applications, service categories, testimonials, favorites, event plans, inquiries, availability, **site settings**) jatuh ke kotak **"Lainnya"** dengan nama mentah; aksi `approve/reject/moderate/manage/verify` tak berlabel.
- **Aksi:** lengkapi registry `GROUPS` dengan grup + ikon + deskripsi untuk SEMUA modul, dan tambah `ACTION_LABELS` untuk `approve`→"Setujui", `reject`→"Tolak", `moderate`→"Moderasi", `manage`→"Kelola", `verify`→"Verifikasi", `show`→"Lihat Detail". Target: kotak "Lainnya" benar-benar kosong.
- **Selesai bila:** halaman edit role menampilkan semua permission terkelompok rapi & berlabel ramah; tidak ada yang tersisa di "Lainnya".

### [ ] 2.4 — Lengkapi tampilan rating di brand-detail (jumlah ulasan + label) **(S)**  ← gap minor A2
- **Kondisi sekarang:** backend `brandDetail` sudah menghitung `reviewsCount` (dari SEMUA testimoni), tapi `resources/js/pages/landing/brand-detail.tsx` **tidak menerima/menampilkannya** (props hanya `avgRating`). Label "Testimoni Pilihan" (keputusan A2) juga belum ada.
- **Aksi:** kirim `reviewsCount` ke view; tampilkan "★ {avgRating} dari {reviewsCount} ulasan" sebagai metrik reputasi. Beri judul **"Testimoni Pilihan"** pada daftar testimoni yang ditampilkan, agar jelas itu kurasi (sedangkan angka rating dari semua).
- **Selesai bila:** brand-detail menampilkan rata-rata + jumlah ulasan (dari semua testimoni), dan daftar testimoni berlabel sebagai pilihan/kurasi.

---

# FASE 3 — Dashboard & Tampilan Publik

### [ ] 3.1 — Dashboard tiap role sesuai kebutuhan utama **(M)**  ← keluhan "dashboard masih sama"
- **Kondisi sekarang:** `DashboardController` **tidak tersentuh** di update terakhir. Dashboard customer (`role: 'user'`) masih dikirim **kosong** (tanpa data). Admin & vendor punya analytics tapi belum menonjolkan aksi.
- **Aksi (`DashboardController::index` + `resources/js/pages/dashboard.tsx`):**
  - **Admin:** tambah metrik **aplikasi vendor pending** (actionable) + daftar aplikasi terbaru yang perlu direview. Pertahankan total brands/users/views/WA.
  - **Vendor:** tambah **jumlah lead baru** (inquiry `status=pending`) + daftar lead terbaru, dan **jumlah testimoni menunggu moderasi** (`is_published=false`). Pertahankan analytics (views, WA, grafik 7 hari).
  - **Customer (bangun dari kosong):** jumlah rencana acara + ringkas, jumlah favorit, daftar inquiry beserta status (sorot yang **Direspons**), dan tombol cepat ke `/explore`.
  - Frontend `dashboard.tsx` bercabang per `role` untuk merender ketiganya.
- **Selesai bila:** tiap role melihat info utama yang relevan & actionable; dashboard customer tidak lagi kosong.

### [ ] 3.2 — Redesign tampilan publik menjadi content-first **(L)**
- **Kondisi sekarang:** `resources/js/pages/welcome.tsx` (route `/`) masih membuka hero `min-h-[580px]` + gradient + headline marketing, lalu hanya "Brand Unggulan"; untuk melihat semua vendor user harus ke `/explore`.
- **Aksi:** rombak `welcome.tsx` jadi direktori content-first:
  - Header ringkas (logo + satu kalimat) — **hapus** hero tinggi & gradient tebal.
  - Langsung di bawahnya: **bar pencarian + filter** (kategori EO/WO, kota, kategori layanan, rating, verified, rentang harga, urutan) — gunakan kembali logika filter `LandingController::explore`.
  - **Grid vendor** sebagai konten utama (kartu: cover, nama, kategori EO/WO, badge verified, rata-rata rating, "mulai dari" harga, tombol favorit).
  - **Vendor unggulan** tampil sebagai segmen berlabel ("Unggulan") di atas grid — bukan hero.
  - Satukan pengalaman home & explore; hindari duplikasi komponen (jadikan `/explore` memakai komponen/logika yang sama atau lebur ke `/`).
- **Selesai bila:** membuka `/` langsung memperlihatkan vendor yang bisa dicari & difilter, to-the-point tanpa hero marketing; tidak ada duplikasi komponen explore vs home.

---

# FASE 4 — Fitur yang Belum Lengkap

### [ ] 4.1 — Pisahkan kategori vendor (EO/WO) dari kategori layanan **(M)**
- **Kondisi sekarang:** `StoreVendorApplicationRequest` masih `in:EO,WO,Catering,Dekorasi,...` (mencampur konsep), dan `resources/js/pages/landing/join.tsx` masih menampilkan kategori layanan sebagai pilihan kategori brand.
- **Aksi:**
  - **Request:** ubah `category` menjadi pilihan **EO/WO saja**. Rekomendasi jadikan **array** (`['required','array']`, tiap elemen `in:EO,WO`) agar satu brand bisa EO+WO; sesuaikan kolom `vendor_applications.category` ke JSON (migration aditif) bila perlu.
  - **Form `join.tsx`:** ganti dropdown menjadi pilihan **EO/WO** (checkbox multi atau multi-select); HAPUS kategori layanan dari sini.
  - **`VendorApplicationController::approve`:** petakan kategori aplikasi → `brand.category` (array EO/WO).
  - **Form pengelolaan brand** (admin & vendor, `brands/*.tsx`): pastikan pemilihan kategori brand = **multi-select EO/WO**, bukan kategori layanan. Tampilkan kategori (EO/WO) di kartu & detail brand.
  - **Audit:** tidak ada tempat lain yang menawarkan kategori layanan sebagai kategori brand. Kategori layanan hanya di form **paket**.
- **Selesai bila:** pendaftaran mitra & pengelolaan brand hanya memakai EO/WO (boleh keduanya); kategori layanan eksklusif untuk paket.

### [ ] 4.2 — Notifikasi email approve & reject + konfigurasi mail **(M)**
- **Kondisi sekarang:** tidak ada direktori `app/Notifications` atau `app/Mail`. `approve()` hanya mengirim reset-password generik via `Password::sendResetLink()`; `reject()` tidak mengirim apa pun; `MAIL_MAILER=log`.
- **Aksi:**
  - Buat dua Notification (idealnya `ShouldQueue`, Markdown mailable): `VendorApplicationApproved` (sambutan + instruksi/link set password) dan `VendorApplicationRejected` (pemberitahuan sopan + alasan opsional). Kirim masing-masing di `approve()` & `reject()`.
  - (Opsional) tambah kolom `rejection_reason` (nullable) untuk menampilkan alasan penolakan.
  - **Konfigurasi mail dev:** gunakan **Mailpit** (atau verifikasi isi via `log`); produksi via SMTP env. Dokumentasikan di README; jangan hardcode kredensial.
- **Selesai bila:** approve & reject mengirim email sesuai konteks (bukan reset-password telanjang); pelamar yang ditolak mendapat kabar; email terlihat di Mailpit/log saat dev.

### [ ] 4.3 — Halaman Tentang Kami & Kontak (editor admin + halaman publik) **(L)**
- **Kondisi sekarang:** model `SiteSettings`, migration `site_settings`, dan `SiteSettingSeeder` **sudah ada**. Yang belum: controller, route, halaman editor admin, halaman publik, dan permission.
- **Aksi:**
  - **Permission:** tambah `site settings index`, `site settings edit` ke `PermissionSeeder` (admin lolos via `Gate::before`) dan ke grup di `permission-picker.tsx` (lihat 2.3).
  - **Admin (`SiteSettingsController` + `resources/js/pages/site-settings/index.tsx`):** halaman editor terkelompok (About / Contact) yang me-render input sesuai `type` (`text`/`textarea`/`url`/`email`/`image`). Upload gambar ke disk `public` (gunakan field `value` untuk path). Simpan via Form Request. Middleware `permission:site settings index`/`edit`.
  - **Publik (route + halaman):** `/tentang-kami` & `/kontak` yang membaca `SiteSettings::group('about')`/`group('contact')`. Tautkan di header/footer publik.
  - Tambahkan helper `SiteSettings::get()`/`group()` bila belum ada di model.
- **Selesai bila:** admin dapat mengubah teks, gambar, dan info kontak; halaman publik menampilkannya; tidak ada konten hardcoded.

### [ ] 4.4 — Shortcut ke situs publik di sidebar dashboard **(S)**
- **Kondisi sekarang:** `resources/js/components/app-sidebar.tsx` punya navigasi per-peran tapi `footerNavItems` kosong; tidak ada jalan cepat ke halaman publik.
- **Aksi:** tambahkan item (mis. "Lihat Situs" → `/` dan/atau "Jelajahi Vendor" → `/explore`) yang tampil untuk **semua peran** (mis. di `footerNavItems` atau section khusus).
- **Selesai bila:** ketiga peran punya jalan cepat dari dashboard ke halaman publik.

### [ ] 4.5 — CTA buat inquiry di halaman "Inquiry Saya" **(S)**
- **Kondisi sekarang:** `resources/js/pages/inquiries/my-inquiries.tsx` (empty state baris ~61) hanya teks "Kunjungi halaman brand…", tanpa tombol.
- **Aksi:** tambahkan tombol CTA "Jelajahi Vendor" → `/explore` pada empty state **dan** di header halaman (selalu tampil). Pakai Button shadcn.
- **Selesai bila:** dari "Inquiry Saya" user punya jalan cepat ke explore untuk membuat inquiry baru.

---

## Catatan ringkas yang perlu diperhatikan

- **`vendor_note` vestigial:** model `Inquiries` masih memuat `vendor_note` di samping `vendor_response` baru. Tidak dipakai lagi — boleh dibersihkan (drop dari fillable; migration drop kolom bila tidak ada data nyata) agar tidak membingungkan. **(S, opsional)**
- **Seeder ⇄ migration:** seeder modul baru (inquiry/event-plan/site-settings) bergantung pada migration R1 yang sudah ada — pastikan `php artisan migrate` dijalankan sebelum `db:seed`.
- **Konsistensi rating:** verifikasi cepat dengan data seeder — Dinar WO & MJ Storia harus menampilkan rata-rata **4.0** di publik (punya testimoni tinggi yang tampil + rendah yang disembunyikan). Bila tampil 5.0, ada regresi di pembacaan frontend.

---

## Urutan ringkas (peta)

```
FASE 1  Sinkronkan yang putus     → 1.1 inquiry UI, 1.2 gate tombol verify, 1.3 simulasi (kolom + rentang)   (URGENT)
FASE 2  Feedback & konsistensi UI → 2.1 toast publik, 2.2 ConfirmDialog, 2.3 permission group, 2.4 jumlah ulasan
FASE 3  Dashboard & publik        → 3.1 dashboard per role, 3.2 redesign content-first
FASE 4  Fitur belum lengkap       → 4.1 kategori EO/WO, 4.2 email, 4.3 Tentang/Kontak, 4.4 shortcut, 4.5 CTA
```

*Definition of Done & konvensi mengikuti `eventura-v3-plan.md`. Perubahan ruang lingkup perbarui Decision Log (§A v3) lebih dulu.*
