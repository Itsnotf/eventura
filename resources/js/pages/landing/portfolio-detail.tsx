import { BrandLogo, whatsappUrl } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { isMapsEmbed } from '@/lib/utils';
import { type Brand, type BrandPortfolio, type ImagePortfolio } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface PortfolioWithImages extends BrandPortfolio {
    images: ImagePortfolio[];
}

interface Props {
    brand: Brand;
    portfolio: PortfolioWithImages;
}

export default function PortfolioDetailPage({ brand, portfolio }: Props) {
    const eventDate = new Date(portfolio.event_date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <LandingLayout>
            <Head title={portfolio.title} />

            <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12">

                {/* Back link + header */}
                <div className="mb-8">
                    <Link
                        href={`/brand/${brand.slug}`}
                        className="inline-flex items-center gap-2 text-lp-secondary hover:text-lp-primary text-sm font-semibold transition-colors group mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke {brand.name}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-lp-surface-container-high text-lp-primary px-3 py-1 rounded-full text-xs font-semibold">
                                    {portfolio.event_type}
                                </span>
                                <span className="text-lp-on-surface-variant text-sm">{eventDate}</span>
                            </div>
                            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-lp-primary leading-tight">
                                {portfolio.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {portfolio.deskripsi && (
                    <div className="max-w-3xl mb-10">
                        <p className="text-lp-on-surface-variant leading-relaxed">{portfolio.deskripsi}</p>
                    </div>
                )}

                {portfolio.video && (
                    <div className="mb-10">
                        <video
                            src={`/storage/${portfolio.video}`}
                            controls
                            preload="none"
                            poster={portfolio.images[0] ? `/storage/${portfolio.images[0].image}` : undefined}
                            className="w-full max-h-[500px] rounded-xl bg-black"
                        />
                    </div>
                )}

                {/* Adaptive gallery */}
                {portfolio.images.length > 0 ? (
                    <div className="mb-12">
                        {portfolio.images.length === 1 ? (
                            <div className="rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(18,67,65,0.08)] group">
                                <img
                                    src={`/storage/${portfolio.images[0].image}`}
                                    alt={portfolio.title}
                                    className="w-full max-h-[600px] object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ) : (
                            <div
                                className={`grid gap-4 md:gap-6 ${
                                    portfolio.images.length === 2
                                        ? 'grid-cols-1 sm:grid-cols-2'
                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                }`}
                            >
                                {portfolio.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="aspect-[4/3] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(18,67,65,0.08)] group"
                                    >
                                        <img
                                            src={`/storage/${image.image}`}
                                            alt={portfolio.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 text-lp-on-surface-variant mb-12">
                        <p>Belum ada foto dalam portfolio ini.</p>
                    </div>
                )}

                {/* Brand mini card */}
                <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-6 shadow-[0_4px_20px_rgba(18,67,65,0.08)] flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-lp-outline-variant flex-shrink-0">
                            <BrandLogo brand={brand} className="w-full h-full text-sm" />
                        </div>
                        <div>
                            <h3 className="font-playfair text-lg font-semibold text-lp-primary mb-1">{brand.name}</h3>
                            <div className="flex flex-wrap gap-1 mb-1">
                                {brand.category?.map((cat) => (
                                    <span key={cat} className="bg-lp-surface-container-high text-lp-primary px-2 py-0.5 rounded-full text-xs font-medium">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            {brand.address && !isMapsEmbed(brand.address) && (
                                <p className="text-lp-on-surface-variant text-sm">{brand.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        {brand.whatsapp_number && (
                            <a
                                href={whatsappUrl(brand.whatsapp_number, `Halo, saya melihat portfolio "${portfolio.title}" dan tertarik dengan layanan ${brand.name}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-lp-primary text-lp-on-primary px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Hubungi via WhatsApp
                            </a>
                        )}
                        <Link
                            href={`/brand/${brand.slug}`}
                            className="border border-lp-primary text-lp-primary px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center hover:bg-lp-surface-container-low transition-colors whitespace-nowrap"
                        >
                            Lihat Profil Brand
                        </Link>
                    </div>
                </div>

            </div>
        </LandingLayout>
    );
}
