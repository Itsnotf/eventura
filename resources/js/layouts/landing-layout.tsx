import AppLogoIcon from '@/components/app-logo-icon';
import { FlashToaster } from '@/components/flash-toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import { useRole } from '@/lib/utils';
import { login, logout, register } from '@/routes';
import { edit } from '@/routes/profile';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ClipboardCheck,
    Heart,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Store,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

function NavItem({
    href,
    children,
    variant = 'desktop',
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    variant?: 'desktop' | 'mobile';
    onClick?: () => void;
}) {
    const { url } = usePage();
    const path = url.split('?')[0];
    const active = href === '/' ? path === '/' : path.startsWith(href);

    const className =
        variant === 'desktop'
            ? `text-sm font-semibold tracking-wide transition-colors ${
                  active ? 'text-lp-primary' : 'text-lp-on-surface-variant hover:text-lp-primary'
              }`
            : `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                      ? 'bg-lp-surface-container-low text-lp-primary'
                      : 'text-lp-on-surface hover:bg-lp-surface-container-low'
              }`;

    return (
        <Link href={href} aria-current={active ? 'page' : undefined} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}

function LandingNav() {
    const { auth, name } = usePage<SharedData>().props;
    const { isAdmin, isVendor, isUser } = useRole();
    const getInitials = useInitials();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        router.flushAll();
    };

    const mobileSectionLabel =
        'text-xs uppercase tracking-wider text-lp-on-surface-variant px-4 pt-3 pb-1 font-semibold select-none';
    const mobileItemClass =
        'flex items-center gap-3 px-4 py-3 text-lp-on-surface text-sm font-medium rounded-lg hover:bg-lp-surface-container-low transition-colors';

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-lp-surface/90 backdrop-blur-md border-b border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.08)]">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto px-4 md:px-12 h-20">
                    {/* Logo + nav links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 font-playfair text-2xl font-semibold text-lp-primary">
                            <AppLogoIcon tone="teal" className="h-8 w-8" />
                            {name}
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <NavItem href="/">Beranda</NavItem>
                            <NavItem href="/portfolio">Portfolio</NavItem>
                            {(!auth?.user || isUser) && <NavItem href="/join">Daftarkan Brand</NavItem>}
                            <NavItem href="/tentang-kami">Tentang Kami</NavItem>
                            <NavItem href="/kontak">Kontak</NavItem>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
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
                            <div className="flex items-center gap-1">
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

                                {/* Avatar dropdown trigger */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded-full hover:bg-lp-surface-container-low transition-colors outline-none ml-1">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="bg-lp-primary text-lp-on-primary text-sm font-semibold">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
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
                                                <Link href="/dashboard" className="flex items-center w-full">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            {isUser && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/my-inquiries" className="flex items-center w-full">
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Inquiry Saya
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            {isVendor && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/brands" className="flex items-center w-full">
                                                            <Store className="mr-2 h-4 w-4" />
                                                            Brand Saya
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/inquiries" className="flex items-center w-full">
                                                            <Inbox className="mr-2 h-4 w-4" />
                                                            Inquiry / Lead
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {isAdmin && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/brands" className="flex items-center w-full">
                                                            <Store className="mr-2 h-4 w-4" />
                                                            Brands
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/vendor-applications" className="flex items-center w-full">
                                                            <ClipboardCheck className="mr-2 h-4 w-4" />
                                                            Vendor Applications
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={edit()} className="flex items-center w-full">
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
                                                className="flex items-center w-full"
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
                        className="md:hidden w-11 h-11 flex items-center justify-center text-lp-on-surface rounded-lg hover:bg-lp-surface-container-low active:bg-lp-surface-container transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        aria-expanded={open}
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
                    <div className="flex flex-col p-3 gap-0.5">
                        {/* ── Navigasi ── */}
                        <p className={mobileSectionLabel}>Menu</p>
                        <NavItem href="/" variant="mobile" onClick={() => setOpen(false)}>Beranda</NavItem>
                        <NavItem href="/portfolio" variant="mobile" onClick={() => setOpen(false)}>Portfolio</NavItem>
                        {(!auth?.user || isUser) && (
                            <NavItem href="/join" variant="mobile" onClick={() => setOpen(false)}>Daftarkan Brand</NavItem>
                        )}
                        <NavItem href="/tentang-kami" variant="mobile" onClick={() => setOpen(false)}>Tentang Kami</NavItem>
                        <NavItem href="/kontak" variant="mobile" onClick={() => setOpen(false)}>Kontak</NavItem>

                        <hr className="border-lp-outline-variant my-2" />

                        {/* ── Auth ── */}
                        {!auth?.user ? (
                            <div className="flex flex-col gap-2 px-1">
                                <Link
                                    href={login()}
                                    className="py-3 px-4 text-lp-primary text-sm font-semibold border border-lp-primary rounded-lg text-center"
                                    onClick={() => setOpen(false)}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-lp-primary text-lp-on-primary py-3 px-4 rounded-lg text-sm font-semibold text-center"
                                    onClick={() => setOpen(false)}
                                >
                                    Daftar
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Akun header */}
                                <div className="flex items-center gap-3 bg-lp-surface-container-low rounded-lg p-3 mb-1">
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-lp-primary text-lp-on-primary font-semibold">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-lp-on-surface text-sm truncate">{auth.user.name}</p>
                                        <p className="text-lp-on-surface-variant text-xs truncate">{auth.user.email}</p>
                                    </div>
                                </div>

                                {/* Aksi cepat — customer only */}
                                {isUser && (
                                    <>
                                        <Link
                                            href="/favorites"
                                            className={mobileItemClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="relative">
                                                <Heart className="h-4 w-4" />
                                                {(auth.favorite_brand_ids?.length ?? 0) > 0 && (
                                                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-lp-primary text-lp-on-primary rounded-full text-[9px] flex items-center justify-center font-bold">
                                                        {auth.favorite_brand_ids.length}
                                                    </span>
                                                )}
                                            </span>
                                            Favorit
                                        </Link>
                                        <Link
                                            href="/event-plans"
                                            className={mobileItemClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            <CalendarDays className="h-4 w-4" />
                                            Rencana Acara
                                        </Link>
                                    </>
                                )}

                                {/* Akun section */}
                                <p className={mobileSectionLabel}>Akun</p>
                                <Link href="/dashboard" className={mobileItemClass} onClick={() => setOpen(false)}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                {isUser && (
                                    <Link href="/my-inquiries" className={mobileItemClass} onClick={() => setOpen(false)}>
                                        <MessageSquare className="h-4 w-4" />
                                        Inquiry Saya
                                    </Link>
                                )}
                                {isVendor && (
                                    <>
                                        <Link href="/brands" className={mobileItemClass} onClick={() => setOpen(false)}>
                                            <Store className="h-4 w-4" />
                                            Brand Saya
                                        </Link>
                                        <Link href="/inquiries" className={mobileItemClass} onClick={() => setOpen(false)}>
                                            <Inbox className="h-4 w-4" />
                                            Inquiry / Lead
                                        </Link>
                                    </>
                                )}
                                {isAdmin && (
                                    <>
                                        <Link href="/brands" className={mobileItemClass} onClick={() => setOpen(false)}>
                                            <Store className="h-4 w-4" />
                                            Brands
                                        </Link>
                                        <Link href="/vendor-applications" className={mobileItemClass} onClick={() => setOpen(false)}>
                                            <ClipboardCheck className="h-4 w-4" />
                                            Vendor Applications
                                        </Link>
                                    </>
                                )}
                                <Link href={edit()} className={mobileItemClass} onClick={() => setOpen(false)}>
                                    <Settings className="h-4 w-4" />
                                    Pengaturan
                                </Link>

                                <hr className="border-lp-outline-variant my-2" />

                                <Link
                                    href={logout()}
                                    as="button"
                                    className="flex items-center gap-3 px-4 py-3 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors text-left"
                                    onClick={() => {
                                        handleLogout();
                                        setOpen(false);
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
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
                            Platform terpercaya untuk menemukan Event Organizer, Wedding Organizer, Content Creator,
                            dan Catering profesional di Palembang. Wujudkan acara impian Anda dengan mudah.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lp-on-surface font-semibold text-xs uppercase tracking-widest mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Beranda</Link></li>
                            <li><Link href="/portfolio" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Portfolio</Link></li>
                            <li><Link href="/join" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Daftarkan Brand</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lp-on-surface font-semibold text-xs uppercase tracking-widest mb-4">Perusahaan</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/tentang-kami" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/kontak" className="text-lp-on-surface-variant hover:text-lp-primary text-sm transition-colors">Kontak</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-lp-outline-variant mt-10 pt-6">
                    <p className="text-lp-on-surface-variant text-xs text-center">
                        © {new Date().getFullYear()} {name}. Platform Marketplace Vendor Acara Palembang.
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
