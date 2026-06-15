import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Archive, ArchiveRestore, ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface PlanItem {
    id: number;
    package_name_snapshot: string;
    brand_name_snapshot: string;
    price_start_snapshot: number;
    price_end_snapshot: number;
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
    vendor_response: string | null;
    responded_at: string | null;
    is_archived: boolean;
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

const statusLabel: Record<Inquiry['status'], string> = {
    pending: 'Baru',
    read: 'Dibaca',
    responded: 'Direspons',
    closed: 'Ditutup',
};

const statusColor: Record<Inquiry['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    read: 'bg-blue-100 text-blue-800',
    responded: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-700',
};

function formatPrice(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function formatPriceRange(start: number, end: number) {
    if (end > start) return `${formatPrice(start)} – ${formatPrice(end)}`;
    return formatPrice(start);
}

export default function InquiryShow({ inquiry, flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        vendor_response: inquiry.vendor_response ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(`/inquiries/${inquiry.id}/respond`);
    }

    function toggleArchive() {
        const route = inquiry.is_archived
            ? `/inquiries/${inquiry.id}/unarchive`
            : `/inquiries/${inquiry.id}/archive`;
        router.post(route);
    }

    const crumbs: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: `Inquiry #${inquiry.id}`, href: `/inquiries/${inquiry.id}` },
    ];

    return (
        <AppLayout breadcrumbs={crumbs}>
            <Head title={`Inquiry dari ${inquiry.user.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <Link href="/inquiries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[inquiry.status]}`}>
                        {statusLabel[inquiry.status]}
                    </span>
                    {inquiry.is_archived && (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                            Diarsipkan
                        </span>
                    )}
                </div>

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
                            <p className="text-xs text-muted-foreground">
                                Diterima: {new Date(inquiry.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </p>
                        </div>

                        {/* Vendor response display (if already responded) */}
                        {inquiry.vendor_response && (
                            <div className="rounded-lg border bg-muted/30 p-5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Respons yang Terkirim</p>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{inquiry.vendor_response}</p>
                                {inquiry.responded_at && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Direspons pada {new Date(inquiry.responded_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                    </p>
                                )}
                            </div>
                        )}

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
                                            <span className="font-medium">{formatPriceRange(item.price_start_snapshot, item.price_end_snapshot)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vendor actions */}
                    <div className="space-y-4">
                        {/* Respond form */}
                        {inquiry.status !== 'closed' && (
                            <form onSubmit={submit} className="rounded-lg border bg-card p-5 space-y-4">
                                <h3 className="font-semibold text-sm">Kirim Balasan</h3>
                                <textarea
                                    rows={5}
                                    value={data.vendor_response}
                                    onChange={e => setData('vendor_response', e.target.value)}
                                    placeholder="Tulis respons untuk pelanggan..."
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                                {errors.vendor_response && <p className="text-xs text-destructive mt-1">{errors.vendor_response}</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Balasan'}
                                </button>
                            </form>
                        )}

                        {/* Archive toggle */}
                        <button
                            onClick={toggleArchive}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            {inquiry.is_archived ? (
                                <><ArchiveRestore className="h-4 w-4" /> Kembalikan ke Inbox</>
                            ) : (
                                <><Archive className="h-4 w-4" /> Arsipkan</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
