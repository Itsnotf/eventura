# Eventura — Patch Todo v4

Konteks: hasil diskusi perencanaan dengan Claude (bukan Claude Code) tanggal 2026-07-01, berdasarkan inspeksi langsung repo `github.com/Itsnotf/eventura` (commit terakhir `570f293`). Semua keputusan desain di bawah sudah dikonfirmasi Kyn. Poin "mobile deep-dive" (dulunya poin 6) **sengaja tidak ada di sini** — akan dibahas terpisah setelah task 1–5 ini selesai dan direview.

Urutan eksekusi: Task 1 → 2 → 3 (tergantung migrasi Task 2) → 4 → 5. Jalankan `php artisan migrate` setelah membuat migrasi di Task 1 dan Task 2 sebelum lanjut ke frontend supaya bisa testing end-to-end.

---

## Task 1 — Video Company Profile di Brand Detail (public)

**Keputusan yang sudah difinalkan bareng Kyn:**
- Sumber video: **upload file langsung** (bukan link YouTube), mirip pola `logo`/`cover_image`.
- Modal autoplay+muted, tidak bisa di-close 5 detik pertama, tayang **hanya sekali per pengunjung** (localStorage, key per-brand).
- Video yang sama **tetap ditampilkan permanen** di halaman brand detail (bukan cuma modal sekali-lewat) supaya pengunjung yang mau nonton ulang bisa.

### 1.1 Migration

Buat file baru `database/migrations/2026_07_01_000001_add_company_profile_video_to_brands_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->string('company_profile_video')->nullable()->after('cover_image');
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn('company_profile_video');
        });
    }
};
```

### 1.2 Model — `app/Models/Brands.php`

Tambahkan `'company_profile_video'` ke `$fillable`, setelah `'cover_image'`.

### 1.3 FormRequest — `app/Http/Requests/BrandsRequest/CreateBrandRequest.php` dan `UpdateBrandRequest.php`

Di kedua file (isinya identik untuk bagian ini), tambahkan ke `rules()` setelah baris `'cover_image' => ...`:

```php
'company_profile_video' => 'nullable|file|mimes:mp4,mov,webm|max:51200',
```

(51200 KB = 50MB. Tidak ada library ffmpeg di composer.json jadi durasi tidak divalidasi server-side — cukup dibatasi ukuran file. Kalau nanti mau validasi durasi juga, itu butuh tambahan `php-ffmpeg` + binary ffmpeg, di luar scope ini.)

Tambahkan ke `messages()`:

```php
'company_profile_video.mimes' => 'Video profil harus berformat MP4, MOV, atau WebM.',
'company_profile_video.max'   => 'Ukuran video profil maksimal 50MB.',
```

### 1.4 Controller — `app/Http/Controllers/BrandsController.php`

Di `store()`, dalam array `Brands::create([...])`, tambahkan setelah baris `"cover_image" => ...`:

```php
"company_profile_video" => $request->company_profile_video ? $request->file('company_profile_video')->store('brands/videos', 'public') : null,
```

Di `update()`, dalam array `$brand->update([...])`, tambahkan setelah baris `"cover_image" => ...`:

```php
"company_profile_video" => $request->company_profile_video ? $request->file('company_profile_video')->store('brands/videos', 'public') : $brand->company_profile_video,
```

Di `show()`, tambahkan key baru setelah `'coverImageUrl'`:

```php
'companyProfileVideoUrl' => $brand->company_profile_video ? asset('storage/' . $brand->company_profile_video) : null,
```

### 1.5 TS types — `resources/js/types/index.d.ts`

Di `interface Brand`, tambahkan setelah `cover_image: string;`:

```ts
company_profile_video: string | null;
```

### 1.6 Frontend — Form admin/vendor: `resources/js/pages/brands/create.tsx`

Tambahkan field baru setelah blok `cover_image` (sebelum tombol submit):

```tsx
<div className="grid gap-2 md:col-span-1">
    <Label htmlFor="company_profile_video">Video Profil Perusahaan</Label>
    <Input
        id="company_profile_video"
        type="file"
        name="company_profile_video"
        accept="video/mp4,video/quicktime,video/webm"
    />
    <p className="text-xs text-muted-foreground">MP4/MOV/WebM, maks 50MB. Diputar otomatis ke pengunjung saat pertama kali membuka halaman brand ini.</p>
    <InputError message={errors.company_profile_video} />
</div>
```

