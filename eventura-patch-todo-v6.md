# Eventura — Patch Todo v6 (UI/UX Publik: Desktop + Mobile)

Konteks: hasil audit UX menyeluruh pasca-v5 terhadap semua halaman publik, dilakukan langsung pada kode di commit `c4db2a1` ("update: optimize mobile ui"). **Dokumen ini mengasumsikan v4 & v5 sudah ter-merge** (nomor baris & snippet di bawah diambil dari state itu).

**Keputusan produk yang sudah difinalkan Kyn (JANGAN diubah di patch ini):**
- Modal video profil (autoplay, lock 5 detik) **tetap sama di semua device**, termasuk mobile. Tidak ada task untuk modal ini.
- **Tidak ada migrasi/kolom baru** untuk lokasi. Info lokasi di kartu dikembalikan lewat parsing label tempat dari embed URL yang sudah ada (Task 6) — best-effort, tanpa perubahan skema.

Urutan eksekusi: Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Task 1, 2, 4, 5, 9 semuanya menyentuh `welcome.tsx` — kerjakan berurutan sesuai nomor supaya anchor diff tidak bergeser. Setelah tiap task yang menyentuh file .tsx, pastikan tidak ada import yang jadi tidak terpakai.

---

## Task 1 — Kompaksi Sticky Filter Bar di Mobile (welcome.tsx)

**Temuan (akar masalah utama "mobile masih terasa sempit"):** seluruh baris filter `sticky top-20`, dan di mobile ia bertumpuk 4 baris (tab kategori + search + sort + tombol Filter) ≈ 200px+. Ditambah nav 80px, total ±280px permanen menempel di atas selama scroll — di viewport HP ~700px, konten hanya kebagian separuh layar.

**Solusi:** di mobile, bar dipadatkan jadi **1 baris** (search + tombol Filter). Tab kategori & sort pindah ke dalam bottom Sheet yang sudah ada. Desktop tidak berubah sama sekali.

### 1.1 — Container bar jadi satu baris

Ubah:
```tsx
<div className="max-w-[1280px] mx-auto px-4 md:px-12 py-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
```
Jadi:
```tsx
<div className="max-w-[1280px] mx-auto px-4 md:px-12 py-3 flex gap-3 items-center">
```
(Di desktop hasil akhirnya identik dengan sebelumnya; di mobile, elemen yang tersisa — search + tombol Filter — otomatis sebaris.)

### 1.2 — Sembunyikan tab kategori di mobile

Ubah:
```tsx
<div className="flex bg-lp-surface-container rounded-lg p-1 gap-1 overflow-x-auto">
```
Jadi:
```tsx
<div className="hidden md:flex bg-lp-surface-container rounded-lg p-1 gap-1 overflow-x-auto">
```

### 1.3 — Sembunyikan select Sort di mobile

Pada select Sort (yang `value={sort}` + `onChange={e => handleFilter('sort', e.target.value)}`), ubah awal className dari:
```tsx
className="bg-lp-surface-container-lowest border ..."
```
Jadi:
```tsx
className="hidden md:block bg-lp-surface-container-lowest border ..."
```
(sisanya tetap sama persis)

### 1.4 — FilterFields: tambah prop `variant`

Ganti **seluruh** komponen `FilterFields` (dari `function FilterFields({` sampai `}` penutupnya) dengan versi ini:

