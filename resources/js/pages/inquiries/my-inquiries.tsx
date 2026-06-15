import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { SendHorizontal } from 'lucide-react';

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
    vendor_note: string | null;
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inquiry Saya" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <SendHorizontal className="h-6 w-6" />
                    Inquiry Saya
                </h1>

                <div className="rounded-lg border bg-card divide-y">
                    {inquiries.data.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground">
                            Belum ada inquiry. Kunjungi halaman brand dan kirim inquiry.
                        </div>
                    )}
                    {inquiries.data.map(inq => (
                        <div key={inq.id} className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                                <Link href={`/brand/${inq.brand.slug}`} className="font-medium hover:underline text-sm">
                                    {inq.brand.name}
                                </Link>
                                <span className={`flex-shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[inq.status]}`}>
                                    {statusLabel[inq.status]}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{inq.event_type}
                                {inq.event_date ? ` · ${new Date(inq.event_date).toLocaleDateString('id-ID')}` : ''}
                            </p>
                            {inq.vendor_note && (
                                <div className="mt-1 text-xs bg-muted rounded p-2 text-muted-foreground">
                                    <span className="font-medium">Catatan vendor:</span> {inq.vendor_note}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground self-end">{new Date(inq.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                    ))}
                </div>

                {inquiries.links && (
                    <div className="flex gap-1 justify-center">
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
        </AppLayout>
    );
}
