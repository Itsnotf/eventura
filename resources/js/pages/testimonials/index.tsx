import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, EyeOff, Star } from 'lucide-react';

interface Testimonial {
    id: number;
    rating: number;
    body: string;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    user: { id: number; name: string };
}

interface Props {
    testimonials: {
        data: Testimonial[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Testimoni', href: '/testimonials' },
];

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
            ))}
        </div>
    );
}

export default function TestimonialsIndex({ testimonials, flash }: Props) {
    function toggle(id: number, published: boolean) {
        const url = published ? `/testimonials/${id}/unpublish` : `/testimonials/${id}/publish`;
        router.post(url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimoni" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold">Moderasi Testimoni</h1>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Testimoni</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-24"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Belum ada testimoni.
                                    </TableCell>
                                </TableRow>
                            )}
                            {testimonials.data.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.user.name}</TableCell>
                                    <TableCell><Stars rating={t.rating} /></TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="text-sm line-clamp-2 text-muted-foreground">{t.body}</p>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(t.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t.is_published ? 'Publik' : 'Tersembunyi'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggle(t.id, t.is_published)}
                                            title={t.is_published ? 'Sembunyikan' : 'Publikasikan'}
                                        >
                                            {t.is_published
                                                ? <EyeOff className="h-4 w-4" />
                                                : <Eye className="h-4 w-4" />
                                            }
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {testimonials.links && (
                    <div className="flex gap-1 justify-center">
                        {testimonials.links.map((link, i) => (
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
