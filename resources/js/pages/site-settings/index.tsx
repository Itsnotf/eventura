import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Setting {
    id: number;
    key: string;
    value: string | null;
    type: 'text' | 'textarea' | 'email' | 'url' | 'image';
    group: string;
    label: string;
    sort: number;
}

interface Props {
    settings: Setting[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengaturan Situs', href: '/site-settings' },
];

const GROUP_LABELS: Record<string, string> = {
    about:   'Tentang Kami',
    contact: 'Kontak',
    general: 'Umum',
};

export default function SiteSettingsIndex({ settings }: Props) {
    const grouped = settings.reduce<Record<string, Setting[]>>((acc, s) => {
        (acc[s.group] ??= []).push(s);
        return acc;
    }, {});

    const { data, setData, post, processing } = useForm({
        settings: settings.map(s => ({ id: s.id, value: s.value ?? '' })),
    });

    function setValue(id: number, value: string) {
        setData('settings', data.settings.map(s => s.id === id ? { ...s, value } : s));
    }

    function getValue(id: number) {
        return data.settings.find(s => s.id === id)?.value ?? '';
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/site-settings');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Situs" />

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Pengaturan Situs</h1>

                <form onSubmit={submit} className="space-y-10">
                    {Object.entries(grouped).map(([group, items]) => (
                        <section key={group}>
                            <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">
                                {GROUP_LABELS[group] ?? group}
                            </h2>
                            <div className="space-y-5">
                                {items.map(setting => (
                                    <div key={setting.id} className="space-y-1.5">
                                        <Label>{setting.label}</Label>
                                        {setting.type === 'textarea' ? (
                                            <Textarea
                                                value={getValue(setting.id)}
                                                onChange={e => setValue(setting.id, e.target.value)}
                                                rows={5}
                                                className="font-mono text-sm"
                                            />
                                        ) : (
                                            <Input
                                                type={setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
                                                value={getValue(setting.id)}
                                                onChange={e => setValue(setting.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
