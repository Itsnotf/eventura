import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import { Instagram, Mail, MapPin, Phone, Clock } from 'lucide-react';

interface Setting {
    key: string;
    value: string | null;
    label: string;
}

interface Props {
    settings: Record<string, Setting>;
}

function get(settings: Record<string, Setting>, key: string, fallback = '') {
    return settings[key]?.value ?? fallback;
}

export default function Kontak({ settings }: Props) {
    const title     = get(settings, 'contact_title', 'Hubungi Kami');
    const intro     = get(settings, 'contact_intro');
    const email     = get(settings, 'contact_email');
    const phone     = get(settings, 'contact_phone');
    const address   = get(settings, 'contact_address');
    const hours     = get(settings, 'contact_hours');
    const instagram = get(settings, 'contact_instagram');
    const maps      = get(settings, 'contact_maps');

    const items = [
        email   && { icon: Mail,      label: 'Email',           value: email,     href: `mailto:${email}` },
        phone   && { icon: Phone,     label: 'WhatsApp / Telp', value: phone,     href: `https://wa.me/${phone.replace(/\D/g, '')}` },
        address && { icon: MapPin,    label: 'Alamat',          value: address,   href: null },
        hours   && { icon: Clock,     label: 'Jam Operasional', value: hours,     href: null },
        instagram && { icon: Instagram, label: 'Instagram',     value: '@' + instagram.replace(/https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/\/$/, ''), href: instagram },
    ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null }[];

    return (
        <LandingLayout>
            <Head title={title} />

            {/* Hero */}
            <section className="bg-lp-surface-container-low py-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 text-center">
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-lp-primary mb-4 leading-tight">
                        {title}
                    </h1>
                    {intro && (
                        <p className="text-lp-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                            {intro}
                        </p>
                    )}
                </div>
            </section>

            <div className="max-w-[700px] mx-auto px-4 md:px-12 py-16">
                <div className="bg-lp-surface-container-lowest rounded-2xl border border-lp-outline-variant shadow-[0_4px_20px_rgba(18,67,65,0.06)] divide-y divide-lp-outline-variant overflow-hidden">
                    {items.map(({ icon: Icon, label, value, href }) => (
                        <div key={label} className="flex items-start gap-4 px-6 py-5">
                            <div className="w-10 h-10 rounded-full bg-lp-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon className="h-5 w-5 text-lp-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-lp-on-surface-variant uppercase tracking-wider mb-0.5">{label}</p>
                                {href ? (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lp-primary hover:underline text-sm font-medium"
                                    >
                                        {value}
                                    </a>
                                ) : (
                                    <p className="text-sm text-lp-on-surface whitespace-pre-line">{value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Peta (opsional) */}
            {maps && (
                <div className="max-w-[700px] mx-auto px-4 md:px-12 pb-16">
                    <div className="rounded-2xl overflow-hidden border border-lp-outline-variant">
                        <iframe
                            src={maps}
                            title="Lokasi"
                            width="100%"
                            height="320"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            )}
        </LandingLayout>
    );
}
