import { BrandInitials, BrandLogo } from '@/components/landing/brand-card';
import { PortfolioThumbnail } from '@/components/landing/portfolio-thumbnail';
import LandingLayout from '@/layouts/landing-layout';
import { type Brand, type BrandPortfolio, type ImagePortfolio } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useCallback, useState } from 'react';

interface PortfolioWithBrandAndImage extends BrandPortfolio {
    brand: Brand;
    images: ImagePortfolio[];
}

interface PaginatedPortfolios {
    data: PortfolioWithBrandAndImage[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    portfolios: PaginatedPortfolios;
    eventTypes: string[];
    filters: { event_type?: string };
}

function PortfolioCard({ portfolio }: { portfolio: PortfolioWithBrandAndImage }) {
    const eventDate = new Date(portfolio.event_date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link href={`/brand/${portfolio.brand.slug}/portfolio/${portfolio.id}`} className="block group">
            <article className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)] overflow-hidden hover:shadow-[0_8px_30px_rgba(18,67,65,0.14)] transition-all duration-300 hover:-translate-y-1">
                {/* Thumbnail */}
                <PortfolioThumbnail
                    portfolio={portfolio}
                    className="h-52"
                    fallback={<BrandInitials name={portfolio.brand.name} className="w-full h-full text-4xl" />}
                >
                    <div className="absolute top-3 left-3 bg-lp-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-lp-on-surface">
                        {portfolio.event_type}
                    </div>
                </PortfolioThumbnail>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-playfair text-base font-semibold text-lp-on-surface leading-snug mb-1 group-hover:text-lp-primary transition-colors line-clamp-2">
                        {portfolio.title}
                    </h3>
                    <p className="text-lp-on-surface-variant text-xs mb-3">{eventDate}</p>

                    {/* Brand mini */}
                    <div className="flex items-center gap-2 pt-3 border-t border-lp-outline-variant">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-lp-outline-variant flex-shrink-0">
                            <BrandLogo brand={portfolio.brand} className="w-full h-full text-[8px]" />
                        </div>
                        <span className="text-lp-on-surface-variant text-xs font-medium truncate">{portfolio.brand.name}</span>
                        <div className="ml-auto flex gap-1 flex-shrink-0">
                            {portfolio.brand.category?.map((cat) => (
                                <span key={cat} className="bg-lp-surface-container-high text-lp-primary px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function PortfolioPage({ portfolios, eventTypes, filters }: Props) {
    const [eventType, setEventType] = useState(filters.event_type ?? '');

    const applyFilter = useCallback((type: string, page?: number) => {
        const params: Record<string, string | number> = {};
        if (type) params.event_type = type;
        if (page) params.page = page;
        router.get('/portfolio', params, { preserveState: true, only: ['portfolios', 'filters'] });
    }, []);

    function handleEventType(type: string) {
        setEventType(type);
        applyFilter(type);
    }

    function buildPages(): (number | '...')[] {
        const pages: (number | '...')[] = [];
        const total = portfolios.last_page;
        const current = portfolios.current_page;
        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || Math.abs(i - current) <= 1) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    }

    return (
        <LandingLayout>
            <Head title="Portfolio" />

            {/* Header */}
            <div className="bg-lp-surface-container-low py-12">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                    <h1 className="font-playfair text-4xl font-bold text-lp-primary mb-2">Portfolio</h1>
                    <p className="text-lp-on-surface-variant">
                        Jelajahi karya-karya terbaik dari Event Organizer dan Wedding Organizer di platform kami.
                    </p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="sticky top-20 z-40 bg-lp-surface/95 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.06)]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-3 overflow-x-auto">
                    <div className="flex gap-2 items-center min-w-max">
                        <button
                            onClick={() => handleEventType('')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                                eventType === ''
                                    ? 'bg-lp-primary text-lp-on-primary shadow-sm'
                                    : 'bg-lp-surface-container text-lp-on-surface-variant hover:text-lp-primary hover:bg-lp-surface-container-low'
                            }`}
                        >
                            Semua
                        </button>
                        {eventTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleEventType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                                    eventType === type
                                        ? 'bg-lp-primary text-lp-on-primary shadow-sm'
                                        : 'bg-lp-surface-container text-lp-on-surface-variant hover:text-lp-primary hover:bg-lp-surface-container-low'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 pb-16">
                {portfolios.data.length === 0 ? (
                    <div className="text-center py-24 text-lp-on-surface-variant flex flex-col items-center gap-4">
                        <Images className="h-12 w-12 opacity-25" />
                        <p className="text-lg font-medium">Belum ada portfolio yang tersedia.</p>
                        {eventType && (
                            <button onClick={() => handleEventType('')} className="text-lp-primary text-sm font-semibold hover:underline">
                                Tampilkan semua
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-lp-on-surface-variant text-sm my-6">
                            Menampilkan <span className="font-semibold text-lp-on-surface">{portfolios.total}</span> portfolio
                            {eventType && <span> · <span className="text-lp-primary font-medium">{eventType}</span></span>}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {portfolios.data.map((portfolio) => (
                                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {portfolios.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    disabled={portfolios.current_page === 1}
                                    onClick={() => applyFilter(eventType, portfolios.current_page - 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {buildPages().map((item, idx) =>
                                    item === '...' ? (
                                        <span key={`e-${idx}`} className="text-lp-on-surface-variant px-1 text-sm">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => applyFilter(eventType, item as number)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                                portfolios.current_page === item
                                                    ? 'bg-lp-primary text-lp-on-primary'
                                                    : 'border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}

                                <button
                                    disabled={portfolios.current_page === portfolios.last_page}
                                    onClick={() => applyFilter(eventType, portfolios.current_page + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </LandingLayout>
    );
}
