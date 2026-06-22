# Patch Palembang Event Center — Batch 2 — Todo untuk Claude Code

**Repo:** https://github.com/Itsnotf/eventura.git · **Basis:** commit `8084e46`
**Stack:** Laravel 12 · Fortify · Spatie Permission · Inertia 2 · React 19 · TypeScript · Tailwind 4 · MySQL

Batch ini mencakup 4 perubahan: (1) alur notifikasi vendor application dari email → WhatsApp, (2) rating brand di `BrandCard`, (3) penerapan logo baru di seluruh aplikasi (termasuk favicon), (4) ilustrasi di panel kiri halaman auth.

> **Keputusan yang sudah disepakati dengan owner:**
> - WhatsApp dikirim via link `wa.me` (gratis, tanpa API berbayar). Admin tetap yang menekan tombol "Kirim" di WhatsApp — sistem hanya menyiapkan link + teks pesan.
> - Setelah approve/reject diproses, sistem **menampilkan tombol terpisah** "Kirim ke WhatsApp" di halaman (BUKAN auto-redirect ke tab baru — itu rawan diblokir popup blocker browser).
> - Notifikasi email untuk approve/reject **dihapus total**, diganti WhatsApp. Tidak ada channel ganda (email + WA).
> - Asset logo & ilustrasi sudah disiapkan & diproses (crop, trim, kompresi) — tinggal ditempatkan, **tidak perlu generate ulang**.

**Urutan kerja:** Task 1 → 2 → 3 → 4 → verifikasi akhir.

---

## Task 1 — Vendor Application: Email → WhatsApp

### 1.1 Backend — `app/Http/Controllers/VendorApplicationController.php`

**Hapus import** yang tidak lagi dipakai:
```php
use App\Notifications\VendorApplicationApproved;
use App\Notifications\VendorApplicationRejected;
```

**Method `approve()`** — setelah blok update status aplikasi (`$application->update([...status approved...])`), ganti bagian notifikasi:

Sebelumnya:
```php
$token    = Password::broker()->createToken($vendor);
$resetUrl = url(route('password.reset', ['token' => $token, 'email' => $vendor->email], false));
$vendor->notify(new VendorApplicationApproved($application->brand_name, $resetUrl));

return redirect()->route('vendor-applications.index')
    ->with('success', "Aplikasi {$application->brand_name} disetujui. Undangan dikirim ke {$application->email}.");
```

Ganti menjadi:
```php
$token    = Password::broker()->createToken($vendor);
$resetUrl = url(route('password.reset', ['token' => $token, 'email' => $vendor->email], false));

$waMessage = "Halo {$application->applicant_name}! 🎉\n\n"
    . "Selamat, aplikasi vendor *{$application->brand_name}* di *" . config('app.name') . "* telah *disetujui*.\n\n"
    . "Akun Anda sudah aktif. Silakan atur password Anda melalui link di bawah ini untuk mulai login dan melengkapi profil brand:\n"
    . $resetUrl . "\n\n"
    . "Link berlaku 60 menit sejak pesan ini dikirim. Jika sudah kedaluwarsa, gunakan fitur \"Lupa Password\" di halaman login.\n\n"
    . "Terima kasih telah bergabung bersama " . config('app.name') . "!";

return redirect()->route('vendor-applications.show', $application->id)
    ->with('success', "Aplikasi {$application->brand_name} disetujui.")
    ->with('whatsapp', [
        'phone'   => $application->phone,
        'message' => $waMessage,
    ]);
```

> Catatan: redirect tujuan berubah dari `vendor-applications.index` → `vendor-applications.show` agar tombol "Kirim ke WhatsApp" langsung muncul di halaman yang sama.

**Method `reject()`** — hapus seluruh blok lookup `$applicant`/`Notification::route(...)`, ganti notifikasi:

Sebelumnya:
```php
// Notify the applicant by email
$notification = new VendorApplicationRejected($application->brand_name, $application->applicant_name);
$applicant = User::firstWhere('email', $application->email);
if ($applicant) {
    $applicant->notify($notification);
} else {
    \Illuminate\Support\Facades\Notification::route('mail', $application->email)
        ->notify($notification);
}

return redirect()->route('vendor-applications.index')
    ->with('success', "Aplikasi {$application->brand_name} ditolak.");
```

