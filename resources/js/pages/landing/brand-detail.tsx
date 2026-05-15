import { BrandInitials, BrandLogo, formatPrice, whatsappUrl } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { type Brand, type BrandPackage, type BrandPortfolio, type ImagePortfolio } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Globe, Instagram, MapPin, MessageCircle, Star } from 'lucide-react';

function trackWhatsapp(slug: string): void {
    const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) ?? [])[1];
    fetch(`/brand/${slug}/track-whatsapp`, {
        method: 'POST',
        headers: { 'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '' },
    }).catch(() => {});
}

interface PortfolioWithImage extends BrandPortfolio {
    images?: ImagePortfolio[];
}

interface BrandWithRelations extends Brand {
    packages?: BrandPackage[];
    portfolios?: PortfolioWithImage[];
}

interface Props {
    brand: BrandWithRelations;
}

function PackageCard({ pkg, whatsapp, slug }: { pkg: BrandPackage; whatsapp: string; slug: string }) {
    const message = `Halo, saya tertarik dengan paket ${pkg.name}. Boleh saya tahu detail lebih lanjut?`;
    const waHref  = whatsappUrl(whatsapp, message);

    if (pkg.is_featured) {
        return (
            <div className="bg-lp-surface-container-lowest rounded-xl border-2 border-lp-primary shadow-[0_8px_30px_rgba(18,67,65,0.16)] overflow-hidden flex flex-col h-full">
                <div className="h-1.5 bg-lp-primary" />
                <div className="p-6 pt-5 flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-playfair text-xl font-semibold text-lp-on-surface leading-snug">{pkg.name}</h3>
                        <span className="flex-shrink-0 bg-lp-primary text-lp-on-primary px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> Featured
                        </span>
                    </div>
                    <div className="mb-3">
                        <span className="font-playfair text-3xl font-bold text-lp-primary">{formatPrice(pkg.price_start)}</span>
                        {pkg.price_end && Number(pkg.price_end) > Number(pkg.price_start) && (
                            <span className="text-lp-on-surface-variant text-sm ml-1">– {formatPrice(pkg.price_end)}</span>
                        )}
                    </div>
                    {pkg.description && (
                        <p className="text-lp-on-surface-variant text-sm leading-relaxed">{pkg.description}</p>
                    )}
                </div>
                <div className="px-6 pb-6 mt-auto pt-4">
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsapp(slug)}
                        className="w-full bg-lp-primary text-lp-on-primary py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Tanyakan Paket Ini
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)] overflow-hidden hover:shadow-[0_8px_30px_rgba(18,67,65,0.12)] transition-shadow flex flex-col h-full">
            <div className="p-6 flex-grow">
                <h3 className="font-playfair text-xl font-semibold text-lp-on-surface mb-3">{pkg.name}</h3>
                <div className="mb-3">
                    <span className="font-playfair text-3xl font-bold text-lp-primary">{formatPrice(pkg.price_start)}</span>
                    {pkg.price_end && Number(pkg.price_end) > Number(pkg.price_start) && (
                        <span className="text-lp-on-surface-variant text-sm ml-1">– {formatPrice(pkg.price_end)}</span>
                    )}
                </div>
                {pkg.description && (
                    <p className="text-lp-on-surface-variant text-sm leading-relaxed">{pkg.description}</p>
                )}
            </div>
            <div className="px-6 pb-6 border-t border-lp-outline-variant pt-4 mt-auto">
                <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsapp(slug)}
                    className="w-full border border-lp-primary text-lp-primary py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-lp-surface-container-low transition-colors"
                >
                    Tanyakan
                </a>
            </div>
        </div>
    );
}

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

export default function BrandDetailPage({ brand }: Props) {
    const hasWhatsApp = !!brand.whatsapp_number;

    return (
        <LandingLayout>
            <Head title={brand.name} />

            {/* Hero cover */}
            <section className="relative w-full h-[400px] md:h-[480px] bg-lp-surface-container">
                {brand.cover_image ? (
                    <img src={`/storage/${brand.cover_image}`} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                    <BrandInitials name={brand.name} className="w-full h-full text-6xl" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-lp-surface via-lp-surface/40 to-transparent" />

                {/* Logo + name overlapping bottom of hero */}
                <div className="absolute bottom-0 left-0 w-full">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-end gap-4 translate-y-1/2">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-lp-surface overflow-hidden shadow-[0_8px_30px_rgba(18,67,65,0.16)] flex-shrink-0 bg-white">
                            <BrandLogo brand={brand} className="w-full h-full text-2xl" />
                        </div>
                        <div className="pb-2 flex-grow">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-lp-on-surface">{brand.name}</h1>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {brand.category?.map((cat) => (
                                    <span key={cat} className="bg-lp-surface-container-high text-lp-primary px-3 py-1 rounded-full text-xs font-semibold">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info section */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 pt-24 md:pt-28 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* About */}
                    <div className="md:col-span-8 space-y-6">
                        <Link href="/explore" className="inline-flex items-center gap-2 text-lp-secondary hover:text-lp-primary text-sm font-semibold transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Explore
                        </Link>

                        <div>
                            <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface mb-3">Tentang Brand</h2>
                            {brand.description ? (
                                <p className="text-lp-on-surface-variant leading-relaxed">{brand.description}</p>
                            ) : (
                                <p className="text-lp-on-surface-variant italic">Deskripsi belum tersedia.</p>
                            )}
                        </div>

                        {brand.address && (
                            <div className="flex items-start gap-3 p-5 bg-lp-surface-container-low rounded-xl border border-lp-outline-variant">
                                <MapPin className="h-5 w-5 text-lp-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-lp-on-surface uppercase tracking-wider mb-1">Lokasi</p>
                                    <p className="text-lp-on-surface-variant text-sm">{brand.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact card */}
                    <div className="md:col-span-4">
                        <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)] p-6 sticky top-24">
                            <h3 className="font-playfair text-xl font-semibold text-lp-on-surface mb-5">Hubungi Kami</h3>
                            <div className="space-y-3">
                                {hasWhatsApp && (
                                    <a
                                        href={whatsappUrl(brand.whatsapp_number, `Halo, saya tertarik dengan brand ${brand.name}`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackWhatsapp(brand.slug)}
                                        className="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                )}
                                {brand.instagram && (
                                    <a
                                        href={`https://instagram.com/${brand.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-lp-surface-container-low border border-lp-primary text-lp-primary py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-lp-surface-container transition-colors"
                                    >
                                        <Instagram className="h-4 w-4" />
                                        Instagram
                                    </a>
                                )}
                                {brand.website && (
                                    <a
                                        href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full text-lp-secondary py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:text-lp-primary transition-colors"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Kunjungi Website
                                    </a>
                                )}
                                {!hasWhatsApp && !brand.instagram && !brand.website && (
                                    <p className="text-lp-on-surface-variant text-sm text-center italic">Informasi kontak belum tersedia.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages */}
            {brand.packages && brand.packages.length > 0 && (
                <section className="bg-lp-surface-container-low py-14">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                        <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-8">Paket Layanan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                            {brand.packages.map((pkg) => (
                                <PackageCard key={pkg.id} pkg={pkg} whatsapp={brand.whatsapp_number ?? ''} slug={brand.slug} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio */}
            {brand.portfolios && brand.portfolios.length > 0 && (
                <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-14">
                    <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-8">Portfolio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brand.portfolios.map((portfolio) => (
                            <PortfolioThumb key={portfolio.id} portfolio={portfolio} brandSlug={brand.slug} />
                        ))}
                    </div>
                </section>
            )}
        </LandingLayout>
    );
}
