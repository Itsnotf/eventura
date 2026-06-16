import LandingLayout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';

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

export default function TentangKami({ settings }: Props) {
    const title       = get(settings, 'about_title', 'Tentang Eventura');
    const tagline     = get(settings, 'about_tagline');
    const description = get(settings, 'about_description');
    const vision      = get(settings, 'about_vision');
    const mission     = get(settings, 'about_mission');
    const image       = get(settings, 'about_image');

    return (
        <LandingLayout>
            <Head title={title} />

            {/* Hero */}
            <section className="bg-lp-surface-container-low py-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 text-center">
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-lp-primary mb-4 leading-tight">
                        {title}
                    </h1>
                    {tagline && (
                        <p className="text-lp-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                            {tagline}
                        </p>
                    )}
                </div>
            </section>

            <div className="max-w-[800px] mx-auto px-4 md:px-12 py-16 space-y-12">
                {/* Gambar utama (opsional) */}
                {image && (
                    <img
                        src={`/storage/${image}`}
                        alt={title}
                        className="w-full max-h-80 object-cover rounded-2xl"
                    />
                )}

                {/* Description */}
                {description && (
                    <section>
                        <div className="prose prose-sm max-w-none text-lp-on-surface-variant leading-relaxed space-y-4">
                            {description.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </section>
                )}

                {/* Vision */}
                {vision && (
                    <section className="bg-lp-surface-container rounded-2xl p-8 border border-lp-outline-variant">
                        <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface mb-4">Visi</h2>
                        <p className="text-lp-on-surface-variant leading-relaxed">{vision}</p>
                    </section>
                )}

                {/* Mission */}
                {mission && (
                    <section className="bg-lp-surface-container rounded-2xl p-8 border border-lp-outline-variant">
                        <h2 className="font-playfair text-2xl font-semibold text-lp-on-surface mb-4">Misi</h2>
                        <ul className="space-y-2.5 text-lp-on-surface-variant">
                            {mission.split('\n').filter(Boolean).map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-lp-primary flex-shrink-0" />
                                    <span className="leading-relaxed">{item.replace(/^-\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* CTA */}
                <div className="text-center pt-4">
                    <p className="text-lp-on-surface-variant mb-6">Ingin bergabung sebagai vendor?</p>
                    <Link
                        href="/join"
                        className="inline-flex items-center gap-2 bg-lp-primary text-lp-on-primary px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Daftarkan Brand Anda
                    </Link>
                </div>
            </div>
        </LandingLayout>
    );
}
