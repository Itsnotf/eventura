import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}


import { usePage } from "@inertiajs/react";
import { Permission } from '@/types';

type AuthProps = {
    permissions?: Permission[];
    roles?: string[];
};

export default function hasAnyPermission(permissions: string[]) {
    const { auth } = usePage().props as { auth?: AuthProps };

    if (!auth || !auth.permissions) return false;

    const allPermissions: string[] = auth.permissions.map((p: Permission) => p.name);
    return permissions.some(p => allPermissions.includes(p));
}

export function useRole() {
    const { auth } = usePage().props as { auth?: AuthProps };
    const roles = auth?.roles ?? [];

    return {
        isAdmin:  roles.includes('admin'),
        isVendor: roles.includes('vendor'),
        isUser:   roles.includes('user'),
        hasRole:  (role: string) => roles.includes(role),
    };
}

export const isMapsEmbed = (v?: string | null): boolean =>
    !!v && v.startsWith('https://www.google.com/maps/embed');