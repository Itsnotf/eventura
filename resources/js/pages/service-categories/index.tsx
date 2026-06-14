import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    packages_count: number;
}

interface Props {
    categories: Category[];
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Layanan', href: '/service-categories' },
];

export default function ServiceCategoriesIndex({ categories, flash }: Props) {
    function destroy(id: number, name: string) {
        if (confirm(`Hapus kategori "${name}"?`)) {
            router.delete(`/service-categories/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Layanan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Kategori Layanan</h1>
                    <Link href="/service-categories/create">
                        <Button><Plus className="h-4 w-4 mr-2" />Tambah</Button>
                    </Link>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{flash.error}</div>
                )}

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Paket</TableHead>
                                <TableHead className="w-24"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">Belum ada kategori.</TableCell>
                                </TableRow>
                            )}
                            {categories.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{cat.slug}</TableCell>
                                    <TableCell>{cat.packages_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Link href={`/service-categories/${cat.id}/edit`}>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={cat.packages_count > 0}
                                                onClick={() => destroy(cat.id, cat.name)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
