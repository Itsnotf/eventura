# Eventura — Patch Todo v7 (Halaman Bandingkan: Bug Lokasi + UX Mobile)

Konteks: hasil investigasi langsung terhadap `resources/js/pages/landing/compare.tsx` dan `LandingController::compare()`, dilakukan setelah v6 ter-merge. Dua masalah, satu bug konfirmasi (Task 1) dan satu keputusan desain yang sudah difinalkan Kyn: **satu brand per layar dengan swipe/tab, ringkasan harga tetap terlihat di atas** (Task 2).

**Revisi 1** (self-review sebelum eksekusi): (a) deteksi swipe kini mengabaikan gestur yang dominan vertikal — sebelumnya scroll miring di dalam kartu bisa tak sengaja memindah brand; (b) pergantian brand kini beranimasi geser via track `translateX`, bukan swap konten instan; kartu di-extract ke sub-komponen `CompareBrandCard`.

**Prinsip pembagian:** tabel desktop yang sudah ada **tidak dirombak** — hanya baris Lokasi-nya yang diperbaiki (bug, bukan preferensi desain), karena desktop tidak pernah dikeluhkan. Tampilan mobile jadi komponen swipeable terpisah total, bukan versi responsive dari tabel yang sama.

Urutan eksekusi: Task 1 dulu (Task 2 memakai helper baru dari Task 1).

---

## Task 1 — Perbaiki Link "Lihat Peta" yang Error

**Akar masalah:** `brand.address` berisi URL **embed** Google Maps (`.../maps/embed?pb=...`), format yang didesain untuk dipasang di `<iframe>`, bukan dibuka langsung sebagai halaman biasa — makanya error saat diklik. Pola yang benar sudah ada di `brand-detail.tsx` (dipakai lewat `<iframe src={brand.address}>`), tapi menaruh iframe di tiap sel tabel bandingkan kurang pas (sempit, berat ×3 brand). Solusinya: bangun URL Google Maps normal dari koordinat yang sudah terkandung di dalam embed URL itu sendiri.

### 1.1 — `resources/js/lib/utils.ts`

Tambahkan setelah `extractMapsPlaceLabel`:

```ts
/**
 * Bangun URL Google Maps yang bisa dibuka langsung di tab baru (bukan URL embed
 * untuk iframe), diambil dari koordinat yang terkandung di dalam embed URL.
 * Best-effort: null bila pola koordinat tak ditemukan.
 */
export const mapsViewUrl = (embedUrl?: string | null): string | null => {
    if (!embedUrl || !isMapsEmbed(embedUrl)) return null;
    const match = embedUrl.match(/!2d(-?[\d.]+)!3d(-?[\d.]+)/);
    if (!match) return null;
    const [, lng, lat] = match;
    return `https://www.google.com/maps?q=${lat},${lng}`;
};
```

(Verifikasi urutan: di embed URL, `!2d` = longitude dan `!3d` = latitude — dicek terhadap URL asli di `BrandSeeder.php`: `!2d104.741...!3d-2.985...` yang memang koordinat Palembang. URL hasil pakai format `q=lat,lng`.)

### 1.2 — `resources/js/pages/landing/compare.tsx`: perbaiki baris Lokasi di tabel desktop

Import tambahan pada baris `import { isMapsEmbed } from '@/lib/utils';`, ubah jadi:
```tsx
import { extractMapsPlaceLabel, isMapsEmbed, mapsViewUrl } from '@/lib/utils';
```

Ganti seluruh blok baris Lokasi:
```tsx
{/* Lokasi */}
<div className="grid border-b border-lp-outline-variant" style={gridStyle}>
    <div className={labelCell}>Lokasi</div>
    {brands.map(brand => (
        <div key={brand.id} className="p-4 border-l border-lp-outline-variant flex items-start gap-1.5 text-sm text-lp-on-surface-variant">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-lp-primary" />
            {isMapsEmbed(brand.address) ? (
                <a href={brand.address} target="_blank" rel="noopener noreferrer" className="text-lp-primary hover:underline text-xs">
                    Lihat peta
                </a>
            ) : (
                <span>{brand.address || '–'}</span>
            )}
        </div>
    ))}
</div>
```
Jadi:
```tsx
{/* Lokasi */}
<div className="grid border-b border-lp-outline-variant" style={gridStyle}>
    <div className={labelCell}>Lokasi</div>
    {brands.map(brand => {
        const locationLabel = brand.address
            ? (isMapsEmbed(brand.address) ? extractMapsPlaceLabel(brand.address) : brand.address)
            : null;
        const mapsLink = brand.address && isMapsEmbed(brand.address) ? mapsViewUrl(brand.address) : null;
        return (
            <div key={brand.id} className="p-4 border-l border-lp-outline-variant flex items-start gap-1.5 text-sm text-lp-on-surface-variant">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-lp-primary" />
                <div>
                    {locationLabel && <p className="text-xs">{locationLabel}</p>}
                    {mapsLink ? (
                        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-lp-primary hover:underline text-xs font-medium">
                            Lihat peta
                        </a>
                    ) : (
                        !locationLabel && <span>–</span>
                    )}
                </div>
            </div>
        );
    })}
