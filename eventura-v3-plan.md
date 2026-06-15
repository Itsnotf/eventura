# Eventura — Rencana Perbaikan & Penyempurnaan (v3)

> Dokumen ini menindaklanjuti **13 masalah** dari pemilik produk + **temuan tambahan** dari review kode aktual (pasca-update). Semua keputusan sudah dikunci di §A. Penekanan: **solusi yang benar dan pas dengan akar masalah**, bukan tambal-sulam "yang penting jalan". Seeder lengkap ada di dokumen terpisah (`eventura-seeders-redesign.md`) dan dirujuk di Fase R5.
>
> **Untuk Claude Code:** kerjakan per fase berurutan (R0 → R5). R0 dulu karena menyangkut keamanan. Setiap task menyebut akar masalah, solusi yang benar, file terdampak, dan kriteria selesai. Konvensi & Definition of Done sama seperti rencana sebelumnya (§2 dokumen v2): nama model jamak, `$table`/FK eksplisit, semua tulis lewat Form Request, otorisasi via permission + cek kepemilikan, `Gate::before` admin, pakai shadcn/ui yang ada, test happy-path + otorisasi negatif per modul.

---

## §A. Keputusan Final v3 (dikunci)

Beberapa di antaranya **merevisi** keputusan lama — dicatat eksplisit agar tidak ada drift.