Ganti menjadi:
```php
$waMessage = "Halo {$application->applicant_name},\n\n"
    . "Terima kasih telah mendaftarkan brand *{$application->brand_name}* ke " . config('app.name') . ".\n\n"
    . "Setelah melalui proses review, kami mohon maaf aplikasi Anda belum dapat kami setujui pada saat ini. "
    . "Hal ini bisa disebabkan oleh dokumen yang belum lengkap atau belum memenuhi persyaratan kami.\n\n"
    . "Anda dapat mendaftar kembali kapan saja dengan melengkapi persyaratan yang diperlukan di halaman pendaftaran kami.\n\n"
    . "Salam,\nTim " . config('app.name');

return redirect()->route('vendor-applications.show', $application->id)
    ->with('success', "Aplikasi {$application->brand_name} ditolak.")
    ->with('whatsapp', [
        'phone'   => $application->phone,
        'message' => $waMessage,
    ]);
```

**Method `show()`** — teruskan flash `whatsapp` ke Inertia (saat ini hanya `success` yang diteruskan):

Sebelumnya:
```php
return Inertia::render('vendor-applications/show', [
    'application'  => $application,
    'documentUrl'  => asset('storage/' . $application->document),
]);
```

Ganti menjadi:
```php
return Inertia::render('vendor-applications/show', [
    'application'  => $application,
    'documentUrl'  => asset('storage/' . $application->document),
    'flash'        => [
        'success'   => session('success'),
        'whatsapp'  => session('whatsapp'),
    ],
]);
```

### 1.2 Hapus file yang sudah tidak dipakai

- `app/Notifications/VendorApplicationApproved.php` — **hapus file**.
- `app/Notifications/VendorApplicationRejected.php` — **hapus file**.
- `resources/views/mail/vendor-application-approved.blade.php` — **hapus file**.
- `resources/views/mail/vendor-application-rejected.blade.php` — **hapus file**.

### 1.3 Frontend — `resources/js/pages/vendor-applications/show.tsx`

1. Tambah import:
   ```tsx
   import { whatsappUrl } from '@/components/landing/brand-card';
   import { MessageCircle } from 'lucide-react'; // gabung ke import lucide-react yang sudah ada
   ```
2. Update interface `Props`:
   ```tsx
   interface Props {
       application: Application;
       documentUrl: string;
       flash?: { success?: string; whatsapp?: { phone: string; message: string } };
   }
   ```
3. Di bawah blok `{flash?.success && (...)}` yang sudah ada, tambahkan blok baru:
   ```tsx
   {flash?.whatsapp && (
       <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
           <p className="text-sm text-green-800">
               Pesan untuk <strong>{application.applicant_name}</strong> sudah disiapkan. Klik tombol untuk membuka WhatsApp dan kirim.
           </p>
           <a
               href={whatsappUrl(flash.whatsapp.phone, flash.whatsapp.message)}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm font-medium shrink-0"
           >
               <MessageCircle className="h-4 w-4" />
               Kirim ke WhatsApp
           </a>
       </div>
   )}
   ```

**Acceptance Task 1:**
- Approve aplikasi pending → halaman tetap di `/vendor-applications/{id}`, status berubah jadi `approved`, tombol "Setujui/Tolak" hilang, muncul banner hijau + tombol "Kirim ke WhatsApp" yang saat diklik membuka tab baru `wa.me/62...` dengan teks pesan (termasuk link reset password) sudah terisi.
- Reject aplikasi pending → sama, tapi teks pesan berisi pesan penolakan.
- Tidak ada lagi email terkirim untuk approve/reject (cek Mailpit — harus kosong untuk aksi ini).
- File notification class & blade mail vendor-application sudah terhapus, tidak ada reference rusak (`grep -rn "VendorApplicationApproved\|VendorApplicationRejected" app/ resources/` harus nihil).

---

## Task 2 — Rating Brand di `BrandCard`

Backend untuk `welcome.tsx` dan `landing/explore.tsx` **sudah** menyediakan `testimonials_avg_rating` (lihat `LandingController::home()` & `explore()`, sudah `withAvg('testimonials', 'rating')`). Hanya `FavoritesController` yang belum, dan frontend `BrandCard` belum menampilkannya.

### 2.1 Backend — `app/Http/Controllers/FavoritesController.php`

Method `index()`, tambahkan `withAvg`:
```php
$brands = Brands::whereHas('favoritedByUsers', fn($q) => $q->where('user_id', Auth::id()))
    ->withMin('packages', 'price_start')
    ->withAvg('testimonials', 'rating')
    ->latest()
    ->get();
```