### 1.7 Frontend — `resources/js/pages/brands/edit.tsx`

Field yang sama, tapi dengan helper text seperti pola `logo`/`cover_image` di file ini:

```tsx
<div className="grid gap-2 md:col-span-1">
    <Label htmlFor="company_profile_video">Video Profil Perusahaan</Label>
    <Input
        id="company_profile_video"
        type="file"
        name="company_profile_video"
        accept="video/mp4,video/quicktime,video/webm"
    />
    <p className="text-sm text-gray-500">Leave empty to keep current video</p>
    <InputError message={errors.company_profile_video} />
</div>
```

### 1.8 Frontend — `resources/js/pages/brands/show.tsx`

Tambahkan ke `Props`:

```tsx
companyProfileVideoUrl?: string | null;
```

Destructure di parameter komponen (sejajar dengan `logoUrl, coverImageUrl,`).

Tambahkan Card baru setelah grid `{/* Images Section */}` (Logo + Cover Image), sebelum `{/* Basic Information */}`:

```tsx
{/* Company Profile Video */}
<Card>
    <CardHeader>
        <CardTitle className="text-lg">Video Profil Perusahaan</CardTitle>
    </CardHeader>
    <CardContent className="flex min-h-[200px] items-center justify-center rounded-md bg-gray-50 p-4">
        {companyProfileVideoUrl ? (
            <video src={companyProfileVideoUrl} controls className="max-h-[300px] w-full rounded" />
        ) : (
            <div className="text-center text-gray-400">
                <p className="text-sm">Belum ada video profil</p>
            </div>
        )}
    </CardContent>
</Card>
```

### 1.9 Frontend — halaman publik `resources/js/pages/landing/brand-detail.tsx`

**a) Import `X` icon** — tambahkan ke import lucide-react yang sudah ada:
```tsx
import { ArrowLeft, BadgeCheck, CalendarPlus, Globe, ImageOff, Instagram, MapPin, MessageCircle, Send, Star, X } from 'lucide-react';
```

**b) Komponen modal baru** — taruh setelah fungsi `trackWhatsapp`, sebelum interface `PortfolioWithImage`:

```tsx
function CompanyProfileVideoModal({ brandId, videoPath }: { brandId: number; videoPath: string }) {
    const [visible, setVisible] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(5);
    const canClose = secondsLeft <= 0;

    useEffect(() => {
        const storageKey = `eventura_video_watched_${brandId}`;
        if (localStorage.getItem(storageKey)) return;
        setVisible(true);
    }, [brandId]);

    useEffect(() => {
        if (!visible) return;
        setSecondsLeft(5);
        const interval = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(interval);
    }, [visible]);

    useEffect(() => {
        if (!visible || canClose) return;
        function blockEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') e.preventDefault();
        }
        document.addEventListener('keydown', blockEscape);
        return () => document.removeEventListener('keydown', blockEscape);
    }, [visible, canClose]);

    function handleClose() {
        if (!canClose) return;
        localStorage.setItem(`eventura_video_watched_${brandId}`, '1');
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="relative w-full max-w-3xl">
                <video
                    src={`/storage/${videoPath}`}
                    autoPlay
                    muted
                    playsInline
                    controls={canClose}
                    onEnded={() => setSecondsLeft(0)}
                    className="w-full max-h-[80vh] rounded-lg"
                />
                <button
                    onClick={handleClose}
                    disabled={!canClose}
                    aria-label="Tutup"
                    className={`absolute -top-11 right-0 md:top-3 md:right-3 h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        canClose
                            ? 'bg-white text-lp-on-surface hover:bg-lp-surface-container-low cursor-pointer'
                            : 'bg-white/30 text-white cursor-not-allowed'
                    }`}
                >
                    {canClose ? <X className="h-5 w-5" /> : secondsLeft}
                </button>
            </div>
        </div>
    );
}
```

**c) Tambahkan `useEffect` ke import react** yang sudah ada:
```tsx
import { FormEvent, useEffect, useRef, useState } from 'react';
```

