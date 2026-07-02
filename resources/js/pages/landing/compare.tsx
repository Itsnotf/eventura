import { BrandLogo, formatPrice } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { extractMapsPlaceLabel, isMapsEmbed, mapsViewUrl } from '@/lib/utils';
import { type Brand, type BrandPackage } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';
import { useRef, useState, type TouchEvent } from 'react';

interface BrandWithCompareStats extends Brand {
    packages?: BrandPackage[];
    packages_min_price_start?: number | null;
    testimonials_avg_rating?: number | null;
    testimonials_count?: number;
}

interface Props {
    brands: BrandWithCompareStats[];
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5 justify-center">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-lp-on-surface-variant/30'}`} />
            ))}
        </div>
    );
}

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

export default function ComparePage({ brands }: Props) {
    if (brands.length < 2) {
        return (
            <LandingLayout>
                <Head title="Bandingkan Brand" />
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-24 text-center">
                    <p className="text-lp-on-surface-variant">Pilih minimal 2 brand untuk dibandingkan.</p>
                    <Link href="/" className="inline-block mt-4 text-lp-primary font-semibold hover:underline">
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </LandingLayout>
        );
    }

    // Kolom label sticky (140px) + kolom brand minmax agar bisa scroll horizontal di mobile,
    // tetap melebar mengisi ruang di desktop.
    const gridStyle = { gridTemplateColumns: `140px repeat(${brands.length}, minmax(150px, 1fr))` };
    const labelCell =
        'sticky left-0 z-10 p-4 bg-lp-surface-container-low border-r border-lp-outline-variant text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider flex items-center';

    return (
        <LandingLayout>
            <Head title="Bandingkan Brand" />

            <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-lp-on-surface-variant hover:text-lp-primary mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Beranda
                </Link>

                <h1 className="font-playfair text-3xl font-bold text-lp-primary mb-8">Perbandingan Brand</h1>

                <MobileCompareView brands={brands} />

                <div className="hidden md:block overflow-x-auto rounded-xl border border-lp-outline-variant">
                    {/* Brand header row */}
                    <div className="grid border-b border-lp-outline-variant" style={gridStyle}>
                        <div className="sticky left-0 z-10 p-4 bg-lp-surface-container-low border-r border-lp-outline-variant" />
                        {brands.map(brand => (
                            <div key={brand.id} className="p-5 flex flex-col items-center gap-3 text-center border-l border-lp-outline-variant">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-lp-outline-variant">
                                    <BrandLogo brand={brand} className="w-full h-full text-xs" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-1">
                                        <Link href={`/brand/${brand.slug}`} className="font-playfair font-semibold text-lp-on-surface hover:text-lp-primary text-base">
                                            {brand.name}
                                        </Link>
                                        {brand.is_verified && <BadgeCheck className="h-4 w-4 text-lp-primary flex-shrink-0" />}
                                    </div>
                                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                                        {brand.category?.map(c => (
                                            <span key={c} className="bg-lp-surface-container-high text-lp-primary px-2 py-0.5 rounded-full text-xs font-medium">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Compare rows */}
                    <div>
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

                        {/* Harga mulai */}
                        <div className="grid border-b border-lp-outline-variant" style={gridStyle}>
                            <div className={labelCell}>Harga Mulai</div>
                            {brands.map(brand => (
                                <div key={brand.id} className="p-4 border-l border-lp-outline-variant text-center">
                                    {brand.packages_min_price_start ? (
                                        <span className="font-playfair font-bold text-lp-primary text-lg">{formatPrice(brand.packages_min_price_start)}</span>
                                    ) : (
                                        <span className="text-lp-on-surface-variant text-sm italic">Hubungi</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Rating */}
                        <div className="grid border-b border-lp-outline-variant" style={gridStyle}>
                            <div className={labelCell}>Rating</div>
                            {brands.map(brand => (
                                <div key={brand.id} className="p-4 border-l border-lp-outline-variant flex flex-col items-center gap-1">
                                    {brand.testimonials_avg_rating ? (
                                        <>
                                            <Stars rating={brand.testimonials_avg_rating} />
                                            <span className="text-sm font-semibold text-lp-on-surface">{Number(brand.testimonials_avg_rating).toFixed(1)}</span>
                                            <span className="text-xs text-lp-on-surface-variant">{brand.testimonials_count} ulasan</span>
                                        </>
                                    ) : (
                                        <span className="text-lp-on-surface-variant text-sm italic">Belum ada</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Verifikasi */}
                        <div className="grid border-b border-lp-outline-variant" style={gridStyle}>
                            <div className={labelCell}>Terverifikasi</div>
                            {brands.map(brand => (
                                <div key={brand.id} className="p-4 border-l border-lp-outline-variant flex items-center justify-center">
                                    {brand.is_verified ? (
                                        <span className="inline-flex items-center gap-1 bg-lp-primary/10 text-lp-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                                            <BadgeCheck className="h-3.5 w-3.5" /> Ya
                                        </span>
                                    ) : (
                                        <span className="text-lp-on-surface-variant text-sm">–</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Jumlah paket */}
                        <div className="grid border-b border-lp-outline-variant" style={gridStyle}>
                            <div className={labelCell}>Jumlah Paket</div>
                            {brands.map(brand => (
                                <div key={brand.id} className="p-4 border-l border-lp-outline-variant text-center text-sm font-semibold text-lp-on-surface">
                                    {brand.packages?.length ?? 0}
                                </div>
                            ))}
                        </div>

                        {/* CTA row */}
                        <div className="grid" style={gridStyle}>
                            <div className="sticky left-0 z-10 p-4 bg-lp-surface-container-low border-r border-lp-outline-variant" />
                            {brands.map(brand => (
                                <div key={brand.id} className="p-4 border-l border-lp-outline-variant flex items-center justify-center">
                                    <Link
                                        href={`/brand/${brand.slug}`}
                                        className="bg-lp-primary text-lp-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Lihat Detail
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
