import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Inbox } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Inquiry {
    id: number;
    user_id: number;
    event_type: string;
    event_date: string | null;
    message: string;
    status: 'pending' | 'read' | 'responded' | 'closed';
    created_at: string;
    user: Customer;
}

interface Props {
    inquiries: {
        data: Inquiry[];
        links: { url: string | null; label: string; active: boolean }[];
    };
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

export default function InquiriesIndex({ inquiries, flash }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inquiry Masuk" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <Inbox className="h-6 w-6" />
                    Inquiry Masuk
                </h1>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="rounded-lg border bg-card divide-y">
                    {inquiries.data.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground">Belum ada inquiry yang masuk.</div>
                    )}
                    {inquiries.data.map(inq => (
                        <Link key={inq.id} href={`/inquiries/${inq.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-4">
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="font-medium text-sm truncate">{inq.user.name}</p>
                                    <span className={`flex-shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[inq.status]}`}>
                                        {statusLabel[inq.status]}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{inq.event_type}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{inq.message}</p>
                            </div>
                            <div className="text-xs text-muted-foreground flex-shrink-0">
                                {new Date(inq.created_at).toLocaleDateString('id-ID')}
                            </div>
                        </Link>
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
