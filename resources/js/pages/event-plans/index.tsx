import { ConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ServiceCategory {
    id: number;
    name: string;
}

interface PlanItem {
    id: number;
    service_category_id: number | null;
    price_start_snapshot: number;
    price_end_snapshot: number;
    package_name_snapshot: string;
    brand_name_snapshot: string;
    serviceCategory?: ServiceCategory | null;
}

interface EventPlan {
    id: number;
    name: string;
    event_date: string | null;
    event_type: string | null;
    items: PlanItem[];
    created_at: string;
}

interface Props {
    plans: EventPlan[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rencana Acara', href: '/event-plans' },
];

function formatPrice(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function formatPriceRange(start: number, end: number) {
    if (end > start) return `${formatPrice(start)} – ${formatPrice(end)}`;
    return formatPrice(start);
}

function CreatePlanForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        event_date: '',
        event_type: '',
        notes: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/event-plans', { onSuccess: () => reset() });
    }

    return (
        <form onSubmit={submit} className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Buat Rencana Baru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nama Rencana *</label>
                    <input
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Pernikahan Budi & Sari"
                        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tanggal Acara</label>
                    <input
                        type="date"
                        value={data.event_date}
                        onChange={e => setData('event_date', e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Jenis Acara</label>
                    <input
                        value={data.event_type}
                        onChange={e => setData('event_type', e.target.value)}
                        placeholder="Pernikahan, Seminar, dll."
                        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={processing}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
                {processing ? 'Membuat...' : 'Buat Rencana'}
            </button>
        </form>
    );
}

export default function EventPlansIndex({ plans, flash }: Props) {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    function doDelete() {
        if (confirmDelete !== null) {
            router.delete(`/event-plans/${confirmDelete}`);
            setConfirmDelete(null);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rencana Acara" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <CalendarDays className="h-6 w-6" />
                    Rencana Acara Saya
                </h1>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                <CreatePlanForm />

                {plans.length === 0 ? (
                    <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
                        Belum ada rencana acara. Buat rencana baru di atas.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map(plan => {
                            const totalStart = plan.items.reduce((s, i) => s + i.price_start_snapshot, 0);
                            const totalEnd = plan.items.reduce((s, i) => s + i.price_end_snapshot, 0);
                            return (
                                <div key={plan.id} className="rounded-lg border bg-card p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <Link href={`/event-plans/${plan.id}`} className="font-semibold hover:underline text-base">
                                                {plan.name}
                                            </Link>
                                            {plan.event_date && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {new Date(plan.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setConfirmDelete(plan.id)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {plan.items.length} paket · estimasi {formatPriceRange(totalStart, totalEnd)}
                                    </div>
                                    <Link href={`/event-plans/${plan.id}`} className="text-xs text-primary font-semibold hover:underline self-end">
                                        Lihat detail →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmDelete !== null}
                title="Hapus rencana acara?"
                description="Semua item dalam rencana ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan."
                confirmLabel="Hapus"
                onConfirm={doDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AppLayout>
    );
}
