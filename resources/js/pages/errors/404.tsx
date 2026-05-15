import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brands',
        href: '/brands',
    },
];

export default function BrandPage() {
    const user = usePage<SharedData>().props.auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />

            <div className="space-y-4 p-4">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Brand not found</h1>
                    <p className="mt-2 text-gray-600">
                        The brand you are looking for does not exist or has been
                        deleted.
                    </p>
                    <Link href="/brands">
                        <Button className="mt-4">Back to Brands</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