```tsx
function FilterFields({
    minPrice, setMinPrice, maxPrice, setMaxPrice, minRating, verified,
    applyFilter, handleFilter, variant = 'inline',
}: {
    minPrice: string;
    setMinPrice: (v: string) => void;
    maxPrice: string;
    setMaxPrice: (v: string) => void;
    minRating: string;
    verified: string;
    applyFilter: (overrides: Partial<Record<string, string | number>>) => void;
    handleFilter: (key: string, value: string) => void;
    variant?: 'inline' | 'sheet';
}) {
    const sheet = variant === 'sheet';
    const inputClass = sheet
        ? 'w-full rounded-lg border border-lp-outline-variant px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lp-primary/10'
        : 'w-32 rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lp-primary/10';
    const selectClass = sheet
        ? 'w-full rounded-lg border border-lp-outline-variant px-3 py-2.5 text-sm focus:outline-none'
        : 'rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none';

    return (
        <>
            <div className={sheet ? 'grid grid-cols-2 gap-3' : 'contents'}>
                <div>
                    <label className="block text-xs text-lp-on-surface-variant mb-1">Harga Mulai</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        onBlur={() => applyFilter({ min_price: minPrice })}
                        placeholder="0"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs text-lp-on-surface-variant mb-1">Harga Maks</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        onBlur={() => applyFilter({ max_price: maxPrice })}
                        placeholder="999999999"
                        className={inputClass}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs text-lp-on-surface-variant mb-1">Min Rating</label>
                <select
                    value={minRating}
                    onChange={e => handleFilter('min_rating', e.target.value)}
                    className={selectClass}
                >
                    {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>
            <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                        type="checkbox"
                        checked={verified === '1'}
                        onChange={e => handleFilter('verified', e.target.checked ? '1' : '')}
                        className="rounded"
                    />
                    <BadgeCheck className="h-4 w-4 text-lp-primary" />
                    <span className="text-sm text-lp-on-surface">Terverifikasi saja</span>
                </label>
            </div>
        </>
    );
}
```

Catatan: `contents` membuat wrapper harga transparan di mode inline, sehingga kedua field harga tetap berpartisipasi langsung di `flex flex-wrap gap-4` desktop persis seperti sebelumnya. Di mode sheet, wrapper yang sama jadi grid 2 kolom.

### 1.5 — Isi Sheet: Kategori + Urutkan + FilterFields varian sheet

Ganti **seluruh** blok `<Sheet ...>...</Sheet>` (cabang `isMobile ?`) dengan:

```tsx
<Sheet open={showFilters} onOpenChange={setShowFilters}>
    <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
            <div>
                <p className="text-xs text-lp-on-surface-variant mb-2 font-medium">Kategori</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleFilter('category', cat.value)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                category === cat.value
                                    ? 'bg-lp-primary text-lp-on-primary'
                                    : 'bg-lp-surface-container text-lp-on-surface-variant'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-xs text-lp-on-surface-variant mb-1">Urutkan</label>
                <select
                    value={sort}
                    onChange={e => handleFilter('sort', e.target.value)}
                    className="w-full rounded-lg border border-lp-outline-variant px-3 py-2.5 text-sm focus:outline-none"
                >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>
            <FilterFields
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                minRating={minRating} verified={verified}
                applyFilter={applyFilter} handleFilter={handleFilter}
                variant="sheet"
            />
            <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="bg-lp-primary text-lp-on-primary py-3 rounded-lg text-sm font-semibold mt-2 active:opacity-90"
            >
                Terapkan Filter
            </button>
        </div>
    </SheetContent>
</Sheet>
```

Cabang desktop (`showFilters && (...)`) tidak diubah — panggilan `FilterFields` di sana otomatis pakai `variant` default `'inline'`.

### 1.6 — Judul header responsif

Ubah:
```tsx
<h1 className="font-playfair text-4xl font-bold text-lp-primary">Temukan Vendor Acara Terbaik di Palembang</h1>
```
Jadi:
```tsx
<h1 className="font-playfair text-3xl md:text-4xl font-bold text-lp-primary">Temukan Vendor Acara Terbaik di Palembang</h1>
```

### Acceptance criteria Task 1
- [ ] Di mobile (<768px), bar sticky hanya 1 baris: search + tombol Filter (± 64px, bukan ±200px)
- [ ] Tap tombol Filter membuka sheet berisi (urut): Kategori (chips scroll horizontal), Urutkan, Harga Mulai/Maks berdampingan full-width, Min Rating full-width, Terverifikasi, tombol Terapkan
- [ ] Semua filter di sheet langsung ter-apply saat diubah (perilaku live-apply tidak berubah); Terapkan hanya menutup sheet
- [ ] Badge angka pada tombol Filter tetap akurat (kategori sudah terhitung di `activeFilterCount` sejak sebelumnya)
- [ ] Di desktop (≥768px), tampilan & perilaku 100% identik dengan sebelum patch

---

## Task 2 — `preserveScroll` pada Aksi Filter

**Temuan:** setiap perubahan filter memicu `router.get` tanpa `preserveScroll`, sehingga halaman melompat ke atas — sangat mengganggu saat mengetik search (debounce 500ms) atau menyetel harga.

