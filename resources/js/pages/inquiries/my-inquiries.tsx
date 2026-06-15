import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, SendHorizontal } from 'lucide-react';

interface Brand {
    id: number;
    name: string;
    slug: string;
}

interface Inquiry {
    id: number;
    event_type: string;
    event_date: string | null;
    status: 'pending' | 'read' | 'responded' | 'closed';
    vendor_response: string | null;
    created_at: string;
    brand: Brand;
}

interface Props {
    inquiries: {
        data: Inquiry[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inquiry Saya', href: '/my-inquiries' },
];

const statusLabel: Record<Inquiry['status'], string> = {
    pending: 'Menunggu',
    read: 'Dibaca vendor',
    responded: 'Direspons',
    closed: 'Selesai',
};

const statusColor: Record<Inquiry['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    read: 'bg-blue-100 text-blue-800',
    responded: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-700',
};

export default function MyInquiries({ inquiries }: Props) {
    function closeInquiry(id: number) {
        router.post(`/inquiries/${id}/close`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inquiry Saya" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <SendHorizontal className="h-6 w-6" />
                    Inquiry Saya
                </h1>

                {inquiries.data.length === 0 ? (
                    <div className="rounded-lg border bg-card p-10 text-center space-y-4">
                        <p className="text-muted-foreground">Belum ada inquiry. Temukan vendor dan kirim inquiry pertama Anda.</p>
                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Jelajahi Vendor
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card divide-y">
                        {inquiries.data.map(inq => (
                            <div key={inq.id} className="p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Link href={`/brand/${inq.brand.slug}`} className="font-medium hover:underline text-sm">
                                        {inq.brand.name}
                                    </Link>
                                    <span className={`flex-shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[inq.status]}`}>
                                        {statusLabel[inq.status]}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {inq.event_type}
                                    {inq.event_date ? ` · ${new Date(inq.event_date).toLocaleDateString('id-ID')}` : ''}
                                </p>

                                {/* Vendor response */}
                                {inq.vendor_response && (
                                    <div className="mt-1 text-xs bg-green-50 border border-green-100 rounded p-2.5 text-green-800">
                                        <span className="font-semibold block mb-0.5">Respons vendor:</span>
                                        <p className="leading-relaxed">{inq.vendor_response}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <p className="text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString('id-ID')}</p>
                                    {inq.status === 'responded' && (
                                        <button
                                            onClick={() => closeInquiry(inq.id)}
                                            className="text-xs font-semibold text-primary hover:underline"
                                        >
                                            Tandai Selesai
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {inquiries.data.length > 0 && (
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <Link href="/explore" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" /> Jelajahi lebih banyak vendor
                        </Link>
                        {inquiries.links && (
                            <div className="flex gap-1">
                                {inquiries.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded text-sm border ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
