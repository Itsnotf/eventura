<?php

namespace Database\Seeders;

use App\Models\BrandPackages;
use App\Models\Brands;
use App\Models\ServiceCategories;
use Illuminate\Database\Seeder;

class BrandPackagesSeeder extends Seeder
{
    public function run(): void
    {
        // Map slug → id for fast lookup
        $cats = ServiceCategories::pluck('id', 'slug')->all();

        // Helper: resolve category id by slug (falls back to 'lainnya')
        $cat = fn(string $slug): int => $cats[$slug] ?? $cats['lainnya'];

        $data = [

            // ── Wedding Organizer: Bandung ──────────────────────────────────
            'mahkota-bridal-event' => [
                [
                    'name'     => 'Paket All-In Wedding',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 25_000_000, 'price_end' => 55_000_000,
                    'description' => 'Paket pernikahan all-inclusive untuk 200–400 tamu. Koordinasi penuh hari-H, dekorasi ballroom, bridal make-up & gown, MC, sound system, dokumentasi lengkap, catering buffet, dan undangan digital.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Rias Pengantin Eksklusif',
                    'category' => 'rias-busana',
                    'price_start' => 3_500_000, 'price_end' => 7_000_000,
                    'description' => 'Rias pengantin paes ageng atau modern oleh makeup artist bersertifikat. Termasuk trial make-up, busana pengantin premium (gaun + kebaya), serta riasan keluarga inti.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dekorasi Intimate',
                    'category' => 'dekorasi',
                    'price_start' => 5_000_000, 'price_end' => 12_000_000,
                    'description' => 'Dekorasi pernikahan intimate untuk 50–120 tamu. Konsep minimalis elegan dengan bunga segar, table setting, floral arch, dan backdrop foto yang instagramable.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Foto & Video Sinematik',
                    'category' => 'dokumentasi-foto-video',
                    'price_start' => 4_500_000, 'price_end' => 9_000_000,
                    'description' => 'Dokumentasi pernikahan profesional: 2 fotografer + 1 videografer, hasil edit album digital (200+ foto), highlight video cinematic 5–7 menit, dan raw footage. Siap dalam 30 hari.',
                    'is_featured' => false,
                ],
            ],

            // ── Event Organizer: Surabaya ────────────────────────────────────
            'nuansa-event-pro' => [
                [
                    'name'     => 'Paket Full Event Korporat',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 20_000_000, 'price_end' => 50_000_000,
                    'description' => 'Penyelenggaraan event korporat end-to-end: seminar, gathering, atau gala dinner 100–500 peserta. Termasuk concept design, venue dressing, multimedia, entertainment, dan full day coordination.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Sound System & LED Screen',
                    'category' => 'sound-system-lighting',
                    'price_start' => 5_000_000, 'price_end' => 15_000_000,
                    'description' => 'Penyewaan & operasional sound system profesional + LED screen / backdrop digital untuk event 200–1.000 peserta. Termasuk teknisi berpengalaman, setup & teardown, dan uji coba H-1.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket MC Profesional & Hiburan',
                    'category' => 'mc-hiburan',
                    'price_start' => 3_000_000, 'price_end' => 8_000_000,
                    'description' => 'MC profesional berpengalaman untuk event korporat atau pesta. Paket dapat dikombinasikan dengan live band, band akustik, atau pertunjukan sulap & atraksi hiburan pilihan.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Dekorasi & Tata Panggung Event',
                    'category' => 'dekorasi',
                    'price_start' => 6_000_000, 'price_end' => 18_000_000,
                    'description' => 'Desain dan pemasangan dekorasi event korporat: stage dressing, backdrop branding, table centerpiece, standing banner, dan seluruh elemen dekorasi ruangan sesuai tema perusahaan.',
                    'is_featured' => true,
                ],
            ],

            // ── Wedding Organizer: Jakarta ──────────────────────────────────
            'permata-wedding' => [
                [
                    'name'     => 'Paket Full Wedding Premium',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 40_000_000, 'price_end' => 85_000_000,
                    'description' => 'Paket ballroom premium Jakarta untuk 300–600 tamu. Termasuk dekorasi mewah, bridal package lengkap, MC bilingual, live band, catering fine dining, dan video highlight sinematik.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Catering Pernikahan',
                    'category' => 'catering',
                    'price_start' => 8_000_000, 'price_end' => 25_000_000,
                    'description' => 'Layanan catering pernikahan dari 100 hingga 500 porsi. Menu buffet atau prasmanan dengan pilihan sajian Indonesia, Western, dan Chinese. Termasuk peralatan makan, waiter, dan setup meja hidang.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dekorasi Floral Mewah',
                    'category' => 'dekorasi',
                    'price_start' => 6_000_000, 'price_end' => 18_000_000,
                    'description' => 'Dekorasi pernikahan dengan bunga segar premium: floral arch, pelaminan, table centerpiece, petal shower, dan flower wall backdrop. Konsep classic, rustic, maupun modern tersedia.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Undangan & Souvenir',
                    'category' => 'undangan-souvenir',
                    'price_start' => 1_500_000, 'price_end' => 5_000_000,
                    'description' => 'Paket undangan digital + fisik (min. 100 pcs) beserta souvenir pernikahan pilihan: frame foto, totebag, lilin aromaterapi, atau produk custom. Desain custom sesuai tema pernikahan.',
                    'is_featured' => true,
                ],
            ],

            // ── EO + WO: Yogyakarta ─────────────────────────────────────────
            'gala-event-solutions' => [
                [
                    'name'     => 'Paket Wedding Internasional',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 80_000_000, 'price_end' => 200_000_000,
                    'description' => 'Pernikahan berkelas internasional di venue terbaik Yogyakarta. Melayani pasangan lokal dan mancanegara dengan konsep custom, interpreter, concierge tamu VIP, dan dokumentasi sinematik kelas dunia.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Corporate Event Full',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 20_000_000, 'price_end' => 65_000_000,
                    'description' => 'Pengelolaan event korporat skala menengah: gathering 100–500 orang, product launch, atau company anniversary. Termasuk creative concept, venue dressing, multimedia, entertainment, dan full day coordination.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Venue & Setup Eksklusif',
                    'category' => 'venue-gedung',
                    'price_start' => 10_000_000, 'price_end' => 35_000_000,
                    'description' => 'Pengelolaan dan setup venue eksklusif di Yogyakarta: ballroom, pendopo heritage, atau outdoor resort. Termasuk kursi, meja, tenda, pencahayaan, dan koordinasi vendor pendukung.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Dokumentasi Sinematik',
                    'category' => 'dokumentasi-foto-video',
                    'price_start' => 8_000_000, 'price_end' => 20_000_000,
                    'description' => 'Tim dokumentasi profesional 3 orang: fotografer utama, videografer sinematik, dan operator drone. Hasil: 300+ foto edit, video highlight 10 menit, footage drone, dan teaser 60 detik.',
                    'is_featured' => true,
                ],
            ],

            // ── Wedding Organizer: Bali ─────────────────────────────────────
            'elegan-bali-wedding' => [
                [
                    'name'     => 'Paket Full Bali Wedding Experience',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 110_000_000, 'price_end' => 320_000_000,
                    'description' => 'Paket lengkap 3 hari 2 malam wedding experience di Bali. Termasuk pre-wedding shoot, traditional Balinese blessing ceremony, grand reception di resort bintang 5, honeymoon night, dan guest shuttle management.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dekorasi Tropis Bali',
                    'category' => 'dekorasi',
                    'price_start' => 8_000_000, 'price_end' => 22_000_000,
                    'description' => 'Dekorasi pernikahan khas Bali: bunga frangipani, daun palem, ornamen tradisional, floral arch tropis, pelaminan terbuka outdoor, dan centerpiece unik bernuansa alam Bali.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dokumentasi & Aerial Drone',
                    'category' => 'dokumentasi-foto-video',
                    'price_start' => 6_000_000, 'price_end' => 15_000_000,
                    'description' => 'Dokumentasi pernikahan Bali + footage drone eksklusif dari atas tebing atau tepi pantai. Highlight video 8 menit bergaya cinematik, 250+ foto edit, dan teaser Instagram 90 detik.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Catering Kuliner Bali',
                    'category' => 'catering',
                    'price_start' => 5_000_000, 'price_end' => 14_000_000,
                    'description' => 'Hidangan pernikahan dengan sentuhan kuliner Bali autentik: babi guling (opsional), ayam betutu, lawar, jajan Bali, dan sajian modern fusion. Tersedia untuk 50–300 tamu.',
                    'is_featured' => true,
                ],
            ],

            // ── Event Organizer: Jakarta (besar) ────────────────────────────
            'proevent-indonesia' => [
                [
                    'name'     => 'Paket Konser & Live Show',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 60_000_000, 'price_end' => 250_000_000,
                    'description' => 'Penyelenggaraan konser musik, stand-up comedy, atau live show 500–5.000+ penonton. Termasuk stage production, sound & lighting profesional, artis management, tiket online, keamanan, dan media coverage.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Pameran & Product Launch',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 30_000_000, 'price_end' => 90_000_000,
                    'description' => 'Penyelenggaraan pameran produk, expo, atau product launch yang berkesan. Termasuk booth layout, media invite, live streaming, interactive experience, sample distribution, dan press kit.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Stage Sound & Lighting Pro',
                    'category' => 'sound-system-lighting',
                    'price_start' => 12_000_000, 'price_end' => 40_000_000,
                    'description' => 'Penyediaan panggung, sound system line array, dan lighting moving head untuk event 500–5.000 penonton. Operator berpengalaman, setup H-1, dan teknisi standby selama acara berlangsung.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket MC & Artis Hiburan',
                    'category' => 'mc-hiburan',
                    'price_start' => 5_000_000, 'price_end' => 25_000_000,
                    'description' => 'MC profesional + paket hiburan: band, DJ, comedian, atau performance art. Tersedia untuk event korporat, festival, hingga konser indoor skala menengah.',
                    'is_featured' => false,
                ],
            ],

            // ── Wedding Organizer: Semarang ─────────────────────────────────
            'bunga-raya-wedding' => [
                [
                    'name'     => 'Paket Full Wedding Elegant',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 28_000_000, 'price_end' => 60_000_000,
                    'description' => 'Pernikahan klasik di ballroom hotel Semarang untuk 200–400 tamu. Dekorasi bunga segar tema white & gold, bridal package, MC, photo & video sinematik, live acoustic, dan catering buffet.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Rias & Busana Pengantin',
                    'category' => 'rias-busana',
                    'price_start' => 3_000_000, 'price_end' => 7_500_000,
                    'description' => 'Rias pengantin adat atau modern oleh MUA professional. Termasuk trial make-up, busana pengantin (sewa/beli), riasan saudara perempuan (2 orang), dan touch-up sepanjang hari-H.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dekorasi Bunga Segar',
                    'category' => 'dekorasi',
                    'price_start' => 4_000_000, 'price_end' => 10_000_000,
                    'description' => 'Dekorasi pernikahan menggunakan bunga segar pilihan: mawar, lily, dan baby breath. Termasuk pelaminan, floral arch, table arrangement, aisle decoration, dan buket pengantin.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Dokumentasi Pernikahan',
                    'category' => 'dokumentasi-foto-video',
                    'price_start' => 3_500_000, 'price_end' => 7_000_000,
                    'description' => 'Tim foto & video 2 orang. Hasil: 200+ foto edit digital, highlight video 5 menit bergaya cinematic, dan footage mentah seluruh acara. Pengiriman via Google Drive dalam 21 hari.',
                    'is_featured' => true,
                ],
            ],

            // ── Event Organizer: Medan ──────────────────────────────────────
            'spektra-events' => [
                [
                    'name'     => 'Paket Corporate Gathering Full',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 18_000_000, 'price_end' => 40_000_000,
                    'description' => 'Gathering korporat 100–500 karyawan di Medan dan sekitarnya. Termasuk venue, games & outbound, entertainment, gala dinner, awards, MC profesional, dan souvenir perusahaan.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Festival Kota & Budaya',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 50_000_000, 'price_end' => 180_000_000,
                    'description' => 'Penyelenggaraan festival kota, perayaan HUT daerah, atau event budaya berskala besar 5.000–50.000+ pengunjung. Meliputi stage produksi, artis nasional, perizinan, keamanan, dan liputan media.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Sound & Stage Production',
                    'category' => 'sound-system-lighting',
                    'price_start' => 7_000_000, 'price_end' => 22_000_000,
                    'description' => 'Layanan produksi panggung + sound system untuk event Medan: stage truss, sound PA system, lighting moving head, generator, dan tim teknisi berpengalaman. Kapasitas 200–3.000 penonton.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dekorasi & Backdrop Event',
                    'category' => 'dekorasi',
                    'price_start' => 3_000_000, 'price_end' => 10_000_000,
                    'description' => 'Dekorasi dan backdrop untuk event korporat atau festival: banner, spanduk, gate entrance, photo booth corner, dan seluruh elemen visual sesuai identitas brand atau tema acara.',
                    'is_featured' => false,
                ],
            ],

            // ── Wedding Organizer: Solo (adat Jawa) ─────────────────────────
            'harmoni-pernikahan' => [
                [
                    'name'     => 'Paket Full Wedding Adat Jawa',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 22_000_000, 'price_end' => 48_000_000,
                    'description' => 'Perpaduan adat Jawa dan sentuhan modern untuk 200–400 tamu. Dekorasi tradisional-kontemporer, busana adat premium, foto & video dokumenter, MC bilingual, dan paket katering prasmanan.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Rias Adat Jawa (Paes Ageng)',
                    'category' => 'rias-busana',
                    'price_start' => 3_500_000, 'price_end' => 8_000_000,
                    'description' => 'Rias pengantin adat Jawa Paes Ageng oleh penata rias bersertifikat. Termasuk sanggul, kebaya dan beskap (sewa), riasan sungkeman, dan riasan untuk prosesi siraman & midodareni.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Katering Tradisional Jawa',
                    'category' => 'catering',
                    'price_start' => 4_000_000, 'price_end' => 12_000_000,
                    'description' => 'Katering pernikahan dengan menu tradisional Jawa: nasi liwet, gudeg, soto, rawon, dan beragam lauk pauk otentik. Tersedia untuk 100–400 tamu dengan sajian prasmanan atau rantangan.',
                    'is_featured' => false,
                ],
                [
                    'name'     => 'Paket Gamelan & Hiburan Tradisional',
                    'category' => 'mc-hiburan',
                    'price_start' => 2_500_000, 'price_end' => 6_000_000,
                    'description' => 'Penyediaan grup gamelan Jawa, MC pranatacara bilingual (Jawa-Indonesia), wayang kulit ringkas, atau tari-tarian tradisional sebagai hiburan dalam resepsi pernikahan adat.',
                    'is_featured' => true,
                ],
            ],

            // ── Event Organizer: Jakarta (konferensi) ───────────────────────
            'summit-event-conference' => [
                [
                    'name'     => 'Paket Full Conference & Business Forum',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 25_000_000, 'price_end' => 55_000_000,
                    'description' => 'Konferensi bisnis, forum regional, atau simposium 200–600 peserta. Termasuk concept & design, stage produksi, pembicara nasional, live streaming, seminar kit, dan dinner pembukaan.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Grand Event & International Conference',
                    'category' => 'paket-lengkap-full-event-wedding',
                    'price_start' => 80_000_000, 'price_end' => 300_000_000,
                    'description' => 'Konferensi internasional atau grand event 500–2.000+ peserta. Full production: protokoler, penerjemah simultan, artis tamu, gala dinner, media center, dan laporan pasca acara komprehensif.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Sound System & Multimedia',
                    'category' => 'sound-system-lighting',
                    'price_start' => 8_000_000, 'price_end' => 25_000_000,
                    'description' => 'Produksi audio-visual konferensi: sound system, microphone wireless, LED screen besar, laptop/presenter switcher, live streaming setup, dan operator multimedia berpengalaman. Kapasitas 100–1.000 peserta.',
                    'is_featured' => true,
                ],
                [
                    'name'     => 'Paket Dokumentasi Konferensi',
                    'category' => 'dokumentasi-foto-video',
                    'price_start' => 4_000_000, 'price_end' => 10_000_000,
                    'description' => 'Dokumentasi profesional acara konferensi: foto editorial & candid, video recap highlight 5 menit, dan short teaser 60 detik untuk publikasi media sosial. Pengiriman file dalam 14 hari kerja.',
                    'is_featured' => false,
                ],
            ],
        ];

        foreach ($data as $slug => $packages) {
            $brandId = Brands::where('slug', $slug)->value('id');
            if (!$brandId) {
                continue;
            }
            foreach ($packages as $pkg) {
                BrandPackages::firstOrCreate(
                    ['brand_id' => $brandId, 'name' => $pkg['name']],
                    [
                        'service_category_id' => $cat($pkg['category']),
                        'price_start'         => $pkg['price_start'],
                        'price_end'           => $pkg['price_end'],
                        'description'         => $pkg['description'],
                        'cover_image'         => null,
                        'is_featured'         => $pkg['is_featured'],
                    ]
                );
            }
        }
    }
}