**d) Render modal** — di dalam `BrandDetailPage`, sebagai child `<LandingLayout>`, tepat setelah `<Head title={brand.name} />` (posisi DOM tidak terlalu penting karena modal `fixed`, tapi taruh di situ biar rapi):
```tsx
{brand.company_profile_video && (
    <CompanyProfileVideoModal brandId={brand.id} videoPath={brand.company_profile_video} />
)}
```

**e) Video permanen di halaman** — di dalam kolom "About" (`md:col-span-8`), sisipkan blok baru setelah blok deskripsi (`<h2>Tentang Brand</h2>...`) dan sebelum blok `{brand.address && (...)}`:

```tsx
{brand.company_profile_video && (
    <div>
        <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface mb-3">Video Profil</h2>
        <video
            src={`/storage/${brand.company_profile_video}`}
            controls
            poster={brand.cover_image ? `/storage/${brand.cover_image}` : undefined}
            className="w-full max-h-[400px] rounded-xl bg-black"
        />
    </div>
)}
```

**Kenapa taruh di sini, bukan section terpisah full-width:** hero cover pakai trik `translate-y-1/2` buat logo yang overlap, dan "Info section" punya `pt-24 md:pt-28` buat kompensasi itu. Naruh video di dalam kolom About (bukan section baru di antara hero dan info section) menghindari harus mengutak-atik padding compensation itu.

### Acceptance criteria Task 1
- [ ] Vendor bisa upload video saat create/edit brand, tersimpan di `storage/app/public/brands/videos/`
- [ ] Video lama tidak hilang kalau field dikosongkan saat edit
- [ ] Pertama kali buka `/brand/{slug}`, modal muncul autoplay+muted, tombol close disabled 5 detik (angka countdown kelihatan), backdrop-click & ESC tidak menutup selama itu
- [ ] Reload/buka lagi halaman yang sama → modal **tidak** muncul lagi (localStorage)
- [ ] Video yang sama tetap bisa diputar ulang dari section "Video Profil" di body halaman
- [ ] Brand tanpa video: tidak ada modal, tidak ada section "Video Profil", tidak ada error

---

## Task 2 — Upload Video Portfolio

**Keputusan:** kolom langsung di `brand_portfolios` (bukan tabel anak seperti foto, karena 1 portfolio = 1 video). Video ini **tambahan**, foto tetap ada terpisah seperti sekarang. Limit ukuran diserahkan ke saya: saya pakai 30MB (lebih kecil dari video profil brand karena ini idealnya klip highlight singkat, juga dipakai untuk preview hover di Task 3).

### 2.1 Migration

Buat file baru `database/migrations/2026_07_01_000002_add_video_to_brand_portfolios_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brand_portfolios', function (Blueprint $table) {
            $table->string('video')->nullable()->after('event_date');
        });
    }

    public function down(): void
    {
        Schema::table('brand_portfolios', function (Blueprint $table) {
            $table->dropColumn('video');
        });
    }
};
```

### 2.2 Model — `app/Models/BrandPortfolios.php`

Tambahkan `'video'` ke `$fillable`.

### 2.3 FormRequest — `CreatePortfoliosRequest.php` dan `UpdatePortfoliosRequest.php`

Tambahkan ke `rules()`:
```php
'video' => 'nullable|file|mimes:mp4,mov,webm|max:30720',
```

Tambahkan `messages()` (belum ada method ini di kedua file — buat baru):
```php
public function messages(): array
{
    return [
        'video.mimes' => 'Video portfolio harus berformat MP4, MOV, atau WebM.',
        'video.max'   => 'Ukuran video portfolio maksimal 30MB.',
    ];
}
```

### 2.4 Controller — `app/Http/Controllers/BrandPortfoliosController.php`

`store()` — sekarang cuma `BrandPortfolios::create($request->validated())`. Ubah jadi:

```php
public function store(CreatePortfoliosRequest $request)
{
    $currentUser = $this->getCurrentUser();

    if (!$currentUser->hasRole('admin') && $currentUser->brand && $request->brand_id != $currentUser->brand->id) {
        return redirect()->route('brand-portfolios.index')->with('success', 'gak boleh nakal yah.');
    }

    $validated = $request->validated();
    $validated['video'] = $request->hasFile('video')
        ? $request->file('video')->store('brand-portfolios/videos', 'public')
        : null;

    BrandPortfolios::create($validated);

    return redirect()->route('brand-portfolios.index')->with('success', 'Brand Portfolio created successfully.');
}
```