### 2.1 — `resources/js/pages/welcome.tsx`
Ubah:
```tsx
router.get('/', params, { preserveState: true, only: ['brands', 'filters'] });
```
Jadi:
```tsx
router.get('/', params, { preserveState: true, preserveScroll: true, only: ['brands', 'filters'] });
```

### 2.2 — `resources/js/pages/landing/portfolio.tsx`
Ubah:
```tsx
router.get('/portfolio', params, { preserveState: true, only: ['portfolios', 'filters'] });
```
Jadi:
```tsx
router.get('/portfolio', params, { preserveState: true, preserveScroll: true, only: ['portfolios', 'filters'] });
```

### Acceptance criteria Task 2
- [ ] Mengetik di search / mengubah filter / ganti kategori tidak lagi melempar scroll ke atas halaman
- [ ] Pindah halaman lewat pagination tetap berfungsi (pagination memanggil applyFilter yang sama — scroll dipertahankan; ini dapat diterima karena tombol pagination ada di bawah)

---

## Task 3 — Disiplin Pemuatan Media (lazy loading, prioritas, preload)

**Temuan:** hampir tidak ada `loading="lazy"` di frontend publik (hanya 3 pemakaian di seluruh repo, bukan di listing). Semua cover kartu, thumbnail portfolio, dan galeri dimuat serentak. Video inline belum diberi `preload`, dan video di portfolio-detail tampil kotak hitam karena tanpa poster.

### 3.1 — `resources/js/components/landing/brand-card.tsx` (cover kartu)
Ubah:
```tsx
<img
    src={`/storage/${brand.cover_image}`}
    alt={brand.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
```
Jadi:
```tsx
<img
    src={`/storage/${brand.cover_image}`}
    alt={brand.name}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
```

### 3.2 — `brand-card.tsx` (logo kecil di `BrandLogo`)
Ubah:
```tsx
return <img src={`/storage/${brand.logo}`} alt={brand.name} className={`object-cover ${className ?? ''}`} />;
```
Jadi:
```tsx
return <img src={`/storage/${brand.logo}`} alt={brand.name} loading="lazy" decoding="async" className={`object-cover ${className ?? ''}`} />;
```

### 3.3 — `resources/js/components/landing/portfolio-thumbnail.tsx` (poster thumbnail)
Pada `<img>` poster, tambahkan `loading="lazy" decoding="async"` (video di komponen ini sudah `preload="none"`, biarkan).

### 3.4 — `resources/js/pages/landing/portfolio-detail.tsx` (galeri)
Setiap `<img>` galeri di cabang layout **2-foto** dan **grid 3+** diberi `loading="lazy" decoding="async"`. Markup img-nya identik di tiap cabang:
```tsx
<img
    src={`/storage/${image.image}`}
    alt={portfolio.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
```
**Kecuali** cabang **1-foto (hero tunggal)** — biarkan eager (itu elemen visual utama halaman, jangan di-lazy).

### 3.5 — `portfolio-detail.tsx` (video portfolio: poster + preload)
Ubah:
```tsx
<video
    src={`/storage/${portfolio.video}`}
    controls
    className="w-full max-h-[500px] rounded-xl bg-black"
/>
```
Jadi:
```tsx
<video
    src={`/storage/${portfolio.video}`}
    controls
    preload="none"
    poster={portfolio.images[0] ? `/storage/${portfolio.images[0].image}` : undefined}
    className="w-full max-h-[500px] rounded-xl bg-black"
/>
```

### 3.6 — `resources/js/pages/landing/brand-detail.tsx` (video profil inline)
Ubah:
```tsx
<video
    src={`/storage/${brand.company_profile_video}`}
    controls
    poster={brand.cover_image ? `/storage/${brand.cover_image}` : undefined}
    className="w-full max-h-[400px] rounded-xl bg-black"
/>
```
Jadi (tambah 1 baris `preload="none"`):
```tsx
<video
    src={`/storage/${brand.company_profile_video}`}
    controls
    preload="none"
    poster={brand.cover_image ? `/storage/${brand.cover_image}` : undefined}
    className="w-full max-h-[400px] rounded-xl bg-black"
/>
```
**Jangan sentuh** `CompanyProfileVideoModal` — keputusan produk: modal tetap autoplay di semua device.

