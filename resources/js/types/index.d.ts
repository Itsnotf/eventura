import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    roles: string[];
    permissions: Permission[];
    favorite_brand_ids: number[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    permissions?: string[];
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role;
    [key: string]: unknown; // This allows for additional properties...
}

    export interface Permission {
        id: number;
        name: string;
        guard_name: string;
        created_at: string;
        updated_at: string;
        [key: string]: boolean;
    }

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Brand {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    category: ('EO' | 'WO')[];
    logo: string;
    cover_image: string;
    description: string;
    address: string;
    whatsapp_number: string;
    instagram: string | null;
    website: string | null;
    is_active: boolean;
    is_verified: boolean;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    packages?: BrandPackage[];
}


export interface BrandPackage {
    id: number;
    brand_id: number;
    service_category_id: number | null;
    name: string;
    price_start: number;
    price_end: number;
    description: string;
    cover_image: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    brand: Brand;
}

export interface BrandPortfolio {
    id: number;
    brand_id: number;
    deskripsi: string;
    title: string;
    event_type: string;
    event_date: string;
    created_at: string;
    updated_at: string;
    brand : Brand;
    images?: ImagePortfolio[];
}

export interface ImagePortfolio {
    id: number;
    brand_portfolio_id: number;
    image: string;
    created_at: string;
    updated_at: string;
    brandPortfolio?: BrandPortfolio;
}
