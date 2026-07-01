# Eventura — Patch Todo v5 (Mobile)

Konteks: lanjutan pembahasan poin 6 (mobile deep-dive) yang sengaja ditunda dari `eventura-patch-todo-v4.md`. Ini hasil audit langsung ke 7 halaman publik + layout nav/footer, dilakukan setelah v4 selesai didiskusikan. **Dokumen ini mengasumsikan v4 sudah dieksekusi Claude Code sepenuhnya** — khususnya Task 5 v4 (field "Kota" sudah hilang dari `welcome.tsx`). Kalau v4 belum selesai, jalankan v4 dulu.

Semua 5 item di bawah independen satu sama lain (boleh dikerjakan dalam urutan berapa saja), kecuali Task 4 dan Task 5 sama-sama menyentuh `welcome.tsx` jadi lebih efisien dikerjakan berurutan dalam satu pass baca file.

---

## Task 1 — Sticky Bar WhatsApp di Mobile (Brand Detail)

**Keputusan Kyn:** sticky bar permanen di bawah layar, mobile only. Card "Hubungi Kami" yang sudah ada **tetap di posisi sekarang** (tidak dipindah) — bar ini tambahan akses cepat, bukan pengganti. Card lama masih perlu karena juga punya link Instagram/Website, bukan cuma WhatsApp.

### 1.1 — `resources/js/pages/landing/brand-detail.tsx`

Tambahkan komponen baru setelah `PortfolioThumb`, sebelum `export default function BrandDetailPage`:

```tsx
function MobileWhatsAppBar({ brand }: { brand: BrandWithRelations }) {
    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-lp-surface border-t border-lp-outline-variant shadow-[0_-4px_20px_rgba(18,67,65,0.12)] p-3">
            <a
                href={whatsappUrl(brand.whatsapp_number, `Halo, saya tertarik dengan brand ${brand.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsapp(brand.slug)}
                className="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
                <MessageCircle className="h-4 w-4" />
                Chat via WhatsApp
            </a>
        </div>
    );
}
```

Render di `BrandDetailPage`, tepat setelah `</section>` penutup Testimonials dan sebelum `</LandingLayout>`:

```tsx
{hasWhatsApp && <MobileWhatsAppBar brand={brand} />}
</LandingLayout>
```

Beri ruang di bagian bawah halaman biar konten terakhir (Testimonials) nggak ketutup bar. Ubah className section Testimonials:

Dari:
```tsx
<section className="bg-lp-surface-container-low py-14">
```
Jadi:
```tsx
<section className="bg-lp-surface-container-low pt-14 pb-24 md:py-14">
```

(`pb-24` cuma efektif di mobile karena `md:py-14` override di desktop — desktop nggak butuh ruang ekstra karena bar-nya `md:hidden`.)

`hasWhatsApp` sudah ada sebagai variabel di `BrandDetailPage`, tidak perlu dideklarasikan ulang.

### Acceptance criteria Task 1
- [ ] Di mobile (`<768px`), bar WhatsApp muncul fixed di bawah layar sepanjang scroll, di semua section halaman brand detail
- [ ] Di desktop (`≥768px`), bar tidak muncul sama sekali
- [ ] Card "Hubungi Kami" yang lama tetap ada di posisi semula, tidak berubah
- [ ] Konten section Testimonials tidak ketutup bar saat discroll sampai paling bawah
- [ ] Brand tanpa nomor WhatsApp: bar tidak muncul, tidak ada elemen kosong

---

## Task 2 — Kurangi Tinggi Hero di Layar Kecil (Brand Detail)

**Temuan:** `h-[400px]` di mobile makan lebih dari separuh viewport HP standar sebelum ketemu konten apapun.

### 2.1 — `resources/js/pages/landing/brand-detail.tsx`

Cari section Hero cover:
```tsx
<section className="relative w-full h-[400px] md:h-[480px] bg-lp-surface-container">
```
Ubah jadi:
```tsx
<section className="relative w-full h-[260px] sm:h-[360px] md:h-[480px] bg-lp-surface-container">
```

Tidak ada penyesuaian lain yang diperlukan — logo overlap pakai `translate-y-1/2` yang relatif ke tinggi logo itu sendiri (`w-28 h-28 md:w-36 md:h-36`), bukan ke tinggi hero, jadi tetap align dengan benar di ukuran berapa pun heronya. Padding kompensasi di Info section (`pt-24 md:pt-28`) juga tidak perlu diubah karena itu ngompensasi logo yang overlap, bukan tinggi hero.

### Acceptance criteria Task 2
- [ ] Di layar sekitar 375–390px lebar (HP standar), hero terlihat proporsional, tidak makan >50% viewport tinggi sebelum konten
- [ ] Logo dan nama brand tetap overlap dengan benar di bagian bawah hero, di semua breakpoint
- [ ] Desktop tidak berubah sama sekali (`md:h-[480px]` tetap)

---

## Task 3 — Galeri Foto Portfolio Detail Turun ke 1 Kolom di HP Kecil

**Temuan:** kasus 2-foto sudah benar turun ke 1 kolom di layar kecil (`grid-cols-1 sm:grid-cols-2`), tapi kasus 3+ foto tetap `grid-cols-2` bahkan di layar terkecil.

### 3.1 — `resources/js/pages/landing/portfolio-detail.tsx`

Cari:
```tsx
className={`grid gap-4 md:gap-6 ${
    portfolio.images.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-2 lg:grid-cols-3'
}`}
```
Ubah jadi:
```tsx
className={`grid gap-4 md:gap-6 ${
    portfolio.images.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}`}
