import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    ClipboardList,
    FileText,
    Mail,
    Phone,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';

interface Props {
    adminEmail: string;
}

const REQUIREMENTS = [
    {
        icon: UserCheck,
        label: 'Identitas Penanggung Jawab',
        items: [
            'Nama lengkap penanggung jawab brand',
            'Foto KTP penanggung jawab (jelas dan terbaca)',
            'Nomor WhatsApp aktif yang dapat dihubungi',
        ],
    },
    {
        icon: Building2,
        label: 'Data Brand / Perusahaan',
        items: [
            'Nama brand dan nama perusahaan (jika ada)',
            'Bidang layanan: Event Organizer (EO), Wedding Organizer (WO), atau keduanya',
            'Alamat lengkap kantor / operasional',
            'Akun Instagram bisnis (jika ada)',
        ],
    },
    {
        icon: FileText,
        label: 'Dokumen Legalitas',
        items: [
            'Nomor Induk Berusaha (NIB) — wajib',
            'SIUP atau Akta Pendirian Perusahaan (untuk badan usaha)',
            'Dokumen legalitas lainnya yang relevan',
        ],
    },
    {
        icon: ClipboardList,
        label: 'Portofolio & Deskripsi Layanan',
        items: [
            'Minimal 3 foto dokumentasi event/pernikahan yang pernah ditangani',
            'Deskripsi singkat layanan dan keunggulan brand',
            'Coverage area (kota/wilayah yang dilayani)',
        ],
    },
];

const STEPS = [
    { number: '01', title: 'Siapkan Dokumen', desc: 'Kumpulkan semua persyaratan di atas sebelum mengirim email pendaftaran.' },
    { number: '02', title: 'Kirim Email Pendaftaran', desc: 'Kirim semua dokumen dan informasi brand ke email admin kami melalui tombol di bawah.' },
    { number: '03', title: 'Proses Verifikasi', desc: 'Tim admin akan mereview dokumen dan memverifikasi kelengkapan data brand Anda.' },
    { number: '04', title: 'Terima Akun & Mulai', desc: 'Jika disetujui, admin akan mengirimkan akun login ke email Anda. Mulai tampilkan brand Anda!' },
];

function buildMailtoLink(adminEmail: string): string {
    const subject = encodeURIComponent('Pendaftaran Mitra Eventura — [Nama Brand Anda]');
    const body = encodeURIComponent(
        `Yth. Admin Eventura,

Saya bermaksud mendaftarkan brand kami sebagai mitra di platform Eventura. Berikut informasi kami:

--- DATA BRAND ---
Nama Brand          :
Nama Perusahaan     :
Bidang Layanan      : [ ] EO  [ ] WO  [ ] Keduanya
Alamat              :
Coverage Area       :
Instagram           :
WhatsApp            :

--- PENANGGUNG JAWAB ---
Nama Lengkap        :
Email               :

--- DESKRIPSI SINGKAT LAYANAN ---
(Tuliskan keunggulan dan layanan brand Anda di sini)

--- DOKUMEN TERLAMPIR ---
[ ] Foto KTP Penanggung Jawab
[ ] Nomor Induk Berusaha (NIB)
[ ] SIUP / Akta Pendirian (jika ada)
[ ] Foto Portofolio Event (min. 3 foto)

Saya memahami bahwa pendaftaran ini akan diproses setelah verifikasi dokumen oleh admin.

Hormat saya,
[Nama Anda]`,
    );
    return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
}

export default function JoinPage({ adminEmail }: Props) {
    const mailtoLink = buildMailtoLink(adminEmail);

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
                    <p className="text-lp-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                        Kami menerapkan proses verifikasi manual untuk memastikan setiap brand di platform kami
                        adalah mitra profesional dan terpercaya. Ikuti langkah-langkah berikut untuk bergabung.
                    </p>
                    <a
                        href={mailtoLink}
                        className="inline-flex items-center gap-2 bg-lp-primary text-lp-on-primary px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(18,67,65,0.2)]"
                    >
                        <Mail className="h-4 w-4" />
                        Kirim Permohonan ke Admin
                    </a>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-16">
                <div className="text-center mb-12">
                    <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-2">Alur Pendaftaran</h2>
                    <p className="text-lp-on-surface-variant">Proses sederhana, kami akan memandu Anda dari awal hingga akhir.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            </section>

            {/* Requirements */}
            <section id="requirements" className="bg-lp-surface-container-low py-16">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="font-playfair text-3xl font-semibold text-lp-on-surface mb-2">Persyaratan Pendaftaran</h2>
                        <p className="text-lp-on-surface-variant">Pastikan semua dokumen berikut tersedia sebelum mengirim email pendaftaran.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

                    {/* Contact CTA */}
                    <div className="bg-lp-primary rounded-2xl shadow-[0_8px_30px_rgba(18,67,65,0.2)] p-8 md:p-12">
                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            <div className="flex-grow">
                                <h3 className="font-playfair text-2xl font-semibold text-lp-on-primary mb-2">
                                    Siap bergabung?
                                </h3>
                                <p className="text-lp-on-primary/80 text-sm leading-relaxed mb-3">
                                    Kirim email pendaftaran beserta seluruh dokumen persyaratan ke admin kami.
                                    Tim akan memproses permohonan Anda dalam 1–3 hari kerja.
                                </p>
                                <div className="flex items-center gap-2 text-lp-on-primary/70 text-sm">
                                    <Phone className="h-4 w-4" />
                                    <span>Hubungi admin jika ada pertanyaan seputar persyaratan.</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-shrink-0">
                                <a
                                    href={mailtoLink}
                                    className="inline-flex items-center justify-center gap-2 bg-lp-on-primary text-lp-primary px-8 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    <Mail className="h-4 w-4" />
                                    Kirim Email Pendaftaran
                                </a>
                                <p className="text-lp-on-primary/60 text-xs text-center">{adminEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
}
