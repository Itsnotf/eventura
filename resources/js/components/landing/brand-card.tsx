import { extractMapsPlaceLabel, isMapsEmbed } from '@/lib/utils';
import { type Auth, type Brand } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { BadgeCheck, Heart, MapPin, Star } from 'lucide-react';

export interface BrandWithStats extends Brand {
    packages_min_price_start?: number | null;
    testimonials_avg_rating?: number | null;
}

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

export function formatPrice(price: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(price));
}

export function whatsappUrl(number: string, message?: string): string {
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);
    const base = `https://wa.me/${cleaned}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function BrandInitials({ name, className }: { name: string; className?: string }) {
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 60;
    return (
        <div
            className={`flex items-center justify-center text-white font-bold select-none ${className ?? ''}`}
            style={{ backgroundColor: `hsl(${165 + hue}, 38%, 28%)` }}
        >
            {initials}
        </div>
    );
}

export function BrandLogo({ brand, className }: { brand: Pick<Brand, 'logo' | 'name'>; className?: string }) {
    if (brand.logo) {
        return <img src={`/storage/${brand.logo}`} alt={brand.name} loading="lazy" decoding="async" className={`object-cover ${className ?? ''}`} />;
    }
    return <BrandInitials name={brand.name} className={className} />;
}

function FavoriteButton({ brandId }: { brandId: number }) {
    const { auth } = usePage().props as { auth?: Auth };
    const isLoggedIn = !!auth?.user;
    const isFavorited = auth?.favorite_brand_ids?.includes(brandId) ?? false;

    if (!isLoggedIn) return null;

    function toggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        router.post('/favorites/toggle', { brand_id: brandId }, { preserveScroll: true });
    }

    return (
        <button
            onClick={toggle}
            className="absolute top-2 right-2 z-10 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 active:scale-95 transition-transform"
            title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            aria-pressed={isFavorited}
        >
            <Heart className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-lp-on-surface-variant'}`} />
        </button>
    );
}

export function BrandCard({ brand }: { brand: BrandWithStats }) {
    const locationLabel = brand.address
        ? (isMapsEmbed(brand.address) ? extractMapsPlaceLabel(brand.address) : brand.address)
        : null;
    return (
        <Link href={`/brand/${brand.slug}`} className="block h-full">
            <article className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)] overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(18,67,65,0.14)] transition-all duration-300 active:scale-[0.99] flex flex-col h-full cursor-pointer">
                {/* Cover image */}
                <div className="relative h-48 overflow-hidden bg-lp-surface-container flex-shrink-0">
                    {brand.cover_image ? (
                        <img
                            src={`/storage/${brand.cover_image}`}
                            alt={brand.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <BrandInitials name={brand.name} className="w-full h-full text-5xl" />
                    )}
                    <FavoriteButton brandId={brand.id} />
                    {/* Logo overlap */}
                    <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-md bg-white flex-shrink-0">
                        <BrandLogo brand={brand} className="w-full h-full text-xs" />
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 pt-8 flex-grow flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="font-playfair text-lg font-semibold text-lp-on-surface leading-tight truncate">{brand.name}</h3>
                            {brand.is_verified && (
                                <BadgeCheck className="h-4 w-4 text-lp-primary flex-shrink-0" title="Brand Terverifikasi" />
                            )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                            {brand.category?.map((cat) => (
                                <span key={cat} className="bg-lp-surface-container-high text-lp-primary px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {brand.testimonials_avg_rating ? (
                        <div className="flex items-center gap-1.5">
                            <RatingStars rating={brand.testimonials_avg_rating} />
                            <span className="text-xs font-semibold text-lp-on-surface">{Number(brand.testimonials_avg_rating).toFixed(1)}</span>
                        </div>
                    ) : (
                        <p className="text-lp-on-surface-variant text-xs italic">Belum ada rating</p>
                    )}

                    {locationLabel && (
                        <p className="text-lp-on-surface-variant text-sm flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{locationLabel}</span>
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-lp-outline-variant flex justify-between items-center">
                        {brand.packages_min_price_start ? (
                            <span className="text-lp-on-surface-variant text-xs">
                                Mulai dari{' '}
                                <span className="font-semibold text-lp-on-surface">{formatPrice(brand.packages_min_price_start)}</span>
                            </span>
                        ) : (
                            <span className="text-lp-on-surface-variant text-xs italic">Hubungi untuk harga</span>
                        )}
                        <span className="text-lp-secondary text-sm font-semibold group-hover:text-lp-primary transition-colors">
                            Lihat →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