### 3.7 — `brand-detail.tsx` (hero = LCP, prioritaskan, JANGAN lazy)
Ubah:
```tsx
<img src={`/storage/${brand.cover_image}`} alt={brand.name} className="w-full h-full object-cover" />
```
Jadi:
```tsx
<img src={`/storage/${brand.cover_image}`} alt={brand.name} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
```
(React 19 memakai camelCase `fetchPriority`.)

### Acceptance criteria Task 3
- [ ] Buka homepage dengan Network tab: gambar kartu di bawah lipatan baru dimuat saat mendekati viewport
- [ ] Halaman portfolio-detail: video menampilkan foto pertama sebagai poster, file video tidak terunduh sebelum tombol play ditekan
- [ ] Brand-detail: hero tetap muncul cepat (tidak lazy); video inline tidak mengunduh apa pun sebelum diputar
- [ ] Modal video profil (first-visit) perilakunya tidak berubah sedikit pun

---

## Task 4 — Tap Target Konsisten + Feedback Sentuh + aria-label

**Temuan:** tombol favorit di kartu ±28px padahal tombol compare di sebelahnya sudah 44px; hamburger nav ±36px; tombol/link di CompareBar kecil; dan tidak ada `active:` state — tap di HP terasa "mati".

### 4.1 — `brand-card.tsx`: FavoriteButton 44px + aria-label
Ubah:
```tsx
<button
    onClick={toggle}
    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow hover:scale-110 transition-transform"
    title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
>
    <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-lp-on-surface-variant'}`} />
</button>
```
Jadi:
```tsx
<button
    onClick={toggle}
    className="absolute top-2 right-2 z-10 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 active:scale-95 transition-transform"
    title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    aria-pressed={isFavorited}
>
    <Heart className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-lp-on-surface-variant'}`} />
</button>
```
(`top-2 right-2` menyelaraskan dengan tombol compare yang `top-2 left-2`.)

### 4.2 — `brand-card.tsx`: feedback sentuh pada kartu
Pada `<article ...>` di `BrandCard`, tambahkan `active:scale-[0.99]` ke dalam className yang sudah ada (di mana saja dalam string, misal setelah `duration-300`).

### 4.3 — `welcome.tsx`: aria pada tombol compare kartu
Pada tombol compare (yang `title="Bandingkan"`), tambahkan atribut:
```tsx
aria-label="Bandingkan brand ini"
aria-pressed={!!compareList.find(b => b.id === brand.id)}
```

### 4.4 — `welcome.tsx`: CompareBar lebih ramah jempol
Dalam `CompareBar`:
- Tombol hapus chip: ubah `className="text-lp-on-surface-variant hover:text-lp-primary"` → `className="p-1.5 -m-1.5 text-lp-on-surface-variant hover:text-lp-primary"` dan tambah `aria-label={`Hapus ${b.name} dari perbandingan`}`
- Tombol "Bersihkan": ubah `className="text-xs text-lp-on-surface-variant hover:text-lp-primary"` → `className="text-xs text-lp-on-surface-variant hover:text-lp-primary py-2 px-2"`
- Link "Bandingkan →": ubah `className="bg-lp-primary text-lp-on-primary px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90"` → `className="bg-lp-primary text-lp-on-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-transform"`

### 4.5 — `landing/portfolio.tsx`: feedback sentuh kartu portfolio
Pada `<article ...>` di `PortfolioCard`, tambahkan `active:scale-[0.99]` ke className yang ada.

### 4.6 — `brand-detail.tsx`: feedback sentuh sticky WhatsApp bar
Pada `<a ...>` di `MobileWhatsAppBar`, tambahkan `active:scale-[0.98]` ke className yang ada.

### 4.7 — `landing-layout.tsx`: hamburger 44px
Ubah:
```tsx
<button
    className="md:hidden p-2 text-lp-on-surface rounded-lg hover:bg-lp-surface-container-low transition-colors"
    onClick={() => setOpen(!open)}
    aria-label="Menu"
>
```
Jadi:
```tsx
<button
    className="md:hidden w-11 h-11 flex items-center justify-center text-lp-on-surface rounded-lg hover:bg-lp-surface-container-low active:bg-lp-surface-container transition-colors"
    onClick={() => setOpen(!open)}
    aria-label="Menu"
    aria-expanded={open}