</div>
```

Catatan: brand dengan `address` legacy (bukan embed URL) perilakunya tidak berubah — tetap tampil sebagai teks biasa.

### Acceptance criteria Task 1
- [ ] Klik "Lihat peta" di tabel desktop membuka Google Maps sungguhan di tab baru (bukan error), menunjuk ke lokasi yang benar
- [ ] Kalau ada label tempat yang berhasil di-parse (mis. "NAKA SIGNATURE"), teks itu muncul di atas link "Lihat peta"
- [ ] Brand dengan embed URL yang tidak mengandung pola koordinat: tidak ada link (bukan link rusak), tidak ada error
- [ ] Brand dengan address non-embed (legacy): tampilan sama seperti sebelumnya

---

## Task 2 — Tampilan Mobile: Satu Brand per Layar (Swipe/Tab) + Ringkasan Harga

**Keputusan Kyn:** bukan tabel yang dirapikan, bukan kartu per-metrik — tapi satu kartu brand penuh per layar, berpindah lewat tab atau swipe, dengan strip ringkasan harga yang tetap terlihat di atas (dobel fungsi sebagai tab selector).

**Insight tambahan yang diikutkan** (menjawab keluhan awal "tidak memberikan insight yang dibutuhkan"): badge "Termurah" di strip ringkasan, dan daftar paket aktual (bukan cuma angka jumlah) di kartu — data ini sudah di-fetch backend (`LandingController::compare()` sudah `with('packages', ...)` diurutkan featured lalu termurah) tapi sebelumnya tidak dipakai sama sekali di tampilan, cuma diambil `.length`-nya.

**Desktop tidak disentuh** — tabel yang sudah ada (setelah Task 1) tetap jadi tampilan desktop, disembunyikan di mobile lewat `hidden md:block`. Komponen baru ini murni tambahan, aktif hanya di mobile lewat `md:hidden`, tanpa perlu `useIsMobile()` — cukup CSS, sama seperti pola nav desktop/mobile yang sudah ada di `landing-layout.tsx`.

**Mekanika swipe (hasil revisi 1):**
- Semua kartu (maks 3) dirender berdampingan dalam **track** `flex` di dalam wrapper `overflow-hidden`, digeser via `translateX` dengan transisi CSS — pergantian brand terasa geser halus, baik lewat tap chip maupun swipe.
- Gestur hanya dihitung swipe bila **dominan horizontal** (`|deltaX| > |deltaY|`) dan melewati ambang 50px — scroll vertikal/miring di dalam kartu tidak akan memindah brand.
- Antar kartu diberi jarak `gap-3` (0.75rem); rumus translate memakai `calc()` yang memperhitungkan gap itu supaya posisi tiap kartu presisi.

### 2.1 — `resources/js/pages/landing/compare.tsx`: tambah import

Ubah:
```tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';
```
Jadi:
```tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';
import { useRef, useState, type TouchEvent } from 'react';
```

### 2.2 — Komponen baru `CompareBrandCard` + `MobileCompareView`

Tambahkan setelah fungsi `Stars`, sebelum `export default function ComparePage`:

```tsx
function CompareBrandCard({ brand }: { brand: BrandWithCompareStats }) {
    const locationLabel = brand.address
        ? (isMapsEmbed(brand.address) ? extractMapsPlaceLabel(brand.address) : brand.address)
        : null;
    const mapsLink = brand.address && isMapsEmbed(brand.address) ? mapsViewUrl(brand.address) : null;
    const topPackages = (brand.packages ?? []).slice(0, 3);
    const remainingPackages = (brand.packages?.length ?? 0) - topPackages.length;

    return (
        <div className="w-full flex-shrink-0 bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-5 space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-lp-outline-variant flex-shrink-0">
                    <BrandLogo brand={brand} className="w-full h-full text-sm" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h2 className="font-playfair font-semibold text-lg text-lp-on-surface truncate">{brand.name}</h2>
                        {brand.is_verified && <BadgeCheck className="h-4 w-4 text-lp-primary flex-shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {brand.category?.map(c => (
                            <span key={c} className="bg-lp-surface-container-high text-lp-primary px-2 py-0.5 rounded-full text-[10px] font-medium">{c}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider mb-1">Harga Mulai</p>
                    {brand.packages_min_price_start ? (
                        <p className="font-playfair font-bold text-lp-primary text-lg">{formatPrice(brand.packages_min_price_start)}</p>
                    ) : (
                        <p className="text-lp-on-surface-variant text-sm italic">Hubungi</p>
                    )}
                </div>
                <div>
                    <p className="text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider mb-1">Rating</p>
                    {brand.testimonials_avg_rating ? (
                        <div className="flex items-center gap-1.5">
                            <Stars rating={brand.testimonials_avg_rating} />
                            <span className="text-sm font-semibold text-lp-on-surface">{Number(brand.testimonials_avg_rating).toFixed(1)}</span>
                        </div>
                    ) : (
                        <p className="text-lp-on-surface-variant text-sm italic">Belum ada</p>
                    )}
                </div>
            </div>

            <div>
                <p className="text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider mb-1.5">Lokasi</p>
                <div className="flex items-start gap-1.5">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-lp-primary" />
                    <div className="text-sm text-lp-on-surface-variant">
                        {locationLabel && <p>{locationLabel}</p>}
                        {mapsLink ? (
                            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-lp-primary hover:underline text-xs font-medium">
                                Lihat peta
                            </a>
                        ) : (
                            !locationLabel && <p>–</p>
                        )}
                    </div>
                </div>
            </div>

            {topPackages.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider mb-1.5">Paket</p>
                    <div className="space-y-1.5">
                        {topPackages.map(pkg => (
                            <div key={pkg.id} className="flex items-center justify-between gap-2 text-sm bg-lp-surface-container-low rounded-lg px-3 py-2">
                                <span className="text-lp-on-surface font-medium truncate">{pkg.name}</span>
                                <span className="text-lp-primary font-semibold flex-shrink-0">{formatPrice(pkg.price_start)}</span>
                            </div>
                        ))}
                        {remainingPackages > 0 && (
                            <p className="text-xs text-lp-on-surface-variant text-center pt-0.5">+{remainingPackages} paket lainnya</p>
                        )}
                    </div>
                </div>
            )}

            <Link
                href={`/brand/${brand.slug}`}
                className="w-full bg-lp-primary text-lp-on-primary py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all"
            >
                <MessageCircle className="h-4 w-4" />
                Lihat Detail Brand
            </Link>
        </div>
    );
}