### 2.2 Frontend — `resources/js/components/landing/brand-card.tsx`

1. Tambah import `Star` dari `lucide-react` (gabung ke import yang sudah ada: `BadgeCheck, Heart, MapPin` → tambah `Star`).
2. Update interface:
   ```tsx
   export interface BrandWithStats extends Brand {
       packages_min_price_start?: number | null;
       testimonials_avg_rating?: number | null;
   }
   ```
3. Tambah komponen kecil (export, supaya bisa dipakai ulang di `compare.tsx` nanti kalau perlu refactor):
   ```tsx
   export function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
       const starClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
       return (
           <div className="flex gap-0.5">
               {[1, 2, 3, 4, 5].map(s => (
                   <Star key={s} className={`${starClass} ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-lp-on-surface-variant/30'}`} />
               ))}
           </div>
       );
   }
   ```
4. Di dalam `BrandCard`, tepat di bawah baris nama+badge (`<div className="flex items-start justify-between gap-2">...</div>`) dan **sebelum** baris address, sisipkan baris rating baru:
   ```tsx
   {brand.testimonials_avg_rating ? (
       <div className="flex items-center gap-1.5">
           <RatingStars rating={brand.testimonials_avg_rating} />
           <span className="text-xs font-semibold text-lp-on-surface">{Number(brand.testimonials_avg_rating).toFixed(1)}</span>
       </div>
   ) : (
       <p className="text-lp-on-surface-variant text-xs italic">Belum ada rating</p>
   )}
   ```

**Acceptance Task 2:**
- Di halaman Beranda, Explore, dan Favorit — setiap `BrandCard` menampilkan baris bintang + skor (atau "Belum ada rating" bila brand belum punya testimoni) tepat di bawah nama brand.
- Tidak ada error TypeScript (`npm run build` lolos).

> *Opsional, tidak wajib dikerjakan sekarang:* `compare.tsx` punya komponen `Stars` lokal yang fungsinya sama — bisa dirapikan untuk import `RatingStars` dari `brand-card.tsx` agar tidak duplikat. Boleh dilewati kalau ingin minim risiko regresi di halaman compare.

---

## Task 3 — Penerapan Logo Baru

### 3.1 Tempatkan file asset (sudah diproses, jangan generate ulang)

Owner akan menempatkan file-file ini ke repo (sudah di-crop, di-trim, dan dikompresi):

| File | Tujuan |
|---|---|
| `public/images/brand/logo-icon.png` | Icon mark teal, transparan — untuk dipakai di atas background terang |
| `public/images/brand/logo-icon-white.png` | Icon mark putih, transparan — untuk dipakai di atas background gelap |
| `public/favicon.ico` | **Overwrite** favicon default Laravel |
| `public/apple-touch-icon.png` | **Overwrite** apple-touch-icon default Laravel |

File `logo-full.png` & `logo-full-white.png` (lockup lengkap icon+wordmark) juga disediakan owner tapi **TIDAK perlu** diwire ke kode — dipakai owner untuk keperluan luar aplikasi (cover skripsi, dokumen, dsb). Jangan dipasang di UI.

**Hapus:**
- `public/favicon.svg` — leftover boilerplate Laravel (logo huruf "L" merah), bukan brand kita. Tidak ada vector pengganti, cukup andalkan `favicon.ico`.
- `public/logo.svg` — leftover boilerplate Laravel, tidak direferensikan di mana pun (`grep -rn "logo.svg" resources/` nihil), aman dihapus langsung.

**Edit `resources/views/app.blade.php`:** hapus baris:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```
Baris `<link rel="icon" href="/favicon.ico" sizes="any">` dan `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` **tetap dipertahankan** (sekarang menunjuk ke file baru).

### 3.2 Refactor `resources/js/components/app-logo-icon.tsx`

Komponen ini sekarang berbasis raster image (bukan inline SVG path lagi), dengan dukungan 2 mode warna:
- `tone="auto"` (default) — ikut tema dark/light situs (untuk konteks dashboard internal yang memang theme-aware: sidebar, header).
- `tone="teal"` / `tone="white"` — warna dipaksa tetap, dipakai di halaman publik (`lp-*` token) yang **TIDAK** ikut dark/light mode situs (cek `resources/css/app.css` — blok `.dark {}` hanya override token shadcn standar, tidak ada override `lp-*`).