- **A1 — Kategori brand vs paket (revisi kejelasan #2):** kategori **brand/vendor = EO dan/atau WO saja** (boleh multi-pilih, satu brand bisa EO sekaligus WO). Kategori **layanan = milik PAKET** (catering, sound, dll). Keduanya tidak boleh dicampur di mana pun. Form `/join` hanya menawarkan EO/WO.
- **A2 — Rata-rata rating dari SEMUA testimoni (revisi D3 lama):** reputasi numerik (rata-rata + jumlah ulasan) dihitung dari **semua** testimoni, tidak peduli status publikasi — agar vendor tidak bisa menaikkan skor dengan menyembunyikan rating jelek. Kurasi vendor hanya mengontrol **testimoni mana yang teksnya tampil**. Angka "N ulasan" juga dari total semua. Testimoni yang ditampilkan diberi label jelas (mis. "Testimoni Pilihan").
- **A3 — Status inquiry event-driven (jawaban #7):** status tidak boleh di-set bebas oleh vendor. `read` otomatis saat vendor membuka; `responded` otomatis saat vendor mengirim **balasan nyata** (yang dilihat customer); `closed` hanya bisa di-set **customer** (aksi miliknya sendiri). Vendor punya flag terpisah `is_archived` untuk merapikan inbox — flag ini TIDAK memengaruhi status yang dilihat customer. Dropdown status manual dihapus.
- **A4 — Redesign publik content-first (jawaban #11):** `/` menjadi halaman direktori content-first — header ringkas (logo + satu kalimat) + bar pencarian/filter di atas, lalu **grid vendor langsung**. Hero tinggi dihapus. Vendor unggulan tampil sebagai baris/segmen berlabel di atas grid, bukan hero marketing. Praktis menggabungkan pengalaman home & explore.
- **A5 — Halaman Tentang & Kontak dikelola admin (jawaban #12):** pakai penyimpanan setelan `site_settings` (key–value bertipe, berkelompok) + editor admin + dua halaman publik yang membacanya. Section editable: teks hero/cerita/misi + gambar (Tentang); alamat, email, telepon, WhatsApp, Instagram, embed peta (Kontak).
- **A6 — Isi dashboard per peran (jawaban #9):** tiap dashboard menonjolkan **kebutuhan utama yang actionable** — admin: aplikasi vendor pending; vendor: lead baru + testimoni menunggu moderasi; customer: rencana, favorit, dan status inquiry (terutama yang sudah dibalas). Bukan sekadar tumpukan angka.

---

## §B. Prinsip eksekusi (kenapa "benar, bukan sekadar jalan")

1. **Satu sumber kebenaran.** Logika yang sama (mis. rata-rata rating) tidak ditulis di dua tempat berbeda. Pakai accessor/scope model agar tidak terjadi divergensi seperti yang sekarang terjadi antara explore vs brand-detail.
2. **Primitif yang dapat dipakai ulang.** Mis. komponen konfirmasi dibuat sekali, dipakai semua halaman — supaya tidak ada lagi `confirm()` native bertebaran.
3. **Status mencerminkan peristiwa nyata.** Bukan tombol yang bisa diklik tanpa makna.
4. **Pertahankan yang sudah benar.** Rotasi featured (Cache), cek kepemilikan testimoni, toggle favorit, unique constraint — jangan diutak-atik.

---

## FASE R0 — Keamanan & Kebenaran Kritis (dahulukan)

### [ ] R0.1 — Tutup celah eskalasi hak akses di `RoleController` (temuan A) **(S)**
- **Akar masalah:** `new Middleware('permission:roles edit', only: ['edit', 'update   '])` — string `'update   '` punya spasi berlebih, sehingga middleware **tidak pernah** berlaku pada method `update` yang asli. Karena route roles hanya dijaga `auth`, user non-admin yang tahu endpoint bisa mengubah role/permission.
- **Solusi benar:** perbaiki menjadi `only: ['edit', 'update']`. Lalu **audit semua controller** untuk pola serupa (whitespace/typo di nama method dalam `only:`), dan pastikan setiap method tulis benar-benar tercakup middleware permission yang dimaksud. Tambahkan test otorisasi negatif: user non-admin → `PUT /roles/{id}` harus 403.
- **Selesai bila:** `roles.update` hanya bisa diakses pemilik permission `roles edit`; test negatif lulus; tidak ada typo `only:` lain di controller mana pun.

### [ ] R0.2 — Perbaiki permission verifikasi brand (#6) **(S)**
- **Akar masalah:** middleware `verify`/`unverify` memakai `permission:brands edit` (dimiliki vendor), bukan `permission:brands verify`. Vendor jadi bisa memverifikasi brand sendiri.
- **Solusi benar:** ubah middleware verify/unverify ke `permission:brands verify` (hanya admin yang punya). Di frontend, **gate tombol** verifikasi dengan pengecekan permission `brands verify` (sembunyikan bila tak punya) — frontend untuk UX, middleware sebagai penjaga sebenarnya. Test: vendor → `POST /brands/{id}/verify` harus 403.
- **Selesai bila:** hanya admin yang melihat & dapat menjalankan verifikasi; vendor mendapat 403 di backend.

---

## FASE R1 — Koreksi Model Data

### [ ] R1.1 — Skema status inquiry yang event-driven (#7, A3) **(M)**
- **Solusi benar (migration tambahan, aditif):** pada tabel `inquiries`, tambah:
  - `read_at` (timestamp, nullable) — diisi saat vendor pertama membuka.
  - `vendor_response` (text, nullable) — isi balasan nyata vendor (dilihat customer).
  - `responded_at` (timestamp, nullable) — diisi saat balasan dikirim.
  - `is_archived` (boolean, default false) — perapihan inbox vendor (terpisah dari status).
  - `closed_at` (timestamp, nullable) — diisi saat customer menutup.
  - Pertahankan kolom `status` (enum `pending,read,responded,closed`), tapi nilainya kini **diturunkan dari peristiwa** (lihat R2.2). Kolom lama `vendor_note` boleh dialihfungsikan jadi `vendor_response` atau ditinggalkan; pilih satu dan konsisten (rekomendasi: pakai `vendor_response` baru, drop `vendor_note` bila belum dipakai data nyata).
- **Selesai bila:** kolom-kolom di atas ada; migration up/down bersih.

### [ ] R1.2 — Simulasi menyimpan RENTANG harga + aman terhadap hapus paket (temuan B & C) **(M)**
- **Akar masalah:** `event_plan_items` hanya punya `price_snapshot` (diisi `price_start`), sehingga total = satu angka, bukan rentang (langgar D5). Selain itu `brand_package_id` pakai `cascadeOnDelete` → menghapus paket menghapus item rencana SEMUA user.
- **Solusi benar (migration):**
  - Ganti `price_snapshot` → **`price_start_snapshot`** dan tambah **`price_end_snapshot`** (keduanya `unsignedBigInteger`). Migrasikan data lama: `price_start_snapshot = price_snapshot`, `price_end_snapshot = price_snapshot` (atau ambil dari paket bila masih ada).
  - Ubah FK `brand_package_id` menjadi **`nullOnDelete`** (snapshot nama/harga sudah disimpan, jadi item tetap utuh saat paket dihapus).
- **Selesai bila:** item rencana menyimpan dua angka; menghapus paket tidak menghapus item rencana; total dapat ditampilkan sebagai rentang.

### [ ] R1.3 — Tabel `site_settings` untuk konten Tentang & Kontak (#12, A5) **(M)**
- **Solusi benar (migration + model):**
  - Tabel `site_settings`: `id`, `key` (string, unique), `value` (longText, nullable), `type` (string: `text`/`textarea`/`image`/`url`/`email`), `group` (string: `about`/`contact`/`general`), `label` (string), `sort` (integer, default 0), `timestamps`.
  - Model `SiteSettings` + helper statis `SiteSettings::get(string $key, $default = null)` dan `SiteSettings::group(string $group)` (untuk render). Pertimbangkan cache ringan (lupakan invalidasi rumit; clear cache saat update).
- **Selesai bila:** tabel + model + helper tersedia; siap diisi seeder (Part B) dan dibaca halaman publik.

---

## FASE R2 — Koreksi Logika Backend

### [ ] R2.1 — Rata-rata rating: satu sumber kebenaran dari SEMUA testimoni (#5, A2) **(M)**
- **Akar masalah:** explore me-rata-rata semua testimoni (`withAvg`), tapi `brandDetail` hanya yang `is_published=true` → menyembunyikan testimoni mengubah skor.
- **Solusi benar:**
  - Tambah accessor di model `Brands`: `averageRating` (rata-rata `rating` SEMUA testimoni, dibulatkan 1 desimal, null bila kosong) dan `reviewsCount` (jumlah SEMUA testimoni). Jadikan ini satu-satunya sumber angka rating di seluruh aplikasi.
  - `LandingController::brandDetail`: hitung `avgRating`/`reviewsCount` dari **semua** testimoni (hapus filter `is_published` pada perhitungan). Untuk daftar testimoni yang ditampilkan, tetap **hanya `is_published=true`**, diberi judul "Testimoni Pilihan".
  - `explore`/`compare`: `withAvg('testimonials','rating')` tanpa filter (sudah benar) — pastikan konsisten dengan accessor.
- **Selesai bila:** menyembunyikan satu testimoni TIDAK mengubah rata-rata/jumlah ulasan di halaman publik; angka identik di explore, compare, dan brand-detail.

### [ ] R2.2 — Logika status inquiry event-driven (#7, A3) **(M)**
- **Solusi benar (di `InquiriesController` + frontend):**
  - **Hapus** `updateStatus` yang menerima status bebas. Ganti dengan aksi-aksi bermakna:
    - `show` (vendor buka): bila `status=pending`, set `status=read` + `read_at=now()` (sudah ada, pertahankan + isi `read_at`).
    - `respond` (vendor kirim balasan): validasi `vendor_response` wajib; simpan, set `status=responded` + `responded_at=now()`. Hanya boleh bila milik brand-nya.
    - `archive`/`unarchive` (vendor): set `is_archived` — tidak mengubah `status`.
    - `close` (customer): customer menutup inquiry miliknya → `status=closed` + `closed_at=now()`. Otorisasi: hanya pemilik (`user_id == Auth::id()`).
  - **Customer melihat balasan:** di `my-inquiries`, tampilkan `vendor_response` + badge status yang jujur (Terkirim / Dibaca / Dibalas / Selesai).
  - Permission tetap `inquiries update` untuk aksi vendor (`respond`,`archive`); aksi `close` cukup `auth` + cek kepemilikan.
- **Selesai bila:** vendor tak bisa menandai "dibalas" tanpa benar-benar membalas; customer melihat balasan & status yang jujur; vendor bisa mengarsip tanpa menipu status.

### [ ] R2.3 — Pisahkan kategori brand (EO/WO) dari kategori layanan (#2, A1) **(M)**
- **Solusi benar:**
  - `StoreVendorApplicationRequest`: ubah aturan `category` menjadi **multi** EO/WO, mis. `category` jadi array `['required','array']` dengan tiap elemen `in:EO,WO` — ATAU pertahankan string tapi `in:EO,WO` saja. Rekomendasi: jadikan **array** agar satu brand bisa EO+WO. Sesuaikan kolom `vendor_applications.category` ke JSON bila perlu (migration aditif) atau simpan string "EO,WO".
  - Form `/join` (`landing/join.tsx`): ganti dropdown menjadi **pilihan EO/WO** (checkbox multi atau multi-select), HAPUS kategori layanan dari sini.
  - `VendorApplicationController::approve`: petakan kategori aplikasi → `brand.category` (array EO/WO).
  - **Audit:** pastikan tidak ada tempat lain yang menawarkan kategori layanan sebagai kategori brand. Kategori layanan hanya muncul di form **paket**.
- **Selesai bila:** pendaftaran mitra hanya meminta EO/WO; brand tersimpan dengan kategori EO/WO; kategori layanan eksklusif untuk paket.

### [ ] R2.4 — Notifikasi email approve & reject yang benar (#1, temuan D) **(M)**
- **Akar masalah:** `MAIL_MAILER=log` (email ke log, bukan inbox) + email approve hanya reset-password generik + reject tanpa email.
- **Solusi benar:**
  - Buat dua Notification (idealnya `ShouldQueue`, Markdown mailable):
    - `VendorApplicationApproved` — sambutan + instruksi set password (sertakan link reset/temporary signed URL). Dikirim ke email pelamar di `approve()`.
    - `VendorApplicationRejected` — pemberitahuan sopan + alasan (opsional). Dikirim di `reject()`.
  - `reject()` menyimpan `rejection_reason` (tambah kolom nullable bila ingin menampilkan alasan).
  - **Konfigurasi mail:** untuk dev gunakan **Mailpit** (atau `MAIL_MAILER=log` cukup untuk verifikasi isi), untuk produksi SMTP via env. Dokumentasikan di README bahwa mail harus dikonfigurasi; jangan hardcode kredensial.
- **Selesai bila:** approve & reject mengirim email yang sesuai konteks (bukan reset-password telanjang); di dev email terlihat di Mailpit/log; reject memberi kabar pelamar.

---

## FASE R3 — Konsistensi Frontend (shadcn)

### [ ] R3.1 — Komponen `ConfirmDialog` reusable + ganti semua dialog native (#3) **(M)**
- **Akar masalah:** 7 pemakaian `confirm()`/`alert()` native di halaman baru, padahal pola kanonik `delete-button.tsx` (shadcn `AlertDialog` + `toast.promise`) sudah ada.
- **Solusi benar:** buat komponen generik `ConfirmDialog` (judul, deskripsi, label aksi, varian destructive, callback + integrasi `toast.promise`) yang menggeneralisasi pola `delete-button`. Lalu **ganti semua** pemakaian native:
  - `event-plans/show.tsx:58`, `event-plans/index.tsx:142`, `vendor-applications/show.tsx:42` & `:48`, `service-categories/index.tsx:28`, `availability/index.tsx:35`, dan `alert()` di `brands-portfolios/show.tsx:129` (ubah jadi `toast.error`).
- **Selesai bila:** tidak ada lagi `window.confirm`/`alert()` di `resources/js`; semua konfirmasi memakai `ConfirmDialog`/shadcn; semua hasil aksi memberi toast.

### [ ] R3.2 — Jembatan flash → toast global + Toaster di halaman publik (#4) **(M)**
- **Akar masalah:** `<Toaster/>` hanya di `app-layout` (dashboard); halaman publik senyap meski controller mengirim flash.
- **Solusi benar:**
  - Buat hook/komponen `<FlashToaster/>` yang membaca `usePage().props.flash` (`success`/`error`) dan memicu `toast.success`/`toast.error` saat berubah. Pastikan `HandleInertiaRequests::share()` selalu membagikan `flash` (success & error) secara global.
  - Pasang `<Toaster/>` + `<FlashToaster/>` di **kedua** layout: dashboard (`app-layout`) DAN layout publik/landing. Idealnya di root agar berlaku menyeluruh.
  - Form inquiry & semua aksi publik (favorit, kirim testimoni, kirim aplikasi vendor) otomatis memberi feedback lewat jembatan ini.
- **Selesai bila:** setiap aksi (mengirim inquiry/testimoni/aplikasi, toggle favorit) memunculkan toast sukses/gagal, di halaman publik maupun dashboard.

### [ ] R3.3 — Pengelompokan & penamaan permission yang rapi (#13) **(M)**
- **Akar masalah:** `PermissionPicker` hanya punya grup untuk `users`, `roles`, `brands*`; semua modul baru jatuh ke "Lainnya" dengan nama mentah, dan aksi `approve/reject/moderate/manage/verify` tak berlabel.
- **Solusi benar:** lengkapi registry grup di `permission-picker.tsx` dengan grup + ikon + deskripsi + label untuk SEMUA modul: Aplikasi Vendor (`vendor applications`), Kategori Layanan (`service categories`), Testimoni (`testimonials`), Favorit (`favorites`), Rencana Acara (`event plans`), Inquiry (`inquiries`), Ketersediaan (`availability`), Pengaturan Situs (`site settings`). Tambah label aksi: `approve`→"Setujui", `reject`→"Tolak", `moderate`→"Moderasi", `manage`→"Kelola", `verify`→"Verifikasi", `show`→"Lihat Detail". Pastikan tidak ada permission yang tersisa di "Lainnya" (jadikan "Lainnya" benar-benar kosong untuk set permission saat ini).
- **Selesai bila:** halaman edit role menampilkan semua permission terkelompok rapi dengan label ramah; kotak "Lainnya" kosong.

---

## FASE R4 — UX & Fitur

### [ ] R4.1 — Redesign tampilan publik menjadi content-first (#11, A4) **(L)**
- **Solusi benar:** rombak `welcome.tsx` (`/`) menjadi direktori content-first:
  - Header ringkas: logo + satu kalimat ("Temukan EO & WO terbaik") — **tanpa** hero `min-h-[580px]`/gradient tebal.
  - Di bawah header langsung: **bar pencarian + filter** (kategori EO/WO, kota, kategori layanan, rating, verified, rentang harga, urutan) — gunakan kembali logika filter `explore`.
  - **Grid vendor** sebagai konten utama (kartu menampilkan: cover, nama, kategori EO/WO, badge verified, rata-rata rating, "mulai dari" harga numerik, tombol favorit).
  - **Vendor unggulan**: tampilkan sebagai segmen berlabel ("Unggulan") di atas grid atau baris pertama — bukan hero.
  - Gabungkan pengalaman home & explore: `/explore` boleh menjadi alias/registrasi route yang sama, atau home langsung mengambil alih peran discovery. Hindari duplikasi komponen.
- **Selesai bila:** membuka `/` langsung memperlihatkan vendor yang bisa dicari & difilter tanpa hero marketing; alur to-the-point; tidak ada duplikasi komponen explore vs home.

### [ ] R4.2 — Dashboard tiap peran sesuai kebutuhan utama (#9, A6) **(M)**
- **Solusi benar (di `DashboardController` + halaman `dashboard`):**
  - **Admin:** tambah metrik **aplikasi vendor pending** (actionable) + daftar aplikasi terbaru yang perlu direview. Pertahankan total brands/users/views/WA.
  - **Vendor:** tambah **jumlah lead baru (inquiry `pending`)** + daftar lead terbaru, dan **jumlah testimoni menunggu moderasi**. Pertahankan analytics (views, WA, grafik 7 hari).
  - **Customer (bangun dari kosong):** jumlah rencana acara + ringkasannya, jumlah favorit, daftar inquiry beserta status (sorot yang sudah **Dibalas**), dan tombol cepat ke `/explore`.
- **Selesai bila:** tiap peran melihat informasi utama yang relevan & actionable; dashboard customer tidak lagi kosong.

### [ ] R4.3 — Halaman Tentang Kami & Kontak (publik) + editor admin (#12, A5) **(L)**
- **Solusi benar (memanfaatkan `site_settings` dari R1.3):**
  - **Admin:** halaman `/site-settings` (permission `site settings index`/`edit`) — form terkelompok (About / Contact) yang me-render input sesuai `type` (text/textarea/url/email/image). Upload gambar ke disk `public`. Simpan via Form Request.
  - **Publik:** route + halaman `/tentang-kami` dan `/kontak` yang membaca `SiteSettings::group(...)`. Tautkan keduanya di footer/header publik.
  - **Permission baru:** `site settings index`, `site settings edit` (admin). Tambah ke PermissionSeeder + RoleSeeder + PermissionPicker (R3.3).
- **Selesai bila:** admin dapat mengubah teks, gambar, dan info kontak; halaman publik menampilkannya; tidak ada konten hardcoded.

### [ ] R4.4 — Shortcut ke situs publik di sidebar dashboard (#10) **(S)**
- **Solusi benar:** tambahkan item navigasi (mis. "Lihat Situs" → `/` dan/atau "Jelajahi Vendor" → `/explore`) yang tampil untuk **semua peran** (mis. di `footerNavItems` `app-sidebar.tsx` atau section khusus). Buka di tab/route yang sesuai.
- **Selesai bila:** ketiga peran punya jalan cepat dari dashboard ke halaman publik.

### [ ] R4.5 — CTA buat inquiry di halaman "Inquiry Saya" (#8) **(S)**
- **Solusi benar:** di `inquiries/my-inquiries.tsx`, tambahkan tombol CTA "Jelajahi Vendor" → `/explore` pada empty state **dan** di header halaman (selalu ada). Gunakan komponen Button shadcn.
- **Selesai bila:** dari "Inquiry Saya", user punya jalan cepat ke explore untuk membuat inquiry baru.

### [ ] R4.6 — Pilihan kategori EO/WO multi pada brand/aplikasi (#2 lanjutan, A1) **(S)**
- **Solusi benar:** pastikan UI pengelolaan brand (admin & vendor) dan form aplikasi memakai **multi-select EO/WO** (bukan single, bukan kategori layanan). Validasi konsisten dengan R2.3. Tampilkan kategori brand (EO/WO) di kartu & detail brand.
- **Selesai bila:** brand dapat bertipe EO, WO, atau keduanya, dan ditampilkan konsisten.

---

## FASE R5 — Seeder (rancang ulang)

### [ ] R5.1 — Rancang ulang seluruh seeder dengan 7 brand baru **(L)**
- **Lihat dokumen `eventura-seeders-redesign.md`** untuk kode lengkap. Ringkasnya, seeder dirombak agar:
  - Memakai 7 brand: **Dinar Wedding Organizer, Lumina Wedding Organizer, Needs Wedding Organizer, MJ Storia, Benang Merah, Mars Production, Endless Production** (pembagian EO/WO yang masuk akal).
  - Tiap brand punya **paket lintas kategori layanan** (harga numerik) — agar simulasi mix-and-match bermakna.
  - Portfolio, testimoni (termasuk yang disembunyikan untuk membuktikan rata-rata dari-semua), favorit, **rencana acara lintas vendor** (membuktikan rentang total), inquiry **dengan status event-driven + balasan**, tanggal tidak tersedia, dan **konten Tentang/Kontak** (`site_settings`).
  - Idempotent (`firstOrCreate`/cek eksis) agar aman dijalankan ulang.
  - Urutan `DatabaseSeeder` diperbarui mengikuti dependensi.
- **Selesai bila:** `php artisan migrate:fresh --seed` menghasilkan data yang mendemokan SEMUA fitur (termasuk rating dari-semua, simulasi rentang, status inquiry jujur) tanpa error.

---

## Definition of Done (per task)

1. Memenuhi "Selesai bila".
2. Migration up/down bersih; model `$table`/`$fillable`/`casts`/relasi eksplisit.
3. Otorisasi via permission + cek kepemilikan; `Gate::before` admin; vendor hanya datanya; customer hanya miliknya.
4. Semua input lewat Form Request.
5. Frontend memakai shadcn/ui yang ada; konfirmasi via `ConfirmDialog`; feedback via toast; navigasi per peran diperbarui.
6. ≥1 Pest feature test happy-path + ≥1 test otorisasi negatif lulus (utamakan R0.1, R0.2).
7. Tidak ada `confirm()`/`alert()` native, teks tidak profesional, atau dead code tersisa.
8. `php artisan test` hijau; route & fitur lama tidak regresi.
9. Commit kecil per task, pesan menyebut ID task.

---

*Setiap perubahan ruang lingkup wajib memperbarui §A lebih dulu agar eksekusi tetap sejalan.*
