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

/**
 * Ekstrak label tempat (nama/alamat singkat) dari Google Maps embed URL.
 * Best-effort: mengembalikan null bila URL hanya berisi pin koordinat.
 */
export const extractMapsPlaceLabel = (embedUrl?: string | null): string | null => {
    if (!embedUrl || !isMapsEmbed(embedUrl)) return null;
    const matches = [...embedUrl.matchAll(/!2s([^!]+)/g)].map((m) => m[1]);
    // Segmen !2s paling akhir biasanya kode negara (mis. "id"); label tempat ada sebelumnya.
    for (const raw of matches.reverse()) {
        try {
            const decoded = decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
            if (!decoded) continue;
            if (/^0x[0-9a-f]/i.test(decoded)) continue; // place-id heksadesimal
            if (/^[-\d.,\s°]+$/.test(decoded)) continue; // koordinat murni
            if (/^[a-z]{2}$/i.test(decoded)) continue; // kode bahasa/negara
            return decoded;
        } catch {
            continue;
        }
    }
    return null;
};