```tsx
import { ImgHTMLAttributes } from 'react';

type Tone = 'auto' | 'teal' | 'white';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    tone?: Tone;
}

export default function AppLogoIcon({ tone = 'auto', className, ...props }: AppLogoIconProps) {
    const alt = 'Palembang Event Center';

    if (tone === 'white') {
        return <img src="/images/brand/logo-icon-white.png" alt={alt} className={className} {...props} />;
    }
    if (tone === 'teal') {
        return <img src="/images/brand/logo-icon.png" alt={alt} className={className} {...props} />;
    }
    return (
        <>
            <img src="/images/brand/logo-icon.png" alt={alt} className={`dark:hidden ${className ?? ''}`} {...props} />
            <img src="/images/brand/logo-icon-white.png" alt={alt} className={`hidden dark:block ${className ?? ''}`} {...props} />
        </>
    );
}
```

### 3.3 Update semua pemanggil `AppLogoIcon`

Untuk tiap lokasi di bawah, **hapus** class `fill-current text-*` (sudah tidak relevan untuk `<img>`), sisakan hanya class ukuran. Tambahkan `tone` sesuai konteks background:

| File & baris (kira-kira) | Sebelum | Sesudah |
|---|---|---|
| `resources/js/components/app-header.tsx` (mobile sheet, bg theme-aware) | `<AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />` | `<AppLogoIcon className="h-6 w-6" />` *(tone="auto" default)* |
| `resources/js/components/app-logo.tsx` (dipakai di sidebar & header, box bg theme-aware) | `<AppLogoIcon className="size-5 fill-current text-white dark:text-black" />` | `<AppLogoIcon className="size-5" />` *(tone="auto" default)* |
| `resources/js/layouts/auth/auth-split-layout.tsx` — panel **kiri** (bg selalu dark teal, TIDAK ikut tema) | `<AppLogoIcon className="size-8 fill-current text-white" />` | `<AppLogoIcon tone="white" className="size-8" />` |
| `resources/js/layouts/auth/auth-split-layout.tsx` — fallback mobile (bg `lp-surface`, selalu terang, TIDAK ikut tema) | `<AppLogoIcon className="h-10 fill-current text-lp-primary sm:h-12" />` | `<AppLogoIcon tone="teal" className="h-10 sm:h-12" />` |
| `resources/js/layouts/auth/auth-card-layout.tsx` & `auth-simple-layout.tsx` (cek juga di sini, kemungkinan layout legacy yang tidak lagi dipakai sejak Task 3 batch sebelumnya — kalau memang tidak ada page yang import, cukup samakan saja `tone="teal"` untuk konsistensi, tidak prioritas) | — | `tone="teal"`, hapus `fill-current text-*` |

### 3.4 Tambahkan logo ke navbar publik — `resources/js/layouts/landing-layout.tsx`

Saat ini brand link di navbar hanya teks (tidak ada icon sama sekali). Tambahkan icon di depannya:

Sebelumnya:
```tsx
<Link href="/" className="font-playfair text-2xl font-semibold text-lp-primary">
    {name}
</Link>
```

Ganti menjadi:
```tsx
<Link href="/" className="flex items-center gap-2 font-playfair text-2xl font-semibold text-lp-primary">
    <AppLogoIcon tone="teal" className="h-8 w-8" />
    {name}
</Link>
```
Jangan lupa tambah import: `import AppLogoIcon from '@/components/app-logo-icon';`

**Acceptance Task 3:**
- Tab browser & bookmark menampilkan icon bridge-pin baru (bukan logo "L" Laravel merah).
- Navbar publik (semua halaman landing) menampilkan icon + nama app.
- Dashboard sidebar & header (admin/vendor) menampilkan icon baru, tetap kontras di light & dark mode.
- Panel kiri halaman auth (login/register/dll) menampilkan icon **putih** dengan kontras baik di atas background gradient teal gelap.
- `npm run build` tidak error.

---

## Task 4 — Ilustrasi di Panel Kiri Halaman Auth

File sudah disiapkan owner di `public/images/brand/auth-illustration.webp` (sudah ditrim & dikompresi ke ~250KB, ukuran 900px lebar — cukup tajam untuk panel auth, jangan resize ulang).

### 4.1 Edit `resources/js/layouts/auth/auth-split-layout.tsx`

Panel kiri saat ini (`<div className="relative hidden lg:flex flex-col bg-lp-primary p-10 ...">`) berisi: link logo di atas, lalu blok tagline di `mt-auto`. Tambahkan ilustrasi di antara dua elemen itu, mengisi area kosong tengah panel:

```tsx
<div className="relative hidden lg:flex flex-col bg-lp-primary p-10 text-lp-on-primary">
    <div className="absolute inset-0 bg-gradient-to-br from-lp-primary via-teal-700 to-teal-900" />
    <Link
        href={home()}
        className="relative z-20 flex items-center gap-2 text-lg font-playfair font-semibold text-white"
    >
        <AppLogoIcon tone="white" className="size-8" />
        {name}
    </Link>

    {/* Ilustrasi — ditambahkan, mengisi ruang kosong tengah panel */}
    <div className="relative z-10 flex-1 flex items-center justify-center py-8">
        <img
            src="/images/brand/auth-illustration.webp"
            alt="Ilustrasi dekorasi acara di tepi Sungai Musi, Palembang"
            className="max-w-md w-full h-auto select-none pointer-events-none"
        />
    </div>

    <div className="relative z-20 mt-auto space-y-4">
        <p className="font-playfair text-2xl font-semibold text-white leading-snug">
            Wujudkan Acara Impian Anda<br />di Palembang
        </p>
        <p className="text-teal-100 text-sm leading-relaxed max-w-xs">
            Temukan Event Organizer dan Wedding Organizer profesional terpercaya di Palembang dan sekitarnya — semua dalam satu platform.
        </p>
    </div>
</div>
```

Perhatikan: blok ilustrasi pakai `flex-1` supaya otomatis mengisi sisa ruang vertikal di antara logo dan tagline, di layar pendek/tinggi manapun panel ini tetap proporsional (tidak overflow). Tambah `z-10` (di bawah `z-20` teks) supaya tidak menutupi logo/tagline kalau ada overlap.

**Acceptance Task 4:**
- Semua halaman auth (login, register, forgot-password, reset-password, confirm-password, verify-email, two-factor-challenge — karena semua memakai `AuthSplitLayout` yang sama) menampilkan ilustrasi di panel kiri, di layar `lg` ke atas.
- Panel kiri tidak terlihat kosong lagi, tapi logo & tagline tetap terbaca jelas (tidak tertutup ilustrasi).
- Di mobile/tablet (`<lg`, panel kiri disembunyikan) tampilan tidak berubah — tidak ada regresi.

---

## Verifikasi Akhir

```bash
# Frontend
npm run build          # pastikan tidak ada error TypeScript/build

# Sanity check tidak ada reference rusak
grep -rn "VendorApplicationApproved\|VendorApplicationRejected" app/ resources/   # harus nihil
grep -rn "logo.svg\|favicon.svg" resources/views/app.blade.php                   # favicon.svg harus nihil
```

Cek manual:
1. **WhatsApp flow:** Buat aplikasi vendor baru lewat `/join` dengan nomor WA milikmu sendiri → login admin → approve → muncul tombol "Kirim ke WhatsApp" → klik → pastikan WhatsApp Web/App terbuka dengan teks pesan & link reset password sudah terisi otomatis. Ulangi untuk reject (pesan penolakan).
2. **Rating:** Buka `/`, `/explore`, `/favorites` → pastikan bintang rating muncul di bawah nama tiap brand yang sudah punya testimoni; brand tanpa testimoni menampilkan "Belum ada rating".
3. **Logo:** Cek tab browser (favicon), navbar publik, sidebar dashboard (mode terang & gelap), dan panel kiri halaman `/login` — semua menampilkan logo bridge-pin baru dengan kontras yang baik di tiap background.
4. **Ilustrasi auth:** Buka `/login` di layar desktop → ilustrasi tampil rapi di panel kiri, tidak menutupi teks.

---

## Catatan tambahan (di luar scope batch ini)

Saat menelusuri `StoreVendorApplicationRequest.php` untuk Task 1, saya menemukan rule `'category.*' => ['in:EO,WO']` — ini masih membatasi pendaftaran vendor baru hanya ke kategori EO/WO, padahal kategori CC & Catering sudah ada di sistem (dan form `join.tsx` juga belum punya pilihan checkbox untuk itu). Ini konsisten dengan isu yang sudah dicatat sebelumnya (form `create.tsx`/`edit.tsx` brand juga belum punya opsi CC/Catering di UI meski backend-nya sudah mengizinkan). Tidak saya masukkan ke batch ini karena bukan bagian dari 3 update yang diminta — beri tahu saya kalau mau sekalian dibereskan di batch berikutnya.
