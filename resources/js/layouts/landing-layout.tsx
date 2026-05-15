import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const APP_NAME = 'Eventura';

function LandingNav() {
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-lp-surface/90 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)]">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto px-4 md:px-12 h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-playfair text-2xl font-semibold text-lp-primary">
                            {APP_NAME}
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-lp-on-surface-variant hover:text-lp-primary transition-colors text-sm font-semibold tracking-wide">
                                Beranda
                            </Link>
                            <Link href="/explore" className="text-lp-on-surface-variant hover:text-lp-primary transition-colors text-sm font-semibold tracking-wide">
                                Explore Brand
                            </Link>
                            <Link href="/portfolio" className="text-lp-on-surface-variant hover:text-lp-primary transition-colors text-sm font-semibold tracking-wide">
                                Portfolio
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="bg-lp-primary text-lp-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/join"
                                className="bg-lp-primary text-lp-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Daftarkan Brand
                            </Link>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 text-lp-on-surface rounded-lg hover:bg-lp-surface-container-low transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {open && (
                <div className="fixed inset-0 top-20 z-40 bg-lp-surface border-t border-lp-outline-variant md:hidden" style={{zIndex: 999}}>
                    <div className="flex flex-col p-4 gap-1">
                        <Link href="/" className="py-3 px-4 text-lp-on-surface text-sm font-semibold rounded-lg hover:bg-lp-surface-container-low transition-colors" onClick={() => setOpen(false)}>
                            Beranda
                        </Link>
                        <Link href="/explore" className="py-3 px-4 text-lp-on-surface text-sm font-semibold rounded-lg hover:bg-lp-surface-container-low transition-colors" onClick={() => setOpen(false)}>
                            Explore Brand
                        </Link>
                        <Link href="/portfolio" className="py-3 px-4 text-lp-on-surface text-sm font-semibold rounded-lg hover:bg-lp-surface-container-low transition-colors" onClick={() => setOpen(false)}>
                            Portfolio
                        </Link>
                        <hr className="border-lp-outline-variant my-2" />
                        {auth?.user ? (
                            <Link href="/dashboard" className="py-3 px-4 text-lp-primary text-sm font-semibold" onClick={() => setOpen(false)}>
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/join"
                                className="bg-lp-primary text-lp-on-primary py-3 px-4 rounded-lg text-sm font-semibold text-center mt-1"
                                onClick={() => setOpen(false)}
                            >
                                Daftarkan Brand
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function LandingFooter() {
    return (
        <footer className="bg-lp-surface-container border-t border-lp-outline-variant">
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="font-playfair text-2xl font-semibold text-lp-primary mb-3">{APP_NAME}</h2>
                        <p className="text-lp-on-surface-variant text-sm leading-relaxed max-w-sm">
                            Platform terpercaya untuk menemukan Event Organizer dan Wedding Organizer profesional di Indonesia. Wujudkan acara impian Anda dengan mudah.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lp-on-surface font-semibold text-xs uppercase tracking-widest mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Beranda</Link></li>
                            <li><Link href="/explore" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Explore Brand</Link></li>
                            <li><Link href="/portfolio" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Portfolio</Link></li>
                            <li><Link href="/join" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Daftarkan Brand</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lp-on-surface font-semibold text-xs uppercase tracking-widest mb-4">Mitra</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/join" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Cara Mendaftar</Link></li>
                            <li><Link href="/join#requirements" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Persyaratan</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-lp-outline-variant mt-10 pt-6">
                    <p className="text-lp-on-surface-variant text-xs text-center">
                        © {new Date().getFullYear()} {APP_NAME}. Platform Marketplace EO & WO Indonesia.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-lp-surface font-manrope">
            <LandingNav />
            <main className="pt-20 flex-grow">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
