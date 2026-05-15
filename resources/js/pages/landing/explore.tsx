import { BrandCard, type BrandWithStats } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PaginatedBrands {
    data: BrandWithStats[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Props {
    brands: PaginatedBrands;
    filters: { search?: string; category?: string };
}

const CATEGORIES = [
    { value: '', label: 'Semua' },
    { value: 'EO', label: 'Event Organizer' },
    { value: 'WO', label: 'Wedding Organizer' },
];

export default function ExplorePage({ brands, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    const applyFilter = useCallback(
        (cat: string, q: string, page?: number) => {
            const params: Record<string, string | number> = {};
            if (q) params.search = q;
            if (cat) params.category = cat;
            if (page) params.page = page;
            router.get('/explore', params, { preserveState: true, only: ['brands', 'filters'] });
        },
        [],
    );

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilter(category, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    function handleCategory(cat: string) {
        setCategory(cat);
        applyFilter(cat, search);
    }

    function goToPage(page: number) {
        applyFilter(category, search, page);
    }

    // Build pagination page numbers with ellipsis
    function buildPages(): (number | '...')[] {
        const pages: (number | '...')[] = [];
        const total = brands.last_page;
        const current = brands.current_page;

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
            <Head title="Explore Brand" />

            {/* Header */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 pt-12 pb-6">
                <h1 className="font-playfair text-4xl font-bold text-lp-primary mb-2">Explore Brand</h1>
                <p className="text-lp-on-surface-variant">Temukan EO &amp; WO terbaik di Indonesia untuk acara impian Anda.</p>
            </div>

            {/* Sticky filter bar */}
            <div className="sticky top-20 z-40 bg-lp-surface/95 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.06)]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    {/* Category tabs */}
                    <div className="flex bg-lp-surface-container rounded-lg p-1 w-full md:w-auto gap-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategory(cat.value)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded text-sm font-semibold transition-colors ${
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
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lp-outline" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama brand atau kota..."
                            className="w-full pl-9 pr-4 py-2 bg-lp-surface-container-lowest border border-lp-outline-variant rounded-lg text-sm text-lp-on-surface placeholder:text-lp-outline focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/10 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 pb-16 pt-8">
                {brands.data.length === 0 ? (
                    <div className="text-center py-24 text-lp-on-surface-variant flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 opacity-25" />
                        <p className="text-lg font-medium">Tidak ada brand yang ditemukan.</p>
                        <p className="text-sm">Coba ubah kata kunci atau filter kategori.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-lp-on-surface-variant text-sm mb-6">
                            Menampilkan <span className="font-semibold text-lp-on-surface">{brands.total}</span> brand
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brands.data.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} />
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
                                        <span key={`e-${idx}`} className="text-lp-on-surface-variant px-1 text-sm">
                                            ...
                                        </span>
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
        </LandingLayout>
    );
}