>
```

### Acceptance criteria Task 4
- [ ] Tombol favorit & compare di kartu sama-sama 44×44px, sejajar rapi kiri-kanan atas kartu
- [ ] Semua kartu & tombol utama memberi feedback visual saat ditekan (sedikit mengecil)
- [ ] Screen reader membacakan label untuk tombol ikon (favorit, compare, hapus chip, hamburger)
- [ ] Fungsi tidak berubah — hanya ukuran hit area, feedback, dan atribut aksesibilitas

---

## Task 5 — Komponen Pagination Bersama yang Responsif

**Temuan:** blok pagination diduplikasi identik di `welcome.tsx` dan `portfolio.tsx`; tombol 40px (di bawah 44px), dan di layar 375px deretan nomor bisa melebihi lebar (7 nomor × 40px + panah + gap > 375px). Di mobile, nomor halaman diganti indikator ringkas.

### 5.1 — Komponen baru `resources/js/components/landing/pagination.tsx`

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildPages(current: number, total: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== '...') pages.push('...');
    }
    return pages;
}

export function Pagination({
    currentPage,
    lastPage,
    onPage,
}: {
    currentPage: number;
    lastPage: number;
    onPage: (page: number) => void;
}) {
    if (lastPage <= 1) return null;

    const navBtn =
        'w-11 h-11 flex items-center justify-center rounded-lg border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container active:bg-lp-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                disabled={currentPage === 1}
                onClick={() => onPage(currentPage - 1)}
                aria-label="Halaman sebelumnya"
                className={navBtn}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Mobile: indikator ringkas */}
            <span className="sm:hidden text-sm font-semibold text-lp-on-surface px-2">
                Hal {currentPage} / {lastPage}
            </span>

            {/* Desktop/tablet: nomor halaman */}
            <div className="hidden sm:flex items-center gap-2">
                {buildPages(currentPage, lastPage).map((item, idx) =>
                    item === '...' ? (
                        <span key={`e-${idx}`} className="text-lp-on-surface-variant px-1 text-sm">...</span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPage(item as number)}
                            aria-current={currentPage === item ? 'page' : undefined}
                            className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                currentPage === item
                                    ? 'bg-lp-primary text-lp-on-primary'
                                    : 'border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container'
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}
            </div>

            <button
                disabled={currentPage === lastPage}
                onClick={() => onPage(currentPage + 1)}
                aria-label="Halaman berikutnya"
                className={navBtn}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
```

### 5.2 — `welcome.tsx`
- Import: `import { Pagination } from '@/components/landing/pagination';`
- **Hapus** fungsi lokal `buildPages()` di dalam `Welcome`.
- Ganti **seluruh** blok `{/* Pagination */} {brands.last_page > 1 && ( ... )}` dengan:
```tsx
<Pagination currentPage={brands.current_page} lastPage={brands.last_page} onPage={goToPage} />
```
- Setelahnya, `ChevronLeft`/`ChevronRight` kemungkinan tidak terpakai lagi di file ini — hapus dari import lucide-react jika memang tidak dipakai di tempat lain.

### 5.3 — `landing/portfolio.tsx`
- Import komponen yang sama.
- **Hapus** fungsi lokal `buildPages()`.
- Ganti seluruh blok pagination (`{portfolios.last_page > 1 && ( ... )}`) dengan:
```tsx
<Pagination
    currentPage={portfolios.current_page}
    lastPage={portfolios.last_page}
    onPage={(p) => applyFilter(eventType, p)}
/>
```
(Catatan: di file ini tidak ada `goToPage`; tombol lama memanggil `applyFilter(eventType, n)` — pertahankan pola itu lewat arrow di atas.)
- Bersihkan import `ChevronLeft`/`ChevronRight` jika jadi tak terpakai.

### Acceptance criteria Task 5
- [ ] Di layar <640px: pagination = panah kiri + "Hal X / Y" + panah kanan, tidak pernah overflow
- [ ] Di ≥640px: nomor halaman tampil seperti sebelumnya, tapi 44×44px
- [ ] Navigasi halaman berfungsi di kedua halaman (welcome & portfolio), termasuk saat filter aktif
- [ ] Tidak ada duplikasi `buildPages` tersisa di kedua page

---

## Task 6 — Label Lokasi dari Embed URL (tanpa migrasi)

