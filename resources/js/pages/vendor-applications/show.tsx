import { ConfirmDialog } from '@/components/confirm-dialog';
import { whatsappUrl } from '@/components/landing/brand-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface Application {
    id: number;
    applicant_name: string;
    email: string;
    phone: string;
    brand_name: string;
    category: string[];
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
    flash?: { success?: string; whatsapp?: { phone: string; message: string } };
}

const STATUS_BADGE: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-4">
            <span className="text-muted-foreground text-sm w-32 shrink-0">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function VendorApplicationShow({ application, documentUrl, flash }: Props) {
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vendor Applications', href: '/vendor-applications' },
        { title: application.brand_name, href: `/vendor-applications/${application.id}` },
    ];

    function doAction() {
        if (confirmAction === 'approve') {
            router.post(`/vendor-applications/${application.id}/approve`);
        } else if (confirmAction === 'reject') {
            router.post(`/vendor-applications/${application.id}/reject`);
        }
        setConfirmAction(null);
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

                {flash?.whatsapp && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
                        <p className="text-sm text-green-800">
                            Pesan untuk <strong>{application.applicant_name}</strong> sudah disiapkan. Klik tombol untuk membuka WhatsApp dan kirim.
                        </p>
                        <a
                            href={whatsappUrl(flash.whatsapp.phone, flash.whatsapp.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm font-medium shrink-0"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Kirim ke WhatsApp
                        </a>
                    </div>
                )}

                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <Row label="Pelamar" value={application.applicant_name} />
                    <Row label="Email" value={application.email} />
                    <Row label="WhatsApp" value={application.phone} />
                    <Row label="Nama Brand" value={application.brand_name} />
                    <Row label="Kategori" value={application.category.join(', ')} />
                    <Row label="Tanggal Daftar" value={new Date(application.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })} />
                    {application.reviewed_at && (
                        <Row label="Direview" value={new Date(application.reviewed_at).toLocaleDateString('id-ID', { dateStyle: 'long' })} />
                    )}
                    {application.reviewer && (
                        <Row label="Reviewer" value={application.reviewer.name} />
                    )}
                </div>

                {application.message && (
                    <div className="rounded-xl border bg-card p-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pesan</p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{application.message}</p>
                    </div>
                )}

                <div className="flex gap-3 flex-wrap">
                    <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Unduh Dokumen
                    </a>

                    {application.status === 'pending' && (
                        <>
                            <Button
                                onClick={() => setConfirmAction('approve')}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <ThumbsUp className="h-4 w-4" />
                                Setujui
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setConfirmAction('reject')}
                                className="gap-2"
                            >
                                <ThumbsDown className="h-4 w-4" />
                                Tolak
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirmAction === 'approve'}
                title={`Setujui aplikasi ${application.brand_name}?`}
                description="Akun vendor dan brand akan dibuat otomatis. Pemohon akan mendapatkan notifikasi."
                confirmLabel="Ya, Setujui"
                variant="default"
                onConfirm={doAction}
                onCancel={() => setConfirmAction(null)}
            />
            <ConfirmDialog
                open={confirmAction === 'reject'}
                title={`Tolak aplikasi ${application.brand_name}?`}
                description="Pemohon akan mendapatkan notifikasi bahwa aplikasinya ditolak."
                confirmLabel="Ya, Tolak"
                onConfirm={doAction}
                onCancel={() => setConfirmAction(null)}
            />
        </AppLayout>
    );
}
