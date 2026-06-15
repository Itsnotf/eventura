import { BrandCard, type BrandWithStats } from '@/components/landing/brand-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Heart } from 'lucide-react';

interface Props {
    brands: BrandWithStats[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Favorit', href: '/favorites' },
];

export default function FavoritesPage({ brands }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brand Favorit" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                    <h1 className="text-2xl font-semibold">Brand Favorit</h1>
                </div>

                {brands.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <Heart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground">Belum ada brand yang Anda simpan sebagai favorit.</p>
                        <a href="/explore" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                            Jelajahi brand →
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brands.map(brand => (
                            <BrandCard key={brand.id} brand={brand} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