**Keputusan Kyn:** platform khusus Palembang, kolom `city` ditolak sebagai out-of-scope; solusi terbaik = parsing. Embed URL Google Maps umumnya memuat nama tempat ter-encode pada segmen `!2s...` di parameter `pb`. Kita ekstrak itu sebagai label lokasi. **Best-effort**: jika vendor meng-embed pin koordinat polos, label tidak ditemukan → tampilan fallback sama seperti sekarang (tanpa baris lokasi). Tidak ada perubahan backend/DB/form.

### 6.1 — `resources/js/lib/utils.ts`
Tambahkan setelah `isMapsEmbed`:

```ts
/**
 * Ekstrak label tempat (nama/alamat singkat) dari Google Maps embed URL.
 * Best-effort: mengembalikan null bila URL hanya berisi pin koordinat.
 */
export const extractMapsPlaceLabel = (embedUrl?: string | null): string | null => {
    if (!embedUrl || !isMapsEmbed(embedUrl)) return null;
    const matches = [...embedUrl.matchAll(/!2s([^!]+)/g)].map((m) => m[1]);
    // Segmen !2s paling akhir biasanya kode negara (mis. "id"); label tempat ada sebelumnya.
    for (const raw of matches.reverse()) {
        try {
            const decoded = decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
            if (!decoded) continue;
            if (/^0x[0-9a-f]/i.test(decoded)) continue; // place-id heksadesimal
            if (/^[-\d.,\s°]+$/.test(decoded)) continue; // koordinat murni
            if (/^[a-z]{2}$/i.test(decoded)) continue; // kode bahasa/negara
            return decoded;
        } catch {
            continue;
        }
    }
    return null;
};
```

### 6.2 — `brand-card.tsx`
- Tambahkan `extractMapsPlaceLabel` ke import dari `@/lib/utils` (di baris import `isMapsEmbed` yang sudah ada).
- Di awal body `BrandCard` (sebelum `return`), tambahkan:
```tsx
const locationLabel = brand.address
    ? (isMapsEmbed(brand.address) ? extractMapsPlaceLabel(brand.address) : brand.address)
    : null;
```
- Ganti blok:
```tsx
{brand.address && !isMapsEmbed(brand.address) && (
    <p className="text-lp-on-surface-variant text-sm flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{brand.address}</span>
    </p>
)}
```
Jadi:
```tsx
{locationLabel && (
    <p className="text-lp-on-surface-variant text-sm flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{locationLabel}</span>
    </p>
)}
```

### 6.3 — `brand-detail.tsx` (kartu "Lokasi" di kolom About)
- Import `extractMapsPlaceLabel` (file ini sudah mengimpor `isMapsEmbed` dari `@/lib/utils`).
- Di dalam `BrandDetailPage`, dekat deklarasi `hasWhatsApp`, tambahkan:
```tsx
const locationLabel = brand.address
    ? (isMapsEmbed(brand.address) ? extractMapsPlaceLabel(brand.address) : brand.address)
    : null;
```
- Ubah bagian dalam kartu Lokasi dari:
```tsx
{!isMapsEmbed(brand.address) && (
    <p className="text-lp-on-surface-variant text-sm">{brand.address}</p>
)}
```
Jadi:
```tsx
{locationLabel && (
    <p className="text-lp-on-surface-variant text-sm">{locationLabel}</p>
)}
```
(Efeknya: saat address berupa embed URL yang mengandung nama tempat, sekarang muncul teks lokasi di atas iframe — sebelumnya kartu Lokasi hanya berisi header + peta.)

### Acceptance criteria Task 6
- [ ] Brand dengan embed URL yang memuat nama tempat: kartu (home/portfolio-detail mini card tidak berubah — hanya BrandCard) dan halaman detail menampilkan teks lokasi hasil parse
- [ ] Brand dengan embed pin koordinat murni: tidak ada teks lokasi, tidak ada error, tampilan = seperti sebelum patch
- [ ] Tidak ada perubahan backend, form, atau DB
- [ ] Cek 2–3 embed URL nyata di data seeder/dev untuk memastikan hasil parse masuk akal (bukan `0x...`, bukan koordinat, bukan "id")

---

## Task 7 — Indikator Halaman Aktif di Nav (desktop + mobile menu)

**Temuan:** semua link nav memakai class statis; tidak ada penanda halaman yang sedang dibuka.

### 7.1 — `landing-layout.tsx`: komponen `NavItem`

Tambahkan di atas `function LandingNav()`:

```tsx
function NavItem({
    href,
    children,
    variant = 'desktop',
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    variant?: 'desktop' | 'mobile';
    onClick?: () => void;
}) {
    const { url } = usePage();
    const path = url.split('?')[0];
    const active = href === '/' ? path === '/' : path.startsWith(href);

    const className =
        variant === 'desktop'
            ? `text-sm font-semibold tracking-wide transition-colors ${
                  active ? 'text-lp-primary' : 'text-lp-on-surface-variant hover:text-lp-primary'
              }`
            : `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                      ? 'bg-lp-surface-container-low text-lp-primary'
                      : 'text-lp-on-surface hover:bg-lp-surface-container-low'
              }`;

    return (
        <Link href={href} aria-current={active ? 'page' : undefined} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
```

### 7.2 — Link desktop
Ganti kelima link di blok `hidden md:flex items-center gap-6`:
```tsx
<Link href="/" className={navLinkClass}>Beranda</Link>
<Link href="/portfolio" className={navLinkClass}>Portfolio</Link>
{(!auth?.user || isUser) && (
    <Link href="/join" className={navLinkClass}>Daftarkan Brand</Link>
)}
<Link href="/tentang-kami" className={navLinkClass}>Tentang Kami</Link>
<Link href="/kontak" className={navLinkClass}>Kontak</Link>
```
Jadi:
```tsx
<NavItem href="/">Beranda</NavItem>
<NavItem href="/portfolio">Portfolio</NavItem>
{(!auth?.user || isUser) && <NavItem href="/join">Daftarkan Brand</NavItem>}
<NavItem href="/tentang-kami">Tentang Kami</NavItem>
<NavItem href="/kontak">Kontak</NavItem>
```
Setelah itu variabel `navLinkClass` tidak terpakai — hapus deklarasinya.

### 7.3 — Link menu mobile (section "Menu")
Ganti:
```tsx
<Link href="/" className={mobileItemClass} onClick={() => setOpen(false)}>Beranda</Link>
<Link href="/portfolio" className={mobileItemClass} onClick={() => setOpen(false)}>Portfolio</Link>
{(!auth?.user || isUser) && (
    <Link href="/join" className={mobileItemClass} onClick={() => setOpen(false)}>Daftarkan Brand</Link>
)}
<Link href="/tentang-kami" className={mobileItemClass} onClick={() => setOpen(false)}>Tentang Kami</Link>
<Link href="/kontak" className={mobileItemClass} onClick={() => setOpen(false)}>Kontak</Link>
```
Jadi:
```tsx
<NavItem href="/" variant="mobile" onClick={() => setOpen(false)}>Beranda</NavItem>
<NavItem href="/portfolio" variant="mobile" onClick={() => setOpen(false)}>Portfolio</NavItem>
{(!auth?.user || isUser) && (
    <NavItem href="/join" variant="mobile" onClick={() => setOpen(false)}>Daftarkan Brand</NavItem>
)}
<NavItem href="/tentang-kami" variant="mobile" onClick={() => setOpen(false)}>Tentang Kami</NavItem>
<NavItem href="/kontak" variant="mobile" onClick={() => setOpen(false)}>Kontak</NavItem>
```
`mobileItemClass` **tetap dipertahankan** — masih dipakai oleh item-item ber-ikon di bawahnya (Favorit, Dashboard, dst.). Jangan hapus.

### Acceptance criteria Task 7
- [ ] Halaman aktif ter-highlight di nav desktop (teks primary) dan di menu mobile (background + teks primary)
- [ ] `/portfolio/...` (detail) tetap meng-highlight "Portfolio" (prefix match)
- [ ] Link lain (login/daftar, dropdown akun, item ber-ikon) tidak berubah

---

## Task 8 — Footer: Copy 4 Kategori

**Temuan:** footer masih menyebut hanya EO & WO, tidak konsisten dengan penambahan CC & Catering di v4.

### 8.1 — `landing-layout.tsx`, deskripsi footer
Ubah:
```tsx
Platform terpercaya untuk menemukan Event Organizer dan Wedding Organizer profesional di
Palembang dan sekitarnya. Wujudkan acara impian Anda dengan mudah.
```
Jadi:
```tsx
Platform terpercaya untuk menemukan Event Organizer, Wedding Organizer, Content Creator,
dan Catering profesional di Palembang. Wujudkan acara impian Anda dengan mudah.
```