function MobileCompareView({ brands }: { brands: BrandWithCompareStats[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStart = useRef({ x: 0, y: 0 });

    const prices = brands.map(b => b.packages_min_price_start).filter((p): p is number => !!p);
    const cheapestPrice = prices.length > 0 ? Math.min(...prices) : null;

    function handleTouchStart(e: TouchEvent) {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
        const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
        // Abaikan gestur pendek atau yang dominan vertikal (user sedang scroll, bukan swipe)
        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        if (deltaX < 0 && activeIndex < brands.length - 1) setActiveIndex(i => i + 1);
        if (deltaX > 0 && activeIndex > 0) setActiveIndex(i => i - 1);
    }

    return (
        <div className="md:hidden">
            {/* Strip ringkasan harga — dobel fungsi sebagai tab selector, tetap terlihat di atas */}
            <div className="sticky top-20 z-30 bg-lp-surface/95 backdrop-blur-md border-b border-lp-outline-variant -mx-4 px-4 py-3 mb-5">
                <div className="flex gap-2 overflow-x-auto" role="tablist">
                    {brands.map((b, i) => (
                        <button
                            key={b.id}
                            type="button"
                            role="tab"
                            aria-selected={i === activeIndex}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-shrink-0 flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl border text-left min-w-[136px] transition-all active:scale-[0.98] ${
                                i === activeIndex ? 'border-lp-primary bg-lp-primary/5' : 'border-lp-outline-variant'
                            }`}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-lp-outline-variant">
                                <BrandLogo brand={b} className="w-full h-full text-[10px]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-lp-on-surface truncate">{b.name}</p>
                                <p className="text-xs text-lp-on-surface-variant truncate">
                                    {b.packages_min_price_start ? formatPrice(b.packages_min_price_start) : 'Hubungi'}
                                </p>
                            </div>
                            {cheapestPrice !== null && b.packages_min_price_start === cheapestPrice && (
                                <span className="flex-shrink-0 bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Termurah</span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex justify-center gap-1.5 mt-2" aria-hidden="true">
                    {brands.map((b, i) => (
                        <span
                            key={b.id}
                            className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-4 bg-lp-primary' : 'w-1.5 bg-lp-outline-variant'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Track geser: semua kartu dirender berdampingan, digeser via transform */}
            <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div
                    className="flex gap-3 transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(calc(${activeIndex} * (-100% - 0.75rem)))` }}
                >
                    {brands.map(brand => (
                        <CompareBrandCard key={brand.id} brand={brand} />
                    ))}
                </div>
            </div>
        </div>
    );
}
```

Catatan implementasi:
- `0.75rem` di rumus `calc()` harus sama dengan `gap-3` di track. Kalau gap diubah, rumusnya ikut diubah.
- Kartu memakai `w-full flex-shrink-0` supaya tiap kartu tepat selebar viewport track; `overflow-hidden` di wrapper menyembunyikan kartu tetangga.
- Handler sentuh dipasang di wrapper track (bukan kartu individual) supaya seluruh area kartu — termasuk saat animasi berjalan — responsif terhadap swipe.

### 2.3 — Render `MobileCompareView` + sembunyikan tabel lama di mobile

Di dalam `ComparePage`, tepat sebelum `<div className="overflow-x-auto rounded-xl border border-lp-outline-variant">` (pembuka tabel desktop), tambahkan:
```tsx
<MobileCompareView brands={brands} />
```

Lalu bungkus div tabel yang sudah ada supaya cuma tampil di desktop — ubah:
```tsx
<div className="overflow-x-auto rounded-xl border border-lp-outline-variant">
```
Jadi:
```tsx
<div className="hidden md:block overflow-x-auto rounded-xl border border-lp-outline-variant">
```
(Penutup `</div>`-nya tidak perlu diubah — sudah pasangan yang sama.)

### Acceptance criteria Task 2
- [ ] Di mobile (<768px): tabel lama tidak muncul sama sekali; muncul strip ringkasan (logo+nama+harga per brand, badge "Termurah" di brand termurah) + kartu detail brand aktif di bawahnya
- [ ] Tap chip di strip → kartu **bergeser halus** (animasi translate) ke brand itu, dot indicator ikut update
- [ ] Swipe kiri/kanan di area kartu → geser halus ke brand berikutnya/sebelumnya (tidak bisa melewati brand pertama/terakhir)
- [ ] **Scroll vertikal atau gestur miring di dalam kartu TIDAK memicu pergantian brand** — hanya gestur yang dominan horizontal
- [ ] Strip ringkasan tetap terlihat (`sticky`) saat scroll di dalam kartu detail
- [ ] Kartu menampilkan Lokasi dengan label + link peta yang benar-benar bisa dibuka (bukan cuma "Lihat peta" yang error)
- [ ] Kartu menampilkan hingga 3 paket dengan nama+harga aktual (bukan cuma angka), plus "+N paket lainnya" kalau lebih dari 3
- [ ] Di desktop (≥768px): tampilan 100% tabel seperti sebelumnya (setelah fix Task 1), `MobileCompareView` tersembunyi via `md:hidden` dan tidak mengganggu layout (mis. tidak menambah tinggi halaman)
- [ ] Brand dengan 2 vs 3 dipilih untuk dibandingkan: strip menyesuaikan jumlah chip, swipe & translate tetap berhenti di batas yang benar

---

## Setelah selesai

1. `npm run types` — nol error baru, terutama pastikan `TouchEvent` ter-import benar dari `react` (bukan `TouchEvent` global dari lib DOM yang beda tipe)
2. QA manual: buka `/compare?ids=...` dengan 2 brand lalu 3 brand, di viewport 375px dan desktop
3. **Uji gestur miring/diagonal dan scroll pelan di dalam kartu** — pastikan tidak pernah tak sengaja pindah brand; lalu uji swipe horizontal tegas — pastikan pindah dengan animasi geser
4. Klik "Lihat peta" di kedua tampilan (desktop tabel & mobile kartu) — pastikan device/browser benar-benar membuka Google Maps, bukan cuma "kelihatan seperti link"
5. Coba dengan brand yang salah satu paketnya kosong (`packages_min_price_start` null) — pastikan "Hubungi" muncul, badge "Termurah" tidak nyasar ke brand itu

## Di luar scope

- Baris "Jumlah Paket" di tabel **desktop** sengaja tidak diubah jadi daftar paket — desktop tidak pernah dikeluhkan, dan memaksakan daftar multi-baris ke sel tabel yang rapat berisiko merusak kerapian baris yang sudah bagus. Insight paket lengkap cuma ditambahkan di kartu mobile yang punya ruang vertikal.
- Drag-follow real-time (kartu mengikuti jari selama digeser, bukan hanya snap setelah lepas) — butuh state per-frame + pointer capture; nilai tambahnya kecil dibanding kompleksitasnya untuk maks 3 kartu. Snap beranimasi sudah memenuhi arah "swipe" yang diputuskan.
- Menambahkan link "Lihat peta" yang bisa diklik di `brand-card.tsx` (kartu brand di homepage/portfolio) — di luar apa yang diminta (khusus halaman Bandingkan), lokasi di kartu brand saat ini cuma teks tanpa link dan itu bukan bug, cuma keterbatasan yang berbeda. Bisa dibahas terpisah kalau memang diinginkan.
