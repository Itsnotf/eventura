import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useRole } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarCheck,
    CalendarDays,
    ClipboardList,
    Folder,
    Heart,
    KeyIcon,
    LayoutGrid,
    MessageSquare,
    Settings2,
    ShieldCheck,
    Star,
    User,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

// Admin-only navigation
const adminUserMgmt: NavItem[] = [
    { title: 'Users',       href: '/users',  icon: User,   permissions: ['users index'] },
    { title: 'Roles',       href: '/roles',  icon: KeyIcon, permissions: ['roles index'] },
];

const adminBrandMgmt: NavItem[] = [
    { title: 'Brands',            href: '/brands',               icon: BookOpen, permissions: ['brands index'] },
    { title: 'Vendor Applications', href: '/vendor-applications', icon: ClipboardList, permissions: ['vendor applications index'] },
    { title: 'Kategori Layanan',  href: '/service-categories',   icon: Settings2, permissions: ['service categories index'] },
];

// Vendor-only navigation
const vendorBrandItems: NavItem[] = [
    { title: 'Brand Saya',    href: '/brands',            icon: BookOpen,       permissions: ['brands index'] },
    { title: 'Paket',         href: '/brand-packages',    icon: Folder,         permissions: ['brands packages index'] },
    { title: 'Portofolio',    href: '/brand-portfolios',  icon: Star,           permissions: ['brands portfolios index'] },
    { title: 'Testimoni',     href: '/testimonials',      icon: MessageSquare,  permissions: ['testimonials index'] },
    { title: 'Inquiry / Lead', href: '/inquiries',        icon: ClipboardList,  permissions: ['inquiries index'] },
    { title: 'Ketersediaan',  href: '/availability',      icon: CalendarCheck,  permissions: ['availability manage'] },
];

// Customer-only navigation
const customerItems: NavItem[] = [
    { title: 'Favorit',       href: '/favorites',   icon: Heart,         permissions: ['favorites index'] },
    { title: 'Rencana Acara', href: '/event-plans', icon: CalendarDays,  permissions: ['event plans index'] },
    { title: 'Inquiry Saya',  href: '/my-inquiries', icon: MessageSquare, permissions: ['inquiries create'] },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { isAdmin, isVendor, isUser } = useRole();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain section="Platform" items={mainNavItems} />

                {isAdmin && (
                    <>
                        <NavMain section="User Management" items={adminUserMgmt} />
                        <NavMain section="Brand Management" items={adminBrandMgmt} />
                    </>
                )}

                {isVendor && (
                    <NavMain section="Brand Saya" items={vendorBrandItems} />
                )}

                {isUser && (
                    <NavMain section="Aktivitas Saya" items={customerItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