`update()` — ubah jadi:

```php
public function update(UpdatePortfoliosRequest $request, string $id)
{
    $currentUser = $this->getCurrentUser();
    $brandPortfolio = BrandPortfolios::findOrFail($id);

    if (!$currentUser->hasRole('admin') && $currentUser->brand && $request->brand_id != $currentUser->brand->id) {
        return redirect()->route('brand-portfolios.show', $id)->with('success', 'gak boleh nakal yah.');
    }

    $validated = $request->validated();
    $validated['video'] = $request->hasFile('video')
        ? $request->file('video')->store('brand-portfolios/videos', 'public')
        : $brandPortfolio->video;

    $brandPortfolio->update($validated);

    return redirect()->route('brand-portfolios.index')->with('success', 'Brand Portfolio updated successfully.');
}
```

### 2.5 TS types — `resources/js/types/index.d.ts`

Di `interface BrandPortfolio`, tambahkan setelah `event_date: string;`:
```ts
video: string | null;
```

### 2.6 Frontend — `resources/js/pages/brands-portfolios/create.tsx`

Tambahkan setelah blok `deskripsi`, sebelum tombol submit:

```tsx
<div className="grid gap-2 md:col-span-2">
    <Label htmlFor="video">Video Portfolio (opsional)</Label>
    <Input
        id="video"
        type="file"
        name="video"
        accept="video/mp4,video/quicktime,video/webm"
    />
    <p className="text-xs text-muted-foreground">MP4/MOV/WebM, maks 30MB. Foto tetap diunggah terpisah setelah portfolio dibuat.</p>
    <InputError message={errors.video} />
</div>
```

### 2.7 Frontend — `resources/js/pages/brands-portfolios/edit.tsx`

Field yang sama + helper text "Leave empty to keep current video", ditaruh setelah blok `deskripsi`, sebelum tombol submit.

### 2.8 Frontend — `resources/js/pages/brands-portfolios/show.tsx`

Import tambahan: `Video as VideoIcon` dari `lucide-react`.

Tambahkan Card baru setelah `{/* Description */}` Card, sebelum `{/* Portfolio Images Section */}` Card:

```tsx
{/* Video Section */}
<Card>
    <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <VideoIcon className="w-5 h-5" />
            Video Portfolio
        </CardTitle>
    </CardHeader>
    <CardContent>
        {brandPortfolio.video ? (
            <video src={`/storage/${brandPortfolio.video}`} controls className="w-full max-h-[400px] rounded-lg bg-black" />
        ) : (
            <p className="text-gray-500 text-sm">Belum ada video. Tambahkan lewat halaman Edit.</p>
        )}
    </CardContent>
</Card>
```

### 2.9 Frontend publik — `resources/js/pages/landing/portfolio-detail.tsx`

Sisipkan setelah blok Description, sebelum komentar `{/* Adaptive gallery */}`:

```tsx
{portfolio.video && (
    <div className="mb-10">
        <video
            src={`/storage/${portfolio.video}`}
            controls
            className="w-full max-h-[500px] rounded-xl bg-black"
        />
    </div>
)}
```

### Acceptance criteria Task 2
- [ ] Vendor bisa upload video saat create/edit portfolio, tersimpan di `storage/app/public/brand-portfolios/videos/`
- [ ] Foto portfolio tetap berfungsi normal seperti sebelumnya (tidak kepengaruh)
- [ ] Video lama tidak hilang kalau field dikosongkan saat edit
- [ ] Halaman detail portfolio publik (`/brand/{slug}/portfolio/{id}`) menampilkan video (kalau ada) di atas galeri foto
- [ ] Portfolio tanpa video: tampilan sama seperti sebelum patch ini, tidak ada error

---

## Task 3 — Autoplay Hover di Card Portfolio (shared component)

**Temuan:** ada 2 implementasi kartu portfolio yang mirip — `PortfolioCard` di `landing/portfolio.tsx` dan `PortfolioThumb` di `landing/brand-detail.tsx`. Kyn sudah setuju di-extract jadi 1 shared component. Poster/thumbnail statis pakai foto pertama portfolio (`images[0]`) — tidak perlu upload thumbnail terpisah.