### 8.2 — Baris copyright
Ubah:
```tsx
© {new Date().getFullYear()} {name}. Platform Marketplace EO & WO Palembang.
```
Jadi:
```tsx
© {new Date().getFullYear()} {name}. Platform Marketplace Vendor Acara Palembang.
```

### Acceptance criteria Task 8
- [ ] Footer menyebut keempat kategori / istilah netral "Vendor Acara", tidak lagi hanya EO & WO

---

## Task 9 — Tombol Reset pada Empty State

**Temuan:** saat hasil filter kosong, user hanya diberi teks "Coba ubah kata kunci atau filter" tanpa aksi satu-tap — di mobile ini berarti buka sheet lagi dan menghapus filter satu-satu.

### 9.1 — `welcome.tsx`
Ubah:
```tsx
<div className="text-center py-24 text-lp-on-surface-variant flex flex-col items-center gap-4">
    <Search className="h-12 w-12 opacity-25" />
    <p className="text-lg font-medium">Tidak ada brand yang ditemukan.</p>
    <p className="text-sm">Coba ubah kata kunci atau filter.</p>
</div>
```
Jadi:
```tsx
<div className="text-center py-24 text-lp-on-surface-variant flex flex-col items-center gap-4">
    <Search className="h-12 w-12 opacity-25" />
    <p className="text-lg font-medium">Tidak ada brand yang ditemukan.</p>
    <p className="text-sm">Coba ubah kata kunci atau filter.</p>
    {hasActiveFilters && (
        <button
            onClick={() => router.get('/')}
            className="mt-2 bg-lp-primary text-lp-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
            Reset semua filter
        </button>
    )}
</div>
```
(`router.get('/')` tanpa `preserveState` me-reset seluruh state filter lokal sekaligus URL. `hasActiveFilters` sudah ada di komponen.)

### 9.2 — `landing/portfolio.tsx`
Di blok empty state (yang berisi `<p className="text-lg font-medium">Belum ada portfolio yang tersedia.</p>`), tambahkan setelah paragraf terakhir di blok itu:
```tsx
{eventType && (
    <button
        onClick={() => handleEventType('')}
        className="mt-2 bg-lp-primary text-lp-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
    >
        Tampilkan semua
    </button>
)}
```
Sesuaikan container blok itu bila perlu (mis. tambah `flex flex-col items-center gap-3`) agar tombol berada di tengah — samakan gayanya dengan empty state welcome.

### Acceptance criteria Task 9
- [ ] Welcome: filter aktif + hasil kosong → tombol "Reset semua filter" muncul; satu tap mengembalikan listing penuh & mengosongkan semua field
- [ ] Welcome: hasil kosong murni tanpa filter (DB kosong) → tombol tidak muncul
- [ ] Portfolio: filter event_type aktif + kosong → tombol "Tampilkan semua" muncul dan berfungsi

---

## Setelah semua task selesai

1. `npm run types` lalu `npm run build` — nol error TypeScript baru (perhatikan import yang jadi tak terpakai: `ChevronLeft/ChevronRight` di dua page, `navLinkClass`)
2. QA di 3 viewport: 375px, 768px, 1280px — fokus: tinggi sticky bar mobile, isi sheet, pagination, nav active, sticky WhatsApp bar tidak bertabrakan dengan CompareBar (CompareBar hanya di welcome, WhatsApp bar hanya di brand-detail — tidak pernah bersamaan)
3. Uji parsing lokasi dengan beberapa embed URL nyata dari data yang ada
4. Grep sanity: `grep -n "navLinkClass" resources/js/layouts/landing-layout.tsx` harus kosong; `grep -rn "buildPages" resources/js/pages` hanya boleh nol hasil (fungsi sudah pindah ke komponen)

## Di luar scope (keputusan tercatat)

- **Modal video profil**: tetap autoplay + lock 5 detik di semua device — keputusan eksplisit Kyn (uji coba, bukan production). Jangan diubah walau menyentuh file yang sama.
- **Kolom `city`/migrasi lokasi**: ditolak (platform satu kota); digantikan Task 6 (parsing URL, best-effort).
- Halaman dashboard/admin (`/brands`, `/brand-portfolios`, dst.) — audit ini khusus halaman publik.
- Kompresi/transcoding video & validasi durasi — tetap di luar scope seperti v4.
