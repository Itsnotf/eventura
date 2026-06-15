import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarX, Plus, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

interface UnavailableDate {
    id: number;
    date: string;
    reason: string | null;
}

interface Props {
    unavailableDates: UnavailableDate[];
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ketersediaan Tanggal', href: '/availability' },
];

export default function AvailabilityIndex({ unavailableDates, flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        reason: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/availability', { onSuccess: () => reset() });
    }

    function remove(id: number) {
        if (confirm('Hapus tanggal ini?')) {
            router.delete(`/availability/${id}`, { preserveScroll: true });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ketersediaan Tanggal" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <CalendarX className="h-6 w-6" />
                    Tanggal Tidak Tersedia
                </h1>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                {/* Add form */}
                <form onSubmit={submit} className="rounded-lg border bg-card p-5 space-y-4">
                    <h2 className="font-semibold text-sm flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Tanggal Tidak Tersedia
                    </h2>
                    <div className="flex gap-3 flex-wrap">
                        <div>
                            <label className="block text-xs font-medium mb-1">Tanggal *</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-medium mb-1">Alasan (opsional)</label>
                            <input
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                placeholder="Sudah booked, liburan, dll."
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </form>

                {/* List */}
                {unavailableDates.length === 0 ? (
                    <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
                        Belum ada tanggal yang ditandai tidak tersedia.
                    </div>
                ) : (
                    <div className="rounded-lg border bg-card divide-y">
                        {unavailableDates.map(ud => (
                            <div key={ud.id} className="flex items-center justify-between p-4 gap-4">
                                <div>
                                    <p className="font-medium text-sm">
                                        {new Date(ud.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    {ud.reason && <p className="text-xs text-muted-foreground">{ud.reason}</p>}
                                </div>
                                <button
                                    onClick={() => remove(ud.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
