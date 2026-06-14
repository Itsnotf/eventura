import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import LandingLayout from '@/layouts/landing-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    CheckCircle2,
    ClipboardList,
    FileText,
    ShieldCheck,
    Upload,
    UserCheck,
} from 'lucide-react';
import { useRef } from 'react';

const CATEGORIES = [
    'EO',
    'WO',
    'Catering',
    'Dekorasi',
    'Dokumentasi',
    'Rias & Busana',
    'Sound System & Lighting',
    'Venue',
    'MC & Hiburan',
    'Undangan & Souvenir',
    'Lainnya',
];

const REQUIREMENTS = [
    {
        icon: UserCheck,
        label: 'Identitas Penanggung Jawab',
        items: [
            'Nama lengkap penanggung jawab brand',
            'Nomor WhatsApp aktif yang dapat dihubungi',
        ],
    },
    {
        icon: Building2,
        label: 'Data Brand / Perusahaan',
        items: [
            'Nama brand dan bidang layanan',
            'Alamat lengkap kantor / operasional',
        ],
    },
    {
        icon: FileText,
        label: 'Dokumen Legalitas',
        items: [
            'NIB, KTP, SIUP, atau dokumen relevan lainnya (PDF/JPG, maks 5 MB)',
        ],
    },
    {
        icon: ClipboardList,
        label: 'Portofolio & Deskripsi',
        items: [
            'Deskripsi singkat layanan dan keunggulan brand (opsional)',
        ],
    },
];

const STEPS = [
    { number: '01', title: 'Isi Form', desc: 'Lengkapi data diri, brand, dan unggah dokumen legalitas.' },
    { number: '02', title: 'Kirim Permohonan', desc: 'Permohonan dikirim dan status bisa Anda pantau via email.' },
    { number: '03', title: 'Proses Verifikasi', desc: 'Tim admin mereview dokumen dalam 1–3 hari kerja.' },
    { number: '04', title: 'Terima Akun & Mulai', desc: 'Jika disetujui, akun login dikirim ke email Anda.' },
];

export default function JoinPage() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        applicant_name: string;
        email: string;
        phone: string;
        brand_name: string;
        category: string;
        message: string;
        document: File | null;
    }>({
        applicant_name: '',
        email: '',
        phone: '',
        brand_name: '',
        category: '',
        message: '',
        document: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/join/apply', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    if (flash?.success) {
        return (
            <LandingLayout>
                <Head title="Permohonan Terkirim" />
                <section className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <CheckCircle2 className="h-16 w-16 text-lp-primary mx-auto mb-4" />
                        <h1 className="font-playfair text-3xl font-bold text-lp-on-surface mb-3">Permohonan Terkirim!</h1>
                        <p className="text-lp-on-surface-variant leading-relaxed">{flash.success}</p>
                    </div>
                </section>
            </LandingLayout>
        );
    }

    return (
        <LandingLayout>
            <Head title="Daftarkan Brand Anda" />

            {/* Hero */}
            <section className="bg-lp-surface-container-low py-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-lp-surface-container-high text-lp-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <ShieldCheck className="h-4 w-4" />
                        Mitra Terverifikasi
                    </div>
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-lp-primary mb-4 leading-tight">
                        Daftarkan Brand Anda
                    </h1>
                    <p className="text-lp-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                        Isi form di bawah dan unggah dokumen legalitas. Tim admin akan memproses dalam 1–3 hari kerja.
                    </p>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-16">
                <div className="text-center mb-12">
                    <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-2">Alur Pendaftaran</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {STEPS.map((step, i) => (
                        <div key={step.number} className="relative flex flex-col items-start p-6 bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.06)]">
                            {i < STEPS.length - 1 && (
                                <ArrowRight className="hidden lg:block absolute -right-3 top-8 h-5 w-5 text-lp-outline z-10" />
                            )}
                            <span className="text-lp-primary font-bold text-xs tracking-widest mb-3">{step.number}</span>
                            <h3 className="font-playfair text-lg font-semibold text-lp-on-surface mb-2">{step.title}</h3>
                            <p className="text-lp-on-surface-variant text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {REQUIREMENTS.map((req) => (
                        <div key={req.label} className="bg-lp-surface-container-lowest rounded-xl border border-lp-outline-variant p-6 shadow-[0_4px_20px_rgba(18,67,65,0.06)]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-lp-surface-container flex items-center justify-center flex-shrink-0">
                                    <req.icon className="h-5 w-5 text-lp-primary" />
                                </div>
                                <h3 className="font-playfair text-lg font-semibold text-lp-on-surface">{req.label}</h3>
                            </div>
                            <ul className="space-y-2.5">
                                {req.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-lp-on-surface-variant">
                                        <BadgeCheck className="h-4 w-4 text-lp-primary flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Application Form */}
                <div id="form" className="max-w-2xl mx-auto bg-lp-surface-container-lowest rounded-2xl border border-lp-outline-variant shadow-[0_8px_30px_rgba(18,67,65,0.08)] p-8">
                    <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface mb-6">Form Pendaftaran Mitra</h2>

                    <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="applicant_name">Nama Penanggung Jawab <span className="text-red-500">*</span></Label>
                                <Input
                                    id="applicant_name"
                                    value={data.applicant_name}
                                    onChange={e => setData('applicant_name', e.target.value)}
                                    placeholder="Nama lengkap"
                                />
                                <InputError message={errors.applicant_name} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Nomor WhatsApp <span className="text-red-500">*</span></Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="email@brand.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="brand_name">Nama Brand <span className="text-red-500">*</span></Label>
                                <Input
                                    id="brand_name"
                                    value={data.brand_name}
                                    onChange={e => setData('brand_name', e.target.value)}
                                    placeholder="Nama brand Anda"
                                />
                                <InputError message={errors.brand_name} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="category">Kategori Layanan <span className="text-red-500">*</span></Label>
                                <Select value={data.category} onValueChange={v => setData('category', v)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="message">Deskripsi Singkat (opsional)</Label>
                            <Textarea
                                id="message"
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                placeholder="Ceritakan layanan dan keunggulan brand Anda..."
                                rows={4}
                            />
                            <InputError message={errors.message} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="document">Dokumen Legalitas <span className="text-red-500">*</span></Label>
                            <div
                                className="border-2 border-dashed border-lp-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-lp-primary transition-colors"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload className="h-8 w-8 text-lp-primary mx-auto mb-2" />
                                {data.document ? (
                                    <p className="text-sm text-lp-on-surface font-medium">{data.document.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-lp-on-surface font-medium">Klik untuk unggah dokumen</p>
                                        <p className="text-xs text-lp-on-surface-variant mt-1">PDF, JPG, JPEG, PNG — maks 5 MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={e => setData('document', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.document} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Mengirim...' : 'Kirim Permohonan'}
                        </Button>
                    </form>
                </div>
            </section>
        </LandingLayout>
    );
}
