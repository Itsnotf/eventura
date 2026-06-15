import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';

interface Application {
    id: number;
    applicant_name: string;
    email: string;
    phone: string;
    brand_name: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Props {
    applications: {
        data: Application[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: { total: number };
        total?: number;
    };
    filters: { status?: string };
    flash?: { success?: string };
}

const STATUS_BADGE: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vendor Applications', href: '/vendor-applications' },
];

export default function VendorApplicationsIndex({ applications, filters, flash }: Props) {
    const [status, setStatus] = useState(filters.status ?? 'all');

    function applyFilter(newStatus: string) {
        setStatus(newStatus);
        router.get('/vendor-applications', newStatus !== 'all' ? { status: newStatus } : {}, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendor Applications" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Vendor Applications</h1>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="flex gap-3">
                    <Select value={status} onValueChange={applyFilter}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelamar</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-16"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Tidak ada aplikasi.
                                    </TableCell>
                                </TableRow>
                            )}
                            {applications.data.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="font-medium">{app.applicant_name}</div>
                                        <div className="text-xs text-muted-foreground">{app.email}</div>
                                    </TableCell>
                                    <TableCell>{app.brand_name}</TableCell>
                                    <TableCell>{app.category}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(app.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[app.status]}`}>
                                            {app.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/vendor-applications/${app.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {applications.links && (
                    <div className="flex gap-1 justify-center">
                        {applications.links.map((link, i) => (
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
