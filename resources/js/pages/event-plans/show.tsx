import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Package, Trash2 } from 'lucide-react';

interface ServiceCategory {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
}

interface PlanItem {
    id: number;
    service_category_id: number | null;
    price_snapshot: number;
    package_name_snapshot: string;
    brand_name_snapshot: string;
    brand?: Brand;
    serviceCategory?: ServiceCategory | null;
}

interface EventPlan {
    id: number;
    name: string;
    event_date: string | null;
    event_type: string | null;
    notes: string | null;
    items: PlanItem[];
}

interface Props {
    plan: EventPlan;
    totalBudget: number;
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rencana Acara', href: '/event-plans' },
];

function formatPrice(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export default function EventPlanShow({ plan, totalBudget, flash }: Props) {
    const crumbs: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: plan.name, href: `/event-plans/${plan.id}` },
    ];

    function removeItem(itemId: number) {
        if (confirm('Hapus paket ini dari rencana?')) {
            router.delete(`/event-plans/${plan.id}/items/${itemId}`);
        }
    }

    return (
        <AppLayout breadcrumbs={crumbs}>
            <Head title={plan.name} />
            <div className="flex flex-col gap-6 p-6">
                <Link href="/event-plans" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Daftar
                </Link>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                {/* Plan header */}
                <div className="rounded-lg border bg-card p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{plan.name}</h1>
                        {plan.event_type && <p className="text-muted-foreground text-sm mt-0.5">{plan.event_type}</p>}
                        {plan.event_date && (
                            <p className="text-sm mt-1">
                                📅 {new Date(plan.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                        {plan.notes && <p className="text-sm text-muted-foreground mt-2 italic">{plan.notes}</p>}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Estimasi Total</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(totalBudget)}</p>
                        <p className="text-xs text-muted-foreground">{plan.items.length} paket</p>
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-lg border bg-card divide-y">
                    {plan.items.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p>Belum ada paket di rencana ini.</p>
                            <p className="text-xs mt-1">Tambahkan dari halaman detail brand.</p>
                        </div>
                    ) : (
                        plan.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 gap-4">
                                <div className="flex-grow">
                                    {item.serviceCategory && (
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {item.serviceCategory.name}
                                        </p>
                                    )}
                                    <p className="font-medium text-sm">{item.package_name_snapshot}</p>
                                    <p className="text-xs text-muted-foreground">
                                        oleh{' '}
                                        {item.brand ? (
                                            <Link href={`/brand/${item.brand.slug}`} className="hover:underline text-primary">
                                                {item.brand_name_snapshot}
                                            </Link>
                                        ) : item.brand_name_snapshot}
                                    </p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <p className="font-semibold text-sm">{formatPrice(item.price_snapshot)}</p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                        title="Hapus"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    Untuk menambah paket, kunjungi halaman detail brand dan klik "Tambah ke Rencana".
                </p>
            </div>
        </AppLayout>
    );
}
