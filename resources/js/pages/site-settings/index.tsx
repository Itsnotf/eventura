import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Setting {
    id: number;
    group: 'about' | 'contact' | string;
    key: string;
    type: 'text' | 'textarea' | 'email' | 'url' | 'image';
    label: string;
    value: string | null;
    sort: number;
}

interface Props {
    settings: Setting[];
}

const HINTS: Record<string, string> = {
    about_image:
        'Gambar utama di halaman Tentang Kami. Format JPG/PNG/WEBP, maks 5 MB. Kosongkan jika tidak ingin pakai gambar.',
    contact_maps:
        'Tempel URL embed Google Maps. Caranya: buka Google Maps → cari lokasi → "Bagikan" → tab "Sematkan peta" → salin nilai atribut src (diawali https://www.google.com/maps/embed?...). Kosongkan jika tidak ingin menampilkan peta.',
    contact_instagram:
        'URL lengkap akun, contoh: https://instagram.com/akunanda',
    contact_phone:
        'Nomor yang bisa dihubungi/WhatsApp, contoh: +62 812-3456-7890',
};

const GROUP_LABEL: Record<string, string> = {
    about: 'Halaman Tentang Kami',
    contact: 'Halaman Kontak',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengaturan Situs', href: '/site-settings' },
];

export default function SiteSettingsIndex({ settings }: Props) {
    const [values, setValues] = useState<Record<number, string>>(
        Object.fromEntries(settings.map((s) => [s.id, s.value ?? ''])),
    );
    const [images, setImages] = useState<Record<number, File | null>>({});
    const [previews, setPreviews] = useState<Record<number, string>>({});
    const [processing, setProcessing] = useState(false);

    const groups = ['about', 'contact'] as const;

    function pickImage(id: number, file: File | null) {
        setImages((p) => ({ ...p, [id]: file }));
        setPreviews((p) => ({
            ...p,
            [id]: file ? URL.createObjectURL(file) : '',
        }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const payload: Record<string, unknown> = {
            settings: settings.map((s) => ({
                id: s.id,
                value: values[s.id] ?? '',
            })),
        };

        const imgs: Record<number, File> = {};
        Object.entries(images).forEach(([id, f]) => {
            if (f) imgs[Number(id)] = f;
        });
        if (Object.keys(imgs).length) payload.images = imgs;

        router.post('/site-settings', payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Pengaturan situs berhasil disimpan.'),
            onError: () =>
                toast.error('Gagal menyimpan. Periksa kembali isian Anda.'),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Situs" />
            <form onSubmit={submit} className="mx-auto space-y-8 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Pengaturan Situs</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola isi halaman <b>Tentang Kami</b> dan <b>Kontak</b>
                        . Perubahan langsung tampil di situs publik.
                    </p>
                </div>

                <div className="grid grid-col-1 md:grid-cols-2 gap-5 w-full ">
                    {groups.map((g) => (
                        <section
                            key={g}
                            className="space-y-5 rounded-xl border bg-card p-5"
                        >
                            <h2 className="border-b pb-2 text-base font-semibold">
                                {GROUP_LABEL[g] ?? g}
                            </h2>
                            {settings
                                .filter((s) => s.group === g)
                                .map((s) => (
                                    <div
                                        key={s.id}
                                        className={`space-y-1.5 ${s.type === 'textarea' || s.type === 'image' ? 'col-span-2' : ''}`}
                                    >
                                        <Label htmlFor={`s-${s.id}`}>
                                            {s.label}
                                        </Label>
                                        {HINTS[s.key] && (
                                            <p className="text-xs text-muted-foreground">
                                                {HINTS[s.key]}
                                            </p>
                                        )}

                                        {s.type === 'image' ? (
                                            <div className="space-y-2">
                                                {(previews[s.id] ||
                                                    values[s.id]) && (
                                                    <img
                                                        src={
                                                            previews[s.id] ||
                                                            `/storage/${values[s.id]}`
                                                        }
                                                        alt="Pratinjau"
                                                        className="h-32 w-auto rounded-lg border object-cover"
                                                    />
                                                )}
                                                <Input
                                                    id={`s-${s.id}`}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(e) =>
                                                        pickImage(
                                                            s.id,
                                                            e.target
                                                                .files?.[0] ??
                                                                null,
                                                        )
                                                    }
                                                />
                                            </div>
                                        ) : s.type === 'textarea' ? (
                                            <Textarea
                                                id={`s-${s.id}`}
                                                rows={
                                                    s.key === 'contact_maps'
                                                        ? 3
                                                        : 5
                                                }
                                                value={values[s.id] ?? ''}
                                                onChange={(e) =>
                                                    setValues((p) => ({
                                                        ...p,
                                                        [s.id]: e.target.value,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            <Input
                                                id={`s-${s.id}`}
                                                type={
                                                    s.type === 'email'
                                                        ? 'email'
                                                        : s.type === 'url'
                                                          ? 'url'
                                                          : 'text'
                                                }
                                                value={values[s.id] ?? ''}
                                                onChange={(e) =>
                                                    setValues((p) => ({
                                                        ...p,
                                                        [s.id]: e.target.value,
                                                    }))
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                        </section>
                    ))}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                </Button>
            </form>
        </AppLayout>
    );
}