```

(pola yang sama persis kayak kasus 2-foto, cuma nambah step `lg:grid-cols-3` di ujungnya buat 3+ foto)

### Acceptance criteria Task 3
- [ ] Portfolio dengan 3+ foto: di layar <640px tampil 1 kolom, di 640–1024px tampil 2 kolom, di ≥1024px tampil 3 kolom
- [ ] Portfolio dengan 1 atau 2 foto: tidak berubah dari sebelumnya

---

## Task 4 — Panel Filter Jadi Bottom Sheet di Mobile (Homepage)

**Temuan:** panel filter lanjutan sekarang expand inline dan dorong konten ke bawah. Project sudah punya komponen `Sheet` (`resources/js/components/ui/sheet.tsx`, berbasis Radix Dialog, support `side="bottom"`) yang belum dipakai di mana pun — dan ada `useIsMobile()` hook (`resources/js/hooks/use-mobile.tsx`, breakpoint 768px, sama persis dengan breakpoint `md:` Tailwind) yang juga belum dipakai di halaman ini.

**Pendekatan:** field filter yang sama dipakai di dua tempat (inline panel desktop, Sheet mobile) — di-extract jadi 1 sub-component `FilterFields` biar nggak dobel nulis. Trigger tombol "Filter" yang sudah ada tetap sama, cuma target-nya beda (buka Sheet vs reveal panel inline) tergantung `isMobile`.

**Prasyarat:** field "Kota" sudah dihapus (Task 5 di v4). Kalau belum, field itu ikut di-extract ke `FilterFields` juga tapi sebaiknya selesaikan v4 dulu.

### 4.1 — `resources/js/pages/welcome.tsx`

Tambahkan import:
```tsx
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
```

Tambahkan komponen baru setelah `CompareBar`, sebelum `export default function Welcome`:

```tsx
function FilterFields({
    minPrice, setMinPrice, maxPrice, setMaxPrice, minRating, verified,
    applyFilter, handleFilter,
}: {
    minPrice: string;
    setMinPrice: (v: string) => void;
    maxPrice: string;
    setMaxPrice: (v: string) => void;
    minRating: string;
    verified: string;
    applyFilter: (overrides: Partial<Record<string, string | number>>) => void;
    handleFilter: (key: string, value: string) => void;
}) {
    return (
        <>
            <div>
                <label className="block text-xs text-lp-on-surface-variant mb-1">Harga Mulai</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    onBlur={() => applyFilter({ min_price: minPrice })}
                    placeholder="0"
                    className="w-32 rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lp-primary/10"
                />
            </div>
            <div>
                <label className="block text-xs text-lp-on-surface-variant mb-1">Harga Maks</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    onBlur={() => applyFilter({ max_price: maxPrice })}
                    placeholder="999999999"
                    className="w-32 rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lp-primary/10"
                />
            </div>
            <div>
                <label className="block text-xs text-lp-on-surface-variant mb-1">Min Rating</label>
                <select
                    value={minRating}
                    onChange={e => handleFilter('min_rating', e.target.value)}
                    className="rounded-lg border border-lp-outline-variant px-3 py-1.5 text-sm focus:outline-none"
                >
                    {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>
            <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
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

Di dalam `Welcome`, tambahkan setelah deklarasi state lain (dekat `const [showFilters, setShowFilters] = useState(false);`):
```tsx
const isMobile = useIsMobile();
```

Ganti seluruh blok `{/* Expanded advanced filters */}`:

Dari:
```tsx
{/* Expanded advanced filters */}
{showFilters && (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 pb-4 flex flex-wrap gap-4">
        <div>
            <label className="block text-xs text-lp-on-surface-variant mb-1">Harga Mulai</label>
            <input ... />
        </div>
        ... (Harga Maks, Min Rating, Verified)
    </div>
)}
```

Jadi:
```tsx
{/* Expanded advanced filters */}
{isMobile ? (
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
                <FilterFields
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    minRating={minRating} verified={verified}
                    applyFilter={applyFilter} handleFilter={handleFilter}
                />
                <button
                    onClick={() => setShowFilters(false)}
                    className="bg-lp-primary text-lp-on-primary py-3 rounded-lg text-sm font-semibold mt-2"
                >
                    Terapkan Filter
                </button>
            </div>
        </SheetContent>
    </Sheet>
) : (
    showFilters && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 pb-4 flex flex-wrap gap-4">
            <FilterFields
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                minRating={minRating} verified={verified}
                applyFilter={applyFilter} handleFilter={handleFilter}
            />
        </div>
    )
)}
```

Catatan: filter tetap apply secara live lewat `onBlur`/`onChange` yang sama seperti sekarang (behavior tidak berubah) — tombol "Terapkan Filter" di Sheet cuma menutup sheet-nya, bukan trigger baru buat apply.

### Acceptance criteria Task 4
- [ ] Di mobile, tap "Filter" membuka bottom sheet berisi Harga Mulai/Maks, Min Rating, Verified — bukan panel inline yang mendorong konten
- [ ] Filter tetap ter-apply saat field diisi/diubah, sama seperti sebelumnya
- [ ] Tap "Terapkan Filter" atau area di luar sheet menutup sheet
- [ ] Di desktop, perilaku sama sekali tidak berubah — masih panel inline seperti sebelumnya
- [ ] Badge jumlah filter aktif di tombol "Filter" tetap akurat di kedua mode

---

## Task 5 — Perbesar Tap Target Tombol Compare (Homepage)

**Temuan:** tombol toggle compare di pojok kiri atas card brand cuma ±26px tap area (`p-1.5` + icon `h-3.5 w-3.5`), di bawah rekomendasi minimum ±44px.

### 5.1 — `resources/js/pages/welcome.tsx`

Cari:
```tsx
<button
    onClick={() => toggleCompare(brand)}
    className={`absolute top-3 left-3 z-10 rounded-full p-1.5 shadow transition-colors ${compareList.find(b => b.id === brand.id) ? 'bg-lp-primary text-lp-on-primary' : 'bg-white/90 text-lp-on-surface-variant hover:bg-lp-primary hover:text-lp-on-primary'}`}
    title="Bandingkan"
>
    <GitCompare className="h-3.5 w-3.5" />
</button>
```
Ubah jadi:
```tsx
<button
    onClick={() => toggleCompare(brand)}
    className={`absolute top-2 left-2 z-10 w-11 h-11 flex items-center justify-center rounded-full shadow transition-colors ${compareList.find(b => b.id === brand.id) ? 'bg-lp-primary text-lp-on-primary' : 'bg-white/90 text-lp-on-surface-variant hover:bg-lp-primary hover:text-lp-on-primary'}`}
    title="Bandingkan"
>
    <GitCompare className="h-4 w-4" />
</button>
```

(`w-11 h-11` = 44×44px persis, `top-2 left-2` disesuaikan biar tetap pas di pojok dengan tap area yang lebih besar)

### Acceptance criteria Task 5
- [ ] Tombol compare berukuran 44×44px, mudah di-tap di HP
- [ ] Posisi visual tetap di pojok kiri atas card, tidak mengganggu elemen lain (favorite button di pojok kanan atas, nama brand di bawahnya)
- [ ] Fungsi toggle compare tidak berubah

---

## Setelah semua task selesai

1. `npm run build` — pastikan tidak ada TypeScript error (terutama import `Sheet`/`useIsMobile` yang baru)
2. Test manual di viewport HP asli atau devtools responsive mode (375px dan 390px minimal) untuk kelima task
3. Test juga di viewport desktop biasa untuk pastikan tidak ada regresi (terutama Task 1 dan Task 4 yang punya percabangan mobile/desktop)
4. Cek acceptance criteria satu-satu

## Di luar scope

- Item minor yang sempat disebut tapi tidak masuk ke sini: tombol pagination (`w-10 h-10` = 40px) di `welcome.tsx` dan `portfolio.tsx` sedikit di bawah 44px rekomendasi — dianggap cukup minor untuk dilewat, bisa direvisit kalau ada laporan masalah nyata.
- Halaman lain yang sudah dicek dan dianggap tidak perlu perubahan: `landing-layout.tsx` (nav), `compare.tsx`, `portfolio.tsx` (filter pills), `kontak.tsx`, `tentang-kami.tsx`, `join.tsx`.
- Audit ini terbatas ke halaman publik saja, belum menyentuh halaman dashboard/admin (`/brands`, `/brand-portfolios`, dll.) — di luar kekhawatiran awal Kyn soal "user yang masuk ke website" (customer-facing).
