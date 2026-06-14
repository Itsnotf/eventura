import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, ThumbsDown, ThumbsUp } from 'lucide-react';

interface Application {
    id: number;
    applicant_name: string;
    email: string;
    phone: string;
    brand_name: string;
    category: string;
    message: string | null;
    document: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_at: string | null;
    created_at: string;
    reviewer?: { name: string } | null;
}

interface Props {
    application: Application;
    documentUrl: string;
    flash?: { success?: string };
}

const STATUS_BADGE: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function VendorApplicationShow({ application, documentUrl, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vendor Applications', href: '/vendor-applications' },
        { title: application.brand_name, href: `/vendor-applications/${application.id}` },
    ];

    function approve() {
        if (confirm(`Setujui aplikasi ${application.brand_name}? Akun vendor dan brand akan dibuat otomatis.`)) {
            router.post(`/vendor-applications/${application.id}/approve`);
        }
    }

    function reject() {
        if (confirm(`Tolak aplikasi ${application.brand_name}?`)) {
            router.post(`/vendor-applications/${application.id}/reject`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Aplikasi — ${application.brand_name}`} />

            <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Link href="/vendor-applications">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Detail Aplikasi</h1>
                    <span className={`ml-auto inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${STATUS_BADGE[application.status]}`}>
                        {application.status}
                    </span>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <Row label="Pelamar" value={application.applicant_name} />
                    <Row label="Email" value={application.email} />
                    <Row label="WhatsApp" value={application.phone} />
                    <Row label="Nama Brand" value={application.brand_name} />
                    <Row label="Kategori" value={application.category} />
                    <Row label="Tanggal Daftar" value={new Date(application.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })} />

                    {application.message && (
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Deskripsi</div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.message}</p>
                        </div>
                    )}

                    <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Dokumen</div>
                        <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Download className="h-4 w-4" />
                            Lihat / Unduh Dokumen
                        </a>
                    </div>

                    {application.reviewer && (
                        <Row
                            label="Direview oleh"
                            value={`${application.reviewer.name} (${application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString('id-ID') : '-'})`}
                        />
                    )}
                </div>

                {application.status === 'pending' && (
                    <div className="flex gap-3">
                        <Button onClick={approve} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Setujui
                        </Button>
                        <Button onClick={reject} variant="destructive" className="flex-1">
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Tolak
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-4">
            <div className="text-sm font-medium text-muted-foreground w-36 flex-shrink-0">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}
