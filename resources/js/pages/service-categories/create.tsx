import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori Layanan', href: '/service-categories' },
    { title: 'Tambah', href: '/service-categories/create' },
];

export default function ServiceCategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        icon: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/service-categories');
    }

    function generateSlug(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori" />

            <div className="max-w-lg mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Tambah Kategori Layanan</h1>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => {
                                setData('name', e.target.value);
                                if (!data.slug) setData('slug', generateSlug(e.target.value));
                            }}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={e => setData('slug', e.target.value)}
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="icon">Icon (opsional)</Label>
                        <Input
                            id="icon"
                            value={data.icon}
                            onChange={e => setData('icon', e.target.value)}
                            placeholder="mis. scissors"
                        />
                        <InputError message={errors.icon} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>Simpan</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Batal</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
