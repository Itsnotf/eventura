import { BrandCard, type BrandWithStats } from '@/components/landing/brand-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingLayout from '@/layouts/landing-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BadgeCheck, ChevronLeft, ChevronRight, GitCompare, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PaginatedBrands {
    data: BrandWithStats[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Filters {
    search?: string;
    category?: string;
    verified?: string;
    min_price?: string;
    max_price?: string;
    min_rating?: string;
    sort?: string;
}

interface Props {
    brands: PaginatedBrands;
    filters: Filters;
    featuredBrands: BrandWithStats[];
}

const CATEGORIES = [
    { value: '', label: 'Semua' },
    { value: 'EO', label: 'Event Organizer' },
    { value: 'WO', label: 'Wedding Organizer' },
    { value: 'CC', label: 'Content Creator' },
    { value: 'Catering', label: 'Catering' },
];

const SORT_OPTIONS = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'name', label: 'Nama A-Z' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'rating', label: 'Rating Tertinggi' },
];

const RATING_OPTIONS = [
    { value: '', label: 'Semua' },
    { value: '4', label: '4+ ⭐' },
    { value: '4.5', label: '4.5+ ⭐' },
];

function CompareBar({ brands, onRemove, onClear }: {
    brands: BrandWithStats[];
    onRemove: (id: number) => void;
    onClear: () => void;
}) {
    if (brands.length === 0) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-lp-surface border-t border-lp-outline-variant shadow-[0_-4px_20px_rgba(18,67,65,0.12)] px-4 py-3">
            <div className="max-w-[1280px] mx-auto flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-lp-on-surface flex items-center gap-1.5">
                    <GitCompare className="h-4 w-4 text-lp-primary" />
                    Bandingkan ({brands.length}/3)
                </span>
                <div className="flex gap-2 flex-1 flex-wrap">
                    {brands.map(b => (
                        <div key={b.id} className="flex items-center gap-1.5 bg-lp-surface-container-low rounded-full px-3 py-1 text-xs font-medium">
                            {b.name}
                            <button onClick={() => onRemove(b.id)} className="text-lp-on-surface-variant hover:text-lp-primary">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClear} className="text-xs text-lp-on-surface-variant hover:text-lp-primary">Bersihkan</button>
                    {brands.length >= 2 && (
                        <Link
                            href={`/compare?ids=${brands.map(b => b.id).join(',')}`}
                            className="bg-lp-primary text-lp-on-primary px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90"
                        >
                            Bandingkan →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

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

export default function Welcome({ brands, filters, featuredBrands }: Props) {
    const f: Filters = Array.isArray(filters) ? {} : filters;

    const [search, setSearch] = useState(f.search ?? '');
    const [category, setCategory] = useState(f.category ?? '');
    const [verified, setVerified] = useState(f.verified ?? '');
    const [minPrice, setMinPrice] = useState(f.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(f.max_price ?? '');
    const [minRating, setMinRating] = useState(f.min_rating ?? '');
    const [sort, setSort] = useState(f.sort ?? 'latest');
    const [showFilters, setShowFilters] = useState(false);
    const isMobile = useIsMobile();
    const [compareList, setCompareList] = useState<BrandWithStats[]>([]);

    const applyFilter = useCallback((overrides: Partial<Record<string, string | number>>, page?: number) => {
        const params: Record<string, string | number> = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (verified) params.verified = verified;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (minRating) params.min_rating = minRating;
        if (sort && sort !== 'latest') params.sort = sort;
        if (page) params.page = page;
        Object.assign(params, overrides);
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get('/', params, { preserveState: true, only: ['brands', 'filters'] });
    }, [search, category, verified, minPrice, maxPrice, minRating, sort]);

    useEffect(() => {
        const timer = setTimeout(() => applyFilter({}), 500);
        return () => clearTimeout(timer);
    }, [search]);

    function handleFilter(key: string, value: string) {
        const setters: Record<string, (v: string) => void> = {
            category: setCategory,
            verified: setVerified,
            min_price: setMinPrice,
            max_price: setMaxPrice,
            min_rating: setMinRating,
            sort: setSort,
        };
        setters[key]?.(value);
        applyFilter({ [key]: value });
    }

    function goToPage(page: number) { applyFilter({}, page); }

    function buildPages(): (number | '...')[] {
        const pages: (number | '...')[] = [];
        const total = brands.last_page;
        const current = brands.current_page;
        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || Math.abs(i - current) <= 1) pages.push(i);
            else if (pages[pages.length - 1] !== '...') pages.push('...');
        }
        return pages;
    }

    function toggleCompare(brand: BrandWithStats) {
        setCompareList(prev => {
            const exists = prev.find(b => b.id === brand.id);
            if (exists) return prev.filter(b => b.id !== brand.id);
            if (prev.length >= 3) return prev;
            return [...prev, brand];
        });
    }

    const activeFilterCount = [category, verified, minPrice, maxPrice, minRating].filter(Boolean).length;
    const hasActiveFilters = activeFilterCount > 0 || !!search;

    return (
        <LandingLayout>
            <Head title="Beranda" />

            {/* Slim header */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 pt-10 pb-4">
                <h1 className="font-playfair text-4xl font-bold text-lp-primary">Temukan Vendor Acara Terbaik di Palembang</h1>
                <p className="text-lp-on-surface-variant mt-1 text-sm">Jelajahi EO, WO, Content Creator, dan Catering — bandingkan paket, dan wujudkan acara impian Anda.</p>
            </div>

            {/* Sticky filter bar */}
            <div className="sticky top-20 z-40 bg-lp-surface/95 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.06)]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    {/* Category tabs */}
                    <div className="flex bg-lp-surface-container rounded-lg p-1 gap-1 overflow-x-auto">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleFilter('category', cat.value)}
                                className={`flex-shrink-0 px-4 py-2 rounded text-sm font-semibold transition-colors ${
                                    category === cat.value
                                        ? 'bg-lp-primary text-lp-on-primary shadow-sm'
                                        : 'text-lp-on-surface-variant hover:text-lp-primary hover:bg-lp-surface-container-low'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lp-outline" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama brand..."
                            className="w-full pl-9 pr-4 py-2 bg-lp-surface-container-lowest border border-lp-outline-variant rounded-lg text-sm text-lp-on-surface placeholder:text-lp-outline focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/10 outline-none"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={e => handleFilter('sort', e.target.value)}
                        className="bg-lp-surface-container-lowest border border-lp-outline-variant rounded-lg px-3 py-2 text-sm text-lp-on-surface focus:outline-none focus:ring-2 focus:ring-lp-primary/10"
                    >
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    {/* Advanced filter toggle */}
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? 'bg-lp-primary text-lp-on-primary border-lp-primary' : 'border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container'}`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                </div>

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
            </div>

            {/* Content */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 pb-24 pt-8">
                {/* Featured segment — only shown when no active filters */}
                {!hasActiveFilters && featuredBrands.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="h-5 w-5 text-lp-primary fill-lp-primary" />
                            <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface">Brand Unggulan</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBrands.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} />
                            ))}
                        </div>
                        <hr className="border-lp-outline-variant mt-10 mb-8" />
                        <h3 className="font-playfair text-xl font-semibold text-lp-on-surface">Semua Brand</h3>
                    </section>
                )}

                {brands.data.length === 0 ? (
                    <div className="text-center py-24 text-lp-on-surface-variant flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 opacity-25" />
                        <p className="text-lg font-medium">Tidak ada brand yang ditemukan.</p>
                        <p className="text-sm">Coba ubah kata kunci atau filter.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-lp-on-surface-variant text-sm">
                                Menampilkan <span className="font-semibold text-lp-on-surface">{brands.total}</span> brand
                            </p>
                            <p className="text-xs text-lp-on-surface-variant hidden md:block">
                                Klik ikon <GitCompare className="h-3 w-3 inline" /> pada kartu untuk membandingkan (maks 3)
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brands.data.map((brand) => (
                                <div key={brand.id} className="relative">
                                    <BrandCard brand={brand} />
                                    <button
                                        onClick={() => toggleCompare(brand)}
                                        className={`absolute top-2 left-2 z-10 w-11 h-11 flex items-center justify-center rounded-full shadow transition-colors ${compareList.find(b => b.id === brand.id) ? 'bg-lp-primary text-lp-on-primary' : 'bg-white/90 text-lp-on-surface-variant hover:bg-lp-primary hover:text-lp-on-primary'}`}
                                        title="Bandingkan"
                                    >
                                        <GitCompare className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {brands.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    disabled={brands.current_page === 1}
                                    onClick={() => goToPage(brands.current_page - 1)}
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
                                            onClick={() => goToPage(item as number)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                                brands.current_page === item
                                                    ? 'bg-lp-primary text-lp-on-primary'
                                                    : 'border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}

                                <button
                                    disabled={brands.current_page === brands.last_page}
                                    onClick={() => goToPage(brands.current_page + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CompareBar
                brands={compareList}
                onRemove={id => setCompareList(prev => prev.filter(b => b.id !== id))}
                onClear={() => setCompareList([])}
            />
        </LandingLayout>
    );
}