**Dependensi:** butuh `BrandPortfolio.video` dari Task 2 sudah ada di TS types. Kerjakan setelah Task 2.

### 3.1 Komponen baru — `resources/js/components/landing/portfolio-thumbnail.tsx`

```tsx
import { type BrandPortfolio } from '@/types';
import { useRef, useState, type ReactNode } from 'react';

export function PortfolioThumbnail({
    portfolio,
    className,
    fallback,
    children,
}: {
    portfolio: BrandPortfolio;
    className?: string;
    fallback?: ReactNode;
    children?: ReactNode;
}) {
    const [hovering, setHovering] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const thumb = portfolio.images?.[0];

    function handleEnter() {
        setHovering(true);
        videoRef.current?.play().catch(() => {});
    }

    function handleLeave() {
        setHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }

    return (
        <div
            className={`relative overflow-hidden bg-lp-surface-container ${className ?? ''}`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {thumb ? (
                <img
                    src={`/storage/${thumb.image}`}
                    alt={portfolio.title}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${hovering && portfolio.video ? 'opacity-0' : 'opacity-100'}`}
                />
            ) : (
                fallback ?? (
                    <div className="w-full h-full flex items-center justify-center text-lp-on-surface-variant text-sm">
                        Tidak ada foto
                    </div>
                )
            )}
            {portfolio.video && (
                <video
                    ref={videoRef}
                    src={`/storage/${portfolio.video}`}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
            {children}
        </div>
    );
}
```

Catatan: di mobile tidak ada event hover sama sekali, jadi otomatis fallback ke poster statis tanpa kode tambahan — tidak perlu penanganan khusus (ini bagian dari alasan kenapa mobile deep-dive bisa nunggu).

### 3.2 Pakai di `resources/js/pages/landing/portfolio.tsx`

Import: `import { PortfolioThumbnail } from '@/components/landing/portfolio-thumbnail';`

Ganti blok thumbnail di dalam `PortfolioCard`:

Dari:
```tsx
<div className="relative h-52 overflow-hidden bg-lp-surface-container">
    {thumb ? (
        <img
            src={`/storage/${thumb.image}`}
            alt={portfolio.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
    ) : (
        <BrandInitials name={portfolio.brand.name} className="w-full h-full text-4xl" />
    )}

    {/* Event type badge */}
    <div className="absolute top-3 left-3 bg-lp-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-lp-on-surface">
        {portfolio.event_type}
    </div>
</div>
```

Jadi:
```tsx
<PortfolioThumbnail
    portfolio={portfolio}
    className="h-52"
    fallback={<BrandInitials name={portfolio.brand.name} className="w-full h-full text-4xl" />}
>
    <div className="absolute top-3 left-3 bg-lp-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-lp-on-surface">
        {portfolio.event_type}
    </div>
</PortfolioThumbnail>
```

Variabel `const thumb = portfolio.images?.[0];` di dalam `PortfolioCard` jadi tidak terpakai lagi di sini — boleh dihapus (dicek dulu tidak dipakai di tempat lain dalam fungsi yang sama).

### 3.3 Pakai di `resources/js/pages/landing/brand-detail.tsx`

Import tambahan: `import { PortfolioThumbnail } from '@/components/landing/portfolio-thumbnail';`

Ganti isi `PortfolioThumb`:

Dari:
```tsx
function PortfolioThumb({ portfolio, brandSlug }: { portfolio: PortfolioWithImage; brandSlug: string }) {
    const thumb = portfolio.images?.[0];

    return (
        <Link href={`/brand/${brandSlug}/portfolio/${portfolio.id}`} className="group block">
            <div className="relative w-full h-52 rounded-xl overflow-hidden mb-3 bg-lp-surface-container">
                {thumb ? (
                    <img
                        src={`/storage/${thumb.image}`}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lp-on-surface-variant text-sm">
                        Tidak ada foto
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-lp-surface/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-lp-on-surface">
                    {portfolio.event_type}
                </div>
            </div>
            <h4 className="font-playfair font-semibold text-lp-on-surface group-hover:text-lp-primary transition-colors text-base leading-snug mb-1">
                {portfolio.title}
            </h4>
            <p className="text-lp-on-surface-variant text-xs">
                {new Date(portfolio.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </Link>
    );
}
```

Jadi:
```tsx
function PortfolioThumb({ portfolio, brandSlug }: { portfolio: PortfolioWithImage; brandSlug: string }) {
    return (
        <Link href={`/brand/${brandSlug}/portfolio/${portfolio.id}`} className="group block">
            <PortfolioThumbnail portfolio={portfolio} className="w-full h-52 rounded-xl mb-3">
                <div className="absolute top-3 left-3 bg-lp-surface/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-lp-on-surface">
                    {portfolio.event_type}
                </div>
            </PortfolioThumbnail>
            <h4 className="font-playfair font-semibold text-lp-on-surface group-hover:text-lp-primary transition-colors text-base leading-snug mb-1">
                {portfolio.title}
            </h4>
            <p className="text-lp-on-surface-variant text-xs">
                {new Date(portfolio.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </Link>
    );
}
```

(fallback tidak di-pass di sini — sengaja, biar sama seperti sebelumnya yang cuma teks "Tidak ada foto", bukan inisial brand yang sudah kelihatan di halaman ini)

### Acceptance criteria Task 3
- [ ] Di `/portfolio` (grid) dan di halaman brand detail, portfolio yang punya video: hover → poster fade ke video yang autoplay+loop+muted; mouse keluar → balik ke poster, video pause & reset ke awal
- [ ] Portfolio tanpa video: perilaku sama seperti sebelumnya (cuma foto statis, ada hover zoom kecil)
- [ ] Fallback saat tidak ada foto sama sekali tetap sesuai konteks masing-masing (inisial brand di grid `/portfolio`, teks "Tidak ada foto" di halaman brand detail)
- [ ] Badge event type tetap muncul di posisi yang sama di kedua tempat

---

## Task 4 — Konsistensi Kategori CC & Catering (semua titik)

**Temuan:** backend (`CreateBrandRequest`, `UpdateBrandRequest`, filter `LandingController`) sudah terima 4 kategori, tapi UI di 4 tempat cuma sediakan EO/WO. Kyn minta semua titik dibereskan sekaligus.

### 4.1 Backend — `app/Http/Requests/VendorApplicationRequest/StoreVendorApplicationRequest.php`

Ubah:
```php
'category.*'     => ['in:EO,WO'],
```
Jadi:
```php
'category.*'     => ['in:EO,WO,CC,Catering'],
```

### 4.2 Frontend — `resources/js/pages/landing/join.tsx`

Ubah:
```tsx
const VENDOR_TYPES = [
    { value: 'EO', label: 'Event Organizer', desc: 'Menangani berbagai jenis acara (konser, seminar, pameran, dll.)' },
    { value: 'WO', label: 'Wedding Organizer', desc: 'Spesialis pernikahan dan acara terkait' },
];
```
Jadi:
```tsx
const VENDOR_TYPES = [
    { value: 'EO', label: 'Event Organizer', desc: 'Menangani berbagai jenis acara (konser, seminar, pameran, dll.)' },
    { value: 'WO', label: 'Wedding Organizer', desc: 'Spesialis pernikahan dan acara terkait' },
    { value: 'CC', label: 'Content Creator', desc: 'Dokumentasi foto, video, dan konten kreatif untuk acara' },
    { value: 'Catering', label: 'Catering', desc: 'Penyedia layanan konsumsi dan katering acara' },
];
```
Grid yang menampilkan (`grid-cols-1 sm:grid-cols-2`) tidak perlu diubah — otomatis jadi 2x2 dengan 4 item.

### 4.3 Frontend — `resources/js/pages/brands/create.tsx`

Ubah wrapper dari `className="flex items-center space-x-4"` jadi `className="flex items-center flex-wrap gap-4"` (supaya 4 checkbox tidak overflow di panel admin yang sempit), lalu tambahkan 2 checkbox setelah WO:

```tsx
<div className="flex items-center space-x-2">
    <Checkbox id="category_cc" name="category[]" value="CC" />
    <Label htmlFor="category_cc" className="font-normal cursor-pointer">CC</Label>
</div>
<div className="flex items-center space-x-2">
    <Checkbox id="category_catering" name="category[]" value="Catering" />
    <Label htmlFor="category_catering" className="font-normal cursor-pointer">Catering</Label>
</div>
```

### 4.4 Frontend — `resources/js/pages/brands/edit.tsx`

Sama seperti 4.3, wrapper jadi `flex items-center flex-wrap gap-4`, tambahkan:

```tsx
<div className="flex items-center space-x-2">
    <Checkbox
        id="category_cc"
        name="category[]"
        value="CC"
        defaultChecked={Array.isArray(brand.category) && brand.category.includes('CC')}
    />
    <Label htmlFor="category_cc" className="font-normal cursor-pointer">CC</Label>
</div>
<div className="flex items-center space-x-2">
    <Checkbox
        id="category_catering"
        name="category[]"
        value="Catering"
        defaultChecked={Array.isArray(brand.category) && brand.category.includes('Catering')}
    />
    <Label htmlFor="category_catering" className="font-normal cursor-pointer">Catering</Label>
</div>
```

### 4.5 Frontend — `resources/js/pages/welcome.tsx`

Ubah:
```tsx
const CATEGORIES = [
    { value: '', label: 'Semua' },
    { value: 'EO', label: 'Event Organizer' },
    { value: 'WO', label: 'Wedding Organizer' },
];
```
Jadi:
```tsx
const CATEGORIES = [
    { value: '', label: 'Semua' },
    { value: 'EO', label: 'Event Organizer' },
    { value: 'WO', label: 'Wedding Organizer' },
    { value: 'CC', label: 'Content Creator' },
    { value: 'Catering', label: 'Catering' },
];
```

Efek samping langsung yang perlu dibenerin sekalian (bukan bagian dari mobile deep-dive — ini regresi kecil yang langsung disebabkan tambahan 2 tombol ini): baris tab kategori sekarang 5 tombol dan bakal kepepet di layar sempit karena tiap tombol dipaksa `flex-1` sama lebar. Ubah:

```tsx
<div className="flex bg-lp-surface-container rounded-lg p-1 gap-1">
```
Jadi:
```tsx
<div className="flex bg-lp-surface-container rounded-lg p-1 gap-1 overflow-x-auto">
```
Dan ubah className tombol dari:
```tsx
className={`flex-1 md:flex-none px-4 py-2 rounded text-sm font-semibold transition-colors ${
```
Jadi:
```tsx
className={`flex-shrink-0 px-4 py-2 rounded text-sm font-semibold transition-colors ${
```
(Ini scroll horizontal sederhana, pola yang sama seperti sudah dipakai di `compare.tsx`. Bukan pembahasan mobile yang lebih besar dari poin 6 — cuma memastikan perubahan Task 4 ini sendiri tidak keliatan rusak.)

### 4.6 TS types — `resources/js/types/index.d.ts`

Ubah:
```ts
category: ('EO' | 'WO')[];
```
Jadi:
```ts
category: ('EO' | 'WO' | 'CC' | 'Catering')[];
```

### Acceptance criteria Task 4
- [ ] Form aplikasi vendor (`/join`) punya 4 pilihan tipe vendor
- [ ] Admin bisa create/edit brand dengan kategori CC dan/atau Catering, tersimpan dan tampil benar
- [ ] Homepage (`/`) tab kategori punya 5 tombol (Semua/EO/WO/CC/Catering), filter berfungsi untuk keduanya yang baru
- [ ] Tab kategori tidak overflow/rusak di viewport sempit (scroll horizontal jika perlu)
- [ ] `npm run build` / typecheck tidak error karena `Brand.category` type

---

## Task 5 — Hapus Field Kota di Filter + Bersihkan Dead Code

**Temuan:** field "Kota" sudah tidak fungsional (query `address LIKE %city%` tidak akan match karena `address` sekarang berisi Maps embed URL, bukan teks alamat). Logic yang sama ke-duplikasi di method `explore()` yang sudah dead code (route `/explore` redirect ke `/`, tidak pernah manggil controller ini; dan dia render ke `landing/explore` yang filenya sudah tidak ada). Kyn sudah setuju hapus dead code dan sesuaikan placeholder search.

### 5.1 Backend — `app/Http/Controllers/LandingController.php`

Di method `home()`, hapus blok ini:
```php
if ($request->filled('city')) {
    $query->where('address', 'like', '%' . $request->city . '%');
}
```

Di baris yang sama masih dalam `home()`, ubah:
```php
$hasFilters = $request->hasAny(['search', 'category', 'city', 'verified', 'min_price', 'max_price', 'min_rating']);
```
Jadi:
```php
$hasFilters = $request->hasAny(['search', 'category', 'verified', 'min_price', 'max_price', 'min_rating']);
```

Dan ubah:
```php
'filters'        => (object) $request->only(['search', 'category', 'city', 'verified', 'min_price', 'max_price', 'min_rating', 'sort']),
```
Jadi:
```php
'filters'        => (object) $request->only(['search', 'category', 'verified', 'min_price', 'max_price', 'min_rating', 'sort']),
```

**Hapus seluruh method `explore(Request $request)`** (dead code, dari `public function explore(Request $request)` sampai `}` penutupnya, tepat sebelum `public function brandDetail`).

### 5.2 Frontend — `resources/js/pages/welcome.tsx`

Hapus `city?: string;` dari `interface Filters`.

Hapus baris `const [city, setCity] = useState(f.city ?? '');`.

Di `applyFilter`, hapus `if (city) params.city = city;` dan hapus `city` dari dependency array `useCallback` (`[search, category, city, verified, minPrice, maxPrice, minRating, sort]` → tanpa `city`).

Di `handleFilter`, hapus baris `city: setCity,` dari object `setters`.

Di perhitungan `activeFilterCount`, hapus `city` dari array: `[category, city, verified, minPrice, maxPrice, minRating]` → `[category, verified, minPrice, maxPrice, minRating]`.

Hapus seluruh blok `<div>` "Kota" di panel filter lanjutan:
```tsx
<div>
    <label className="block text-xs text-lp-on-surface-variant mb-1">Kota</label>
    <input
        value={city}
        onChange={e => setCity(e.target.value)}
        onBlur={() => applyFilter({ city })}
        placeholder="Jakarta, Bali, dll."
        className="rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lp-primary/10"
    />
</div>
```

Sesuaikan placeholder search utama dari:
```tsx
placeholder="Cari nama brand atau kota..."
```
Jadi:
```tsx
placeholder="Cari nama brand..."
```

### Acceptance criteria Task 5
- [ ] Panel filter lanjutan di `/` tidak ada lagi field "Kota"
- [ ] Filter search/kategori/harga/rating/verified lain tetap berfungsi normal
- [ ] `LandingController::explore()` sudah tidak ada, route `/explore` tetap jalan (karena route sudah redirect, tidak pernah panggil method ini)
- [ ] Tidak ada reference `city` yang tersisa di `welcome.tsx` (cek dengan grep sebelum selesai)
- [ ] Placeholder search box tidak lagi menyebut "kota"

---

## Setelah semua task selesai

1. `php artisan migrate` (kalau belum dijalankan di tengah proses)
2. `npm run build` — pastikan tidak ada TypeScript error, terutama dari perubahan `types/index.d.ts`
3. Grep sanity check: `grep -rn "city" resources/js/pages/welcome.tsx app/Http/Controllers/LandingController.php` harus kosong (kecuali kalau ada match tak terduga yang perlu ditinjau)
4. Manual QA jalan tiap acceptance criteria di atas satu-satu
5. Cek `storage/app/public` sudah symlink aktif (`php artisan storage:link`) supaya video baru bisa diakses via `/storage/...` — kemungkinan besar sudah ada dari sebelumnya (logo/cover_image sudah pakai jalur yang sama), tapi worth dicek sekali kalau video 404.

## Di luar scope (sengaja tidak dikerjakan di sini)

- **Mobile deep-dive** (dulu poin 6 di diskusi) — Kyn minta ini dikerjakan setelah Task 1–5 di atas selesai dan direview. Termasuk di dalamnya nanti: card WhatsApp CTA yang ketumpuk di bawah pada mobile di `brand-detail.tsx`, kemungkinan pakai komponen `Sheet` yang sudah ada untuk filter panel, dan audit sistematis halaman publik lainnya.
- Validasi durasi video secara hard di server (butuh ffmpeg, belum terpasang) — saat ini cuma dibatasi ukuran file.
- Kompresi/transcoding otomatis video yang diupload — file disimpan apa adanya di disk lokal.
