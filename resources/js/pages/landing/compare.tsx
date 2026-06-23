import { BrandLogo, formatPrice } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { isMapsEmbed } from '@/lib/utils';
import { type Brand, type BrandPackage } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';

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

                <div className="overflow-x-auto rounded-xl border border-lp-outline-variant">
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
