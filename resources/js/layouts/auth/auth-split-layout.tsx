import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-dvh lg:grid-cols-2">
            {/* Left panel — branding, hidden on mobile */}
            <div className="relative hidden lg:flex flex-col bg-lp-primary p-10 text-lp-on-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-lp-primary via-teal-700 to-teal-900" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-lg font-playfair font-semibold text-white"
                >
                    <AppLogoIcon className="size-8 fill-current text-white" />
                    {name}
                </Link>
                <div className="relative z-20 mt-auto space-y-4">
                    <p className="font-playfair text-2xl font-semibold text-white leading-snug">
                        Wujudkan Acara Impian Anda<br />di Palembang
                    </p>
                    <p className="text-teal-100 text-sm leading-relaxed max-w-xs">
                        Temukan Event Organizer dan Wedding Organizer profesional terpercaya di Palembang dan sekitarnya — semua dalam satu platform.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex items-center justify-center bg-lp-surface px-8 py-12 sm:px-12">
                <div className="w-full max-w-sm space-y-6">
                    {/* Logo on mobile */}
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-lp-primary sm:h-12" />
                    </Link>

                    <div className="space-y-1">
                        <h1 className="font-playfair text-2xl font-bold text-lp-primary">{title}</h1>
                        {description && (
                            <p className="text-sm text-lp-on-surface-variant font-manrope">{description}</p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
