import { BrandCard, type BrandWithStats } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
    featuredBrands: BrandWithStats[];
}

export default function Welcome({ featuredBrands }: Props) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (category) params.category = category;
        router.get('/explore', params);
    }

    return (
        <LandingLayout>
            <Head title="Beranda" />

            {/* Hero */}
            <section className="relative min-h-[580px] flex items-center justify-center bg-lp-surface-container-low overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-lp-surface-container to-lp-surface-container-low" />
                <div className="relative z-10 max-w-3xl mx-auto text-center px-4 md:px-6 py-16">
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-lp-on-surface mb-4 leading-tight tracking-tight">
                        Temukan Event Organizer &amp; Wedding Organizer Terbaik
                    </h1>
                    <p className="text-lp-on-surface-variant text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                        Wujudkan acara impian Anda. Jelajahi portfolio, bandingkan paket, dan hubungi langsung.
                    </p>

                    {/* Search bar */}
                    <form
                        onSubmit={handleSearch}
                        className="bg-lp-surface-container-lowest p-2 rounded-xl shadow-[0_4px_24px_rgba(18,67,65,0.12)] border border-lp-outline-variant flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
                    >
                        <div className="flex-grow relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lp-outline" />
                            <input
                                type="text"
                                placeholder="Cari nama brand, kota..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-lp-surface-container-low border border-transparent focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/10 text-sm outline-none text-lp-on-surface placeholder:text-lp-outline"
                            />
                        </div>
                        <div className="relative min-w-[160px] border-t md:border-t-0 md:border-l border-lp-outline-variant pt-2 md:pt-0 md:pl-2">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full py-2.5 px-3 bg-transparent border-none text-sm text-lp-on-surface focus:ring-0 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Semua Kategori</option>
                                <option value="EO">Event Organizer</option>
                                <option value="WO">Wedding Organizer</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-lp-primary text-lp-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Cari
                        </button>
                    </form>

                    {/* Quick filters */}
                    <div className="flex gap-3 justify-center mt-5 flex-wrap">
                        <Link
                            href="/explore?category=EO"
                            className="bg-lp-surface-container-lowest border border-lp-outline-variant text-lp-primary px-5 py-2 rounded-full text-sm font-semibold hover:bg-lp-surface-container-low transition-colors shadow-sm"
                        >
                            Cari EO
                        </Link>
                        <Link
                            href="/explore?category=WO"
                            className="bg-lp-surface-container-lowest border border-lp-outline-variant text-lp-primary px-5 py-2 rounded-full text-sm font-semibold hover:bg-lp-surface-container-low transition-colors shadow-sm"
                        >
                            Cari WO
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured brands */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-1">Brand Unggulan</h2>
                        <p className="text-lp-on-surface-variant text-sm">Partner terpilih untuk momen berharga Anda.</p>
                    </div>
                    <Link
                        href="/explore"
                        className="hidden md:flex items-center gap-1 text-lp-secondary hover:text-lp-primary text-sm font-semibold transition-colors"
                    >
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {featuredBrands.length === 0 ? (
                    <div className="text-center py-20 text-lp-on-surface-variant">
                        <p>Belum ada brand yang terdaftar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredBrands.map((brand) => (
                            <BrandCard key={brand.id} brand={brand} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-8 md:hidden">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-lp-secondary font-semibold text-sm hover:text-lp-primary transition-colors">
                        Lihat Semua Brand <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </LandingLayout>
    );
}
