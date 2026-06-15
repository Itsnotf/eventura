import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface PlanItem {
    id: number;
    package_name_snapshot: string;
    brand_name_snapshot: string;
    price_snapshot: number;
    serviceCategory?: { id: number; name: string } | null;
}

interface EventPlan {
    id: number;
    name: string;
    items: PlanItem[];
}

interface Inquiry {
    id: number;
    event_type: string;
    event_date: string | null;
    message: string;
    status: 'pending' | 'read' | 'responded' | 'closed';
    vendor_note: string | null;
    created_at: string;
    user: { id: number; name: string; email: string };
    brand: { id: number; name: string };
    eventPlan?: EventPlan | null;
}

interface Props {
    inquiry: Inquiry;
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inquiry Masuk', href: '/inquiries' },
];

const statusOptions = [
    { value: 'pending', label: 'Baru' },
    { value: 'read', label: 'Dibaca' },
    { value: 'responded', label: 'Direspons' },
    { value: 'closed', label: 'Ditutup' },
] as const;

function formatPrice(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export default function InquiryShow({ inquiry, flash }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        status: inquiry.status,
        vendor_note: inquiry.vendor_note ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        patch(`/inquiries/${inquiry.id}/status`);
    }

    const crumbs: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: `Inquiry #${inquiry.id}`, href: `/inquiries/${inquiry.id}` },
    ];

    return (
        <AppLayout breadcrumbs={crumbs}>
            <Head title={`Inquiry dari ${inquiry.user.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <Link href="/inquiries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Inquiry details */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="rounded-lg border bg-card p-6 space-y-3">
                            <h1 className="text-lg font-semibold">Inquiry dari {inquiry.user.name}</h1>
                            <p className="text-xs text-muted-foreground">{inquiry.user.email}</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground text-xs">Jenis Acara</span>
                                    <p className="font-medium">{inquiry.event_type}</p>
                                </div>
                                {inquiry.event_date && (
                                    <div>
                                        <span className="text-muted-foreground text-xs">Tanggal</span>
                                        <p className="font-medium">{new Date(inquiry.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="text-muted-foreground text-xs">Pesan</span>
                                <p className="text-sm mt-1 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                            </div>
                        </div>

                        {/* Attached event plan */}
                        {inquiry.eventPlan && (
                            <div className="rounded-lg border bg-card p-5">
                                <h3 className="font-semibold text-sm mb-3">Rencana Acara: {inquiry.eventPlan.name}</h3>
                                <div className="space-y-2">
                                    {inquiry.eventPlan.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <div>
                                                {item.serviceCategory && <span className="text-xs text-muted-foreground">{item.serviceCategory.name} · </span>}
                                                <span>{item.package_name_snapshot}</span>
                                                <span className="text-muted-foreground ml-1">({item.brand_name_snapshot})</span>
                                            </div>
                                            <span className="font-medium">{formatPrice(item.price_snapshot)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vendor response form */}
                    <div>
                        <form onSubmit={submit} className="rounded-lg border bg-card p-5 space-y-4 sticky top-6">
                            <h3 className="font-semibold text-sm">Update Status</h3>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as typeof data.status)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground">Catatan ke Pelanggan</label>
                                <textarea
                                    rows={4}
                                    value={data.vendor_note}
                                    onChange={e => setData('vendor_note', e.target.value)}
                                    placeholder="Catatan atau respons singkat..."
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
