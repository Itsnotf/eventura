import { BrandInitials, BrandLogo, formatPrice, whatsappUrl } from '@/components/landing/brand-card';
import LandingLayout from '@/layouts/landing-layout';
import { type Brand, type BrandPackage, type BrandPortfolio, type ImagePortfolio } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { isMapsEmbed } from '@/lib/utils';
import { ArrowLeft, BadgeCheck, CalendarPlus, Globe, ImageOff, Instagram, MapPin, MessageCircle, Send, Star } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

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

interface Testimonial {
    id: number;
    rating: number;
    body: string;
    published_at: string | null;
    user: { id: number; name: string };
}

interface EventPlanSummary {
    id: number;
    name: string;
}

interface Props {
    brand: BrandWithRelations;
    testimonials: Testimonial[];
    avgRating: number | null;
    reviewsCount: number;
    userHasTestimonial: boolean;
    userEventPlans: EventPlanSummary[];
    unavailableDates: string[];
}

interface AuthProps {
    user?: { id: number; name: string };
}

function InquiryForm({ brandId, eventPlans, unavailableDates }: { brandId: number; eventPlans: EventPlanSummary[]; unavailableDates: string[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        brand_id: brandId,
        event_type: '',
        event_date: '',
        message: '',
        event_plan_id: '',
    });

    const dateBlocked = data.event_date ? unavailableDates.includes(data.event_date) : false;

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/inquiries', { onSuccess: () => reset() });
    }

    return (
        <form onSubmit={submit} className="bg-lp-surface-container-low rounded-xl border border-lp-outline-variant p-6 space-y-4">
            <h3 className="font-playfair text-xl font-semibold text-lp-on-surface flex items-center gap-2">
                <Send className="h-5 w-5 text-lp-primary" />
                Kirim Inquiry
            </h3>

            {eventPlans.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-lp-on-surface mb-1">Lampirkan Rencana Acara (opsional)</label>
                    <select
                        value={data.event_plan_id}
                        onChange={e => setData('event_plan_id', e.target.value)}
                        className="w-full rounded-lg border border-lp-outline-variant bg-lp-surface px-3 py-2 text-sm text-lp-on-surface focus:outline-none focus:ring-2 focus:ring-lp-primary"
                    >
                        <option value="">– Tidak ada –</option>
                        {eventPlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-lp-on-surface mb-1">Jenis Acara *</label>
                    <input
                        value={data.event_type}
                        onChange={e => setData('event_type', e.target.value)}
                        placeholder="Pernikahan, Seminar, dll."
                        className="w-full rounded-lg border border-lp-outline-variant bg-lp-surface px-3 py-2 text-sm text-lp-on-surface placeholder:text-lp-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-lp-primary"
                    />
                    {errors.event_type && <p className="text-xs text-red-600 mt-1">{errors.event_type}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-lp-on-surface mb-1">Tanggal Acara</label>
                    <input
                        type="date"
                        value={data.event_date}
                        onChange={e => setData('event_date', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm text-lp-on-surface focus:outline-none focus:ring-2 focus:ring-lp-primary ${dateBlocked ? 'border-red-400 bg-red-50' : 'border-lp-outline-variant bg-lp-surface'}`}
                    />
                    {dateBlocked && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Vendor tidak tersedia pada tanggal ini. Silakan pilih tanggal lain.</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-lp-on-surface mb-1">Pesan *</label>
                <textarea
                    rows={4}
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    placeholder="Ceritakan kebutuhan acara Anda..."
                    className="w-full rounded-lg border border-lp-outline-variant bg-lp-surface px-3 py-2 text-sm text-lp-on-surface placeholder:text-lp-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-lp-primary resize-none"
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
            </div>

            <button
                type="submit"
                disabled={processing || dateBlocked}
                className="bg-lp-primary text-lp-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? 'Mengirim...' : 'Kirim Inquiry'}
            </button>
        </form>
    );
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
    const cls = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`${cls} ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-lp-on-surface-variant/30'}`} />
            ))}
        </div>
    );
}

function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-medium text-lp-on-surface text-sm">{t.user.name}</p>
                    <p className="text-xs text-lp-on-surface-variant mt-0.5">
                        {t.published_at ? new Date(t.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : ''}
                    </p>
                </div>
                <StarRow rating={t.rating} />
            </div>
            <p className="text-sm text-lp-on-surface-variant leading-relaxed">{t.body}</p>
        </div>
    );
}

function InteractiveStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(s)}
                    className="focus:outline-none"
                >
                    <Star className={`h-7 w-7 transition-colors ${s <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-lp-on-surface-variant/30'}`} />
                </button>
            ))}
        </div>
    );
}

function TestimonialForm({ brandId, brandName }: { brandId: number; brandName: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        brand_id: brandId,
        rating: 0,
        body: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/testimonials', {
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="bg-lp-surface-container-low rounded-xl border border-lp-outline-variant p-6 space-y-4">
            <h3 className="font-playfair text-lg font-semibold text-lp-on-surface">Tulis Testimoni</h3>

            <div>
                <label className="block text-sm font-medium text-lp-on-surface mb-2">Rating</label>
                <InteractiveStars value={data.rating} onChange={v => setData('rating', v)} />
                {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-lp-on-surface mb-1">Pengalaman Anda</label>
                <textarea
                    rows={4}
                    value={data.body}
                    onChange={e => setData('body', e.target.value)}
                    placeholder={`Ceritakan pengalaman Anda bersama ${brandName}...`}
                    className="w-full rounded-lg border border-lp-outline-variant bg-lp-surface px-3 py-2 text-sm text-lp-on-surface placeholder:text-lp-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-lp-primary resize-none"
                />
                {errors.body && <p className="text-xs text-red-600 mt-1">{errors.body}</p>}
            </div>

            <button
                type="submit"
                disabled={processing || data.rating === 0}
                className="bg-lp-primary text-lp-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? 'Mengirim...' : 'Kirim Testimoni'}
            </button>
            <p className="text-xs text-lp-on-surface-variant">Testimoni akan ditampilkan setelah disetujui vendor.</p>
        </form>
    );
}

function AddToPlanDropdown({ packageId, plans }: { packageId: number; plans: EventPlanSummary[] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    function add(planId: number) {
        router.post(`/event-plans/${planId}/items`, { brand_package_id: packageId }, { preserveScroll: true });
        setOpen(false);
    }

    if (plans.length === 0) {
        return (
            <Link
                href="/event-plans"
                className="w-full border border-lp-primary text-lp-primary py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-lp-surface-container-low transition-colors"
            >
                <CalendarPlus className="h-3.5 w-3.5" />
                Buat rencana dulu
            </Link>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full border border-lp-primary text-lp-primary py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-lp-surface-container-low transition-colors"
            >
                <CalendarPlus className="h-3.5 w-3.5" />
                Tambah ke Rencana
            </button>
            {open && (
                <div className="absolute bottom-full mb-1 left-0 right-0 rounded-lg border border-lp-outline-variant bg-lp-surface shadow-lg z-10 py-1 max-h-40 overflow-y-auto">
                    {plans.map(plan => (
                        <button
                            key={plan.id}
                            onClick={() => add(plan.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-lp-surface-container text-lp-on-surface truncate"
                        >
                            {plan.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function PackageCard({ pkg, whatsapp, slug, eventPlans }: { pkg: BrandPackage; whatsapp: string; slug: string; eventPlans: EventPlanSummary[] }) {
    const message = `Halo, saya tertarik dengan paket ${pkg.name}. Boleh saya tahu detail lebih lanjut?`;
    const waHref  = whatsappUrl(whatsapp, message);

    if (pkg.is_featured) {
        return (
            <div className="bg-lp-surface-container-lowest rounded-xl border-2 border-lp-primary shadow-[0_8px_30px_rgba(18,67,65,0.16)] overflow-hidden flex flex-col h-full">
                {pkg.cover_image ? (
                    <img
                        src={`/storage/${pkg.cover_image}`}
                        alt={pkg.name}
                        className="w-full aspect-[16/9] object-cover"
                    />
                ) : (
                    <div className="w-full aspect-[16/9] bg-lp-surface-container flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-lp-on-surface-variant opacity-40" />
                    </div>
                )}
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
                <div className="px-6 pb-6 mt-auto pt-4 space-y-2">
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
                    {eventPlans !== undefined && (
                        <AddToPlanDropdown packageId={pkg.id} plans={eventPlans} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)] overflow-hidden hover:shadow-[0_8px_30px_rgba(18,67,65,0.12)] transition-shadow flex flex-col h-full">
            {pkg.cover_image ? (
                <img
                    src={`/storage/${pkg.cover_image}`}
                    alt={pkg.name}
                    className="w-full aspect-[16/9] object-cover"
                />
            ) : (
                <div className="w-full aspect-[16/9] bg-lp-surface-container flex items-center justify-center">
                    <ImageOff className="h-8 w-8 text-lp-on-surface-variant opacity-40" />
                </div>
            )}
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
            <div className="px-6 pb-6 border-t border-lp-outline-variant pt-4 mt-auto space-y-2">
                <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsapp(slug)}
                    className="w-full border border-lp-primary text-lp-primary py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-lp-surface-container-low transition-colors"
                >
                    Tanyakan
                </a>
                {eventPlans !== undefined && (
                    <AddToPlanDropdown packageId={pkg.id} plans={eventPlans} />
                )}
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

export default function BrandDetailPage({ brand, testimonials, avgRating, reviewsCount, userHasTestimonial, userEventPlans, unavailableDates }: Props) {
    const { auth } = usePage().props as { auth?: AuthProps };
    const isLoggedIn = !!auth?.user;
    const hasWhatsApp = !!brand.whatsapp_number;
    const plansForCard = isLoggedIn ? userEventPlans : undefined;

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
                                {brand.is_verified && (
                                    <span className="inline-flex items-center gap-1 bg-lp-primary/10 text-lp-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Terverifikasi
                                    </span>
                                )}
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
                        <Link href="/" className="inline-flex items-center gap-2 text-lp-secondary hover:text-lp-primary text-sm font-semibold transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Beranda
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
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-5 bg-lp-surface-container-low rounded-xl border border-lp-outline-variant">
                                    <MapPin className="h-5 w-5 text-lp-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-lp-on-surface uppercase tracking-wider mb-1">Lokasi</p>
                                        {!isMapsEmbed(brand.address) && (
                                            <p className="text-lp-on-surface-variant text-sm">{brand.address}</p>
                                        )}
                                    </div>
                                </div>
                                {isMapsEmbed(brand.address) && (
                                    <iframe
                                        src={brand.address}
                                        className="w-full h-64 rounded-lg border border-lp-outline-variant"
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Lokasi ${brand.name}`}
                                    />
                                )}
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
                                <PackageCard key={pkg.id} pkg={pkg} whatsapp={brand.whatsapp_number ?? ''} slug={brand.slug} eventPlans={plansForCard!} />
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

            {/* Inquiry form (for logged-in customers) */}
            {isLoggedIn && (
                <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-14">
                    <InquiryForm brandId={brand.id} eventPlans={userEventPlans} unavailableDates={unavailableDates} />
                </section>
            )}

            {/* Testimonials */}
            <section className="bg-lp-surface-container-low py-14">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface">Testimoni Pilihan</h2>
                            {avgRating !== null && (
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRow rating={Math.round(avgRating)} size="md" />
                                    <span className="font-playfair text-2xl font-bold text-lp-primary">{avgRating.toFixed(1)}</span>
                                    <span className="text-lp-on-surface-variant text-sm">dari {reviewsCount} ulasan</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* List */}
                        <div className="space-y-4">
                            {testimonials.length === 0 ? (
                                <p className="text-lp-on-surface-variant italic text-sm">Belum ada testimoni untuk brand ini.</p>
                            ) : (
                                testimonials.map(t => <TestimonialCard key={t.id} t={t} />)
                            )}
                        </div>

                        {/* Form or status */}
                        <div>
                            {!isLoggedIn ? (
                                <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-6 text-center">
                                    <p className="text-lp-on-surface-variant text-sm mb-3">Masuk untuk menulis testimoni.</p>
                                    <Link
                                        href="/login"
                                        className="inline-block bg-lp-primary text-lp-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            ) : userHasTestimonial ? (
                                <div className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-6 flex items-center gap-3">
                                    <BadgeCheck className="h-5 w-5 text-lp-primary flex-shrink-0" />
                                    <p className="text-sm text-lp-on-surface-variant">Anda sudah menulis testimoni untuk brand ini.</p>
                                </div>
                            ) : (
                                <TestimonialForm brandId={brand.id} brandName={brand.name} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
}
