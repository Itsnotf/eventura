import { FlashToaster } from '@/components/flash-toaster';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useRole } from '@/lib/utils';
import { login, logout, register } from '@/routes';
import { edit } from '@/routes/profile';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, Heart, LogOut, Menu, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

function LandingNav() {
    const { auth, name } = usePage<SharedData>().props;
    const { isAdmin, isVendor, isUser } = useRole();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        router.flushAll();
    };

    const navLinkClass =
        'text-lp-on-surface-variant hover:text-lp-primary transition-colors text-sm font-semibold tracking-wide';
    const mobileNavLinkClass =
        'py-3 px-4 text-lp-on-surface text-sm font-semibold rounded-lg hover:bg-lp-surface-container-low transition-colors';

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-lp-surface/90 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)]">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto px-4 md:px-12 h-20">
                    {/* Logo + nav links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-playfair text-2xl font-semibold text-lp-primary">
                            {name}
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className={navLinkClass}>Beranda</Link>
                            <Link href="/explore" className={navLinkClass}>Explore Brand</Link>
                            <Link href="/portfolio" className={navLinkClass}>Portfolio</Link>
                            {(!auth?.user || isUser) && (
                                <Link href="/join" className={navLinkClass}>Daftarkan Brand</Link>
                            )}
                            <Link href="/tentang-kami" className={navLinkClass}>Tentang Kami</Link>
                            <Link href="/kontak" className={navLinkClass}>Kontak</Link>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {!auth?.user ? (
                            <>
                                <Link
                                    href={login()}
                                    className="text-lp-primary border border-lp-primary px-5 py-2 rounded-lg text-sm font-semibold hover:bg-lp-surface-container-low transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-lp-primary text-lp-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Daftar
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Quick-access icons — customer only */}
                                {isUser && (
                                    <>
                                        <Link
                                            href="/favorites"
                                            className="relative p-2 text-lp-on-surface-variant hover:text-lp-primary transition-colors rounded-lg hover:bg-lp-surface-container-low"
                                            title="Favorit"
                                        >
                                            <Heart className="h-5 w-5" />
                                            {(auth.favorite_brand_ids?.length ?? 0) > 0 && (
                                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-lp-primary text-lp-on-primary rounded-full text-[10px] flex items-center justify-center font-bold">
                                                    {auth.favorite_brand_ids.length}
                                                </span>
                                            )}
                                        </Link>
                                        <Link
                                            href="/event-plans"
                                            className="p-2 text-lp-on-surface-variant hover:text-lp-primary transition-colors rounded-lg hover:bg-lp-surface-container-low"
                                            title="Rencana Acara"
                                        >
                                            <CalendarDays className="h-5 w-5" />
                                        </Link>
                                    </>
                                )}

                                {/* Profile dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-lp-surface-container-low transition-colors outline-none">
                                            <UserInfo user={auth.user} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <UserInfo user={auth.user} showEmail />
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="block w-full">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            {isUser && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/my-inquiries" className="block w-full">
                                                        Inquiry Saya
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            {isVendor && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/brands" className="block w-full">Brand Saya</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/inquiries" className="block w-full">Inquiry / Lead</Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {isAdmin && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/brands" className="block w-full">Brands</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/vendor-applications" className="block w-full">
                                                            Vendor Applications
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={edit()} className="block w-full">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Pengaturan
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={logout()}
                                                as="button"
                                                className="block w-full"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Keluar
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-lp-on-surface rounded-lg hover:bg-lp-surface-container-low transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div
                    className="fixed inset-0 top-20 z-40 bg-lp-surface border-t border-lp-outline-variant md:hidden overflow-y-auto"
                    style={{ zIndex: 999 }}
                >
                    <div className="flex flex-col p-4 gap-1">
                        <Link href="/" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Beranda</Link>
                        <Link href="/explore" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Explore Brand</Link>
                        <Link href="/portfolio" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Portfolio</Link>
                        {(!auth?.user || isUser) && (
                            <Link href="/join" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Daftarkan Brand</Link>
                        )}
                        <Link href="/tentang-kami" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Tentang Kami</Link>
                        <Link href="/kontak" className={mobileNavLinkClass} onClick={() => setOpen(false)}>Kontak</Link>
                        <hr className="border-lp-outline-variant my-2" />

                        {!auth?.user ? (
                            <>
                                <Link
                                    href={login()}
                                    className="py-3 px-4 text-lp-primary text-sm font-semibold border border-lp-primary rounded-lg text-center"
                                    onClick={() => setOpen(false)}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-lp-primary text-lp-on-primary py-3 px-4 rounded-lg text-sm font-semibold text-center mt-1"
                                    onClick={() => setOpen(false)}
                                >
                                    Daftar
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="px-4 py-2 flex items-center gap-2">
                                    <UserInfo user={auth.user} showEmail />
                                </div>
                                <hr className="border-lp-outline-variant my-1" />
                                {isUser && (
                                    <>
                                        <Link
                                            href="/favorites"
                                            className={mobileNavLinkClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            Favorit{(auth.favorite_brand_ids?.length ?? 0) > 0 ? ` (${auth.favorite_brand_ids.length})` : ''}
                                        </Link>
                                        <Link
                                            href="/event-plans"
                                            className={mobileNavLinkClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            Rencana Acara
                                        </Link>
                                    </>
                                )}
                                <Link href="/dashboard" className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                    Dashboard
                                </Link>
                                {isUser && (
                                    <Link href="/my-inquiries" className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                        Inquiry Saya
                                    </Link>
                                )}
                                {isVendor && (
                                    <>
                                        <Link href="/brands" className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                            Brand Saya
                                        </Link>
                                        <Link href="/inquiries" className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                            Inquiry / Lead
                                        </Link>
                                    </>
                                )}
                                {isAdmin && (
                                    <>
                                        <Link href="/brands" className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                            Brands
                                        </Link>
                                        <Link
                                            href="/vendor-applications"
                                            className={mobileNavLinkClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            Vendor Applications
                                        </Link>
                                    </>
                                )}
                                <Link href={edit()} className={mobileNavLinkClass} onClick={() => setOpen(false)}>
                                    Pengaturan
                                </Link>
                                <Link
                                    href={logout()}
                                    as="button"
                                    className="py-3 px-4 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors text-left"
                                    onClick={() => {
                                        handleLogout();
                                        setOpen(false);
                                    }}
                                >
                                    Keluar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function LandingFooter() {
    const { name } = usePage<SharedData>().props;

    return (
        <footer className="bg-lp-surface-container border-t border-lp-outline-variant">
            <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="font-playfair text-2xl font-semibold text-lp-primary mb-3">{name}</h2>
                        <p className="text-lp-on-surface-variant text-sm leading-relaxed max-w-sm">
                            Platform terpercaya untuk menemukan Event Organizer dan Wedding Organizer profesional di
                            Palembang dan sekitarnya. Wujudkan acara impian Anda dengan mudah.
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
                        <h4 className="text-lp-on-surface font-semibold text-xs uppercase tracking-widest mb-4">Perusahaan</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/tentang-kami" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/kontak" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Kontak</Link></li>
                            <li><Link href="/join" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Daftarkan Brand</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-lp-outline-variant mt-10 pt-6">
                    <p className="text-lp-on-surface-variant text-xs text-center">
                        © {new Date().getFullYear()} {name}. Platform Marketplace EO & WO Palembang.
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
            <main className="pt-20 flex-grow">{children}</main>
            <LandingFooter />
            <Toaster position="top-right" />
            <FlashToaster />
        </div>
    );
}
