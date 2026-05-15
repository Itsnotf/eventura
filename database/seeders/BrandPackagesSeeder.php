<?php

namespace Database\Seeders;

use App\Models\BrandPackages;
use App\Models\Brands;
use Illuminate\Database\Seeder;

class BrandPackagesSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'mahkota-bridal-event' => [
                [
                    'name'        => 'Paket Intimate Wedding',
                    'price_start' => 10000000,
                    'price_end'   => 20000000,
                    'description' => 'Paket pernikahan intimate untuk 50–100 tamu undangan. Termasuk koordinasi penuh hari-H, dekorasi minimalis elegan, MC profesional, dokumentasi foto & video, serta catering premium. Cocok untuk pernikahan sederhana namun berkesan.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Standard Wedding',
                    'price_start' => 25000000,
                    'price_end'   => 55000000,
                    'description' => 'Paket pernikahan standar untuk 200–400 tamu. Termasuk koordinasi penuh, dekorasi ballroom, bridal make-up & gown, MC, sound system, dokumentasi lengkap, catering buffet, dan undangan digital.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Grand Royal Wedding',
                    'price_start' => 80000000,
                    'price_end'   => 180000000,
                    'description' => 'Paket pernikahan mewah untuk 500–1000 tamu. Termasuk dekorasi tema custom, live entertainment, catering multi-menu, foto & video sinematik, luxury transportation, dan tim koordinasi 15+ orang.',
                    'is_featured' => false,
                ],
            ],

            'nuansa-event-pro' => [
                [
                    'name'        => 'Paket Corporate Meeting',
                    'price_start' => 5000000,
                    'price_end'   => 15000000,
                    'description' => 'Paket untuk rapat korporat, town hall, atau internal gathering hingga 150 peserta. Termasuk venue setup, sound system, backdrop branding, notulensi, dan konsumsi snack & makan siang.',
                    'is_featured' => false,
                ],
                [
                    'name'        => 'Paket Seminar & Conference',
                    'price_start' => 20000000,
                    'price_end'   => 50000000,
                    'description' => 'Penyelenggaraan seminar, workshop, atau konferensi 200–500 peserta. Termasuk pendaftaran online, backdrop & stage design, LED screen, live streaming, moderator & MC, serta seminar kit.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Gala Dinner & Grand Event',
                    'price_start' => 60000000,
                    'price_end'   => 200000000,
                    'description' => 'Penyelenggaraan gala dinner mewah, annual gathering, atau award night 300–1000+ tamu. Termasuk venue design, entertainment artis, dinner mewah, photo booth, dan full dokumentasi.',
                    'is_featured' => true,
                ],
            ],

            'permata-wedding' => [
                [
                    'name'        => 'Paket Rustic & Garden Wedding',
                    'price_start' => 12000000,
                    'price_end'   => 28000000,
                    'description' => 'Pernikahan bertema rustic atau outdoor garden untuk 80–200 tamu. Dekorasi bunga segar, backdrop bohemian, koordinasi penuh hari-H, foto pre-wedding & hari-H, serta catering standing party.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Premium Ballroom',
                    'price_start' => 40000000,
                    'price_end'   => 85000000,
                    'description' => 'Paket ballroom premium untuk 300–600 tamu. Termasuk dekorasi mewah dengan lampu chandelier, bridal package lengkap, MC bilingual, live band, catering fine dining, dan video highlight sinematik.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket VIP Royal Wedding',
                    'price_start' => 100000000,
                    'price_end'   => 250000000,
                    'description' => 'Pernikahan eksklusif VIP untuk 500–1500 tamu dengan layanan all-inclusive. Desain dekorasi bespoke, artis hiburan, photobooth & souvenir mewah, honeymoon package, dan dedicated wedding planner selama 6 bulan.',
                    'is_featured' => false,
                ],
            ],

            'gala-event-solutions' => [
                [
                    'name'        => 'Paket Wedding Internasional',
                    'price_start' => 80000000,
                    'price_end'   => 200000000,
                    'description' => 'Pernikahan berkelas internasional di venue terbaik Yogyakarta. Melayani pasangan lokal dan mancanegara dengan konsep custom, interpreter, concierge tamu VIP, dan dokumentasi sinematik kelas dunia.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Corporate Event',
                    'price_start' => 20000000,
                    'price_end'   => 65000000,
                    'description' => 'Pengelolaan event korporat skala menengah: gathering 100–500 orang, product launch, company anniversary. Termasuk creative concept, venue dressing, multimedia, entertainment, dan full day coordination.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Festival & Pameran',
                    'price_start' => 30000000,
                    'price_end'   => 120000000,
                    'description' => 'Penyelenggaraan festival seni, pameran, atau event publik 1.000–10.000+ pengunjung. Termasuk layout planning, perizinan, stage production, artis, vendor management, dan keamanan.',
                    'is_featured' => false,
                ],
            ],

            'elegan-bali-wedding' => [
                [
                    'name'        => 'Paket Outdoor Garden Ceremony',
                    'price_start' => 15000000,
                    'price_end'   => 32000000,
                    'description' => 'Pernikahan outdoor di taman villa atau resort Bali untuk 50–150 tamu. Dekorasi tropis dengan bunga frangipani, alunan gamelan, foto & video, serta dinner romantis setelah upacara.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Cliff & Ocean Ceremony',
                    'price_start' => 45000000,
                    'price_end'   => 90000000,
                    'description' => 'Upacara pernikahan ikonik di tebing atau tepi pantai Bali untuk 30–100 tamu. Lokasi eksklusif di Uluwatu atau Nusa Dua, sunset ceremony, floral arch custom, drone footage, dan dinner candlelight.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Full Bali Wedding Experience',
                    'price_start' => 110000000,
                    'price_end'   => 320000000,
                    'description' => 'Paket lengkap 3 hari 2 malam wedding experience di Bali. Termasuk pre-wedding shoot, traditional Balinese blessing ceremony, grand reception di resort bintang 5, honeymoon night, dan guest shuttle management.',
                    'is_featured' => false,
                ],
            ],

            'proevent-indonesia' => [
                [
                    'name'        => 'Paket Konser & Live Show',
                    'price_start' => 60000000,
                    'price_end'   => 250000000,
                    'description' => 'Penyelenggaraan konser musik, stand-up comedy, atau live show 500–5000+ penonton. Termasuk stage production, sound & lighting profesional, artis management, tiket online, keamanan, dan media coverage.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Pameran & Expo',
                    'price_start' => 25000000,
                    'price_end'   => 60000000,
                    'description' => 'Penyelenggaraan pameran produk, expo UMKM, atau trade show 50–200 booth. Termasuk layout, dekorasi booth, promosi digital, registrasi pengunjung, dan laporan pasca acara.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Product Launch',
                    'price_start' => 35000000,
                    'price_end'   => 90000000,
                    'description' => 'Peluncuran produk yang berkesan dengan konsep kreatif, media invite, live streaming, interactive experience, sample distribution, dan press kit. Ideal untuk brand besar maupun startup.',
                    'is_featured' => false,
                ],
            ],

            'bunga-raya-wedding' => [
                [
                    'name'        => 'Paket Sweet Wedding',
                    'price_start' => 8000000,
                    'price_end'   => 18000000,
                    'description' => 'Paket pernikahan budget-friendly namun tetap indah untuk 50–150 tamu. Dekorasi bunga mawar merah muda, koordinasi hari-H, MC, foto dokumentasi, dan catering prasmanan sederhana.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Classic Ballroom Wedding',
                    'price_start' => 28000000,
                    'price_end'   => 58000000,
                    'description' => 'Pernikahan klasik di ballroom hotel Semarang untuk 200–400 tamu. Dekorasi bunga segar tema white & gold, bridal makeup & gown, photo & video sinematik, live acoustic, dan catering buffet.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Mewah Premium',
                    'price_start' => 75000000,
                    'price_end'   => 140000000,
                    'description' => 'Pernikahan mewah tak terlupakan untuk 500–800 tamu. All-inclusive dengan dekorasi floral luxury, live orchestra, video mapping, souvenir premium, dan dedicated planner selama 4 bulan.',
                    'is_featured' => false,
                ],
            ],

            'spektra-events' => [
                [
                    'name'        => 'Paket Event Komunitas & UMKM',
                    'price_start' => 5000000,
                    'price_end'   => 15000000,
                    'description' => 'Penyelenggaraan event komunitas, bazaar, atau gathering UMKM hingga 500 orang. Termasuk tata panggung sederhana, MC lokal, sound system, dan promosi media sosial.',
                    'is_featured' => false,
                ],
                [
                    'name'        => 'Paket Corporate Gathering',
                    'price_start' => 18000000,
                    'price_end'   => 40000000,
                    'description' => 'Gathering korporat 100–500 karyawan di Medan dan sekitarnya. Termasuk venue, games & outbound, entertainment, gala dinner, awards, dan souvenir perusahaan.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Festival Kota & Budaya',
                    'price_start' => 50000000,
                    'price_end'   => 180000000,
                    'description' => 'Penyelenggaraan festival kota, perayaan HUT daerah, atau event budaya berskala besar 5.000–50.000+ pengunjung. Meliputi stage produksi, artis nasional, perizinan, keamanan, dan liputan media.',
                    'is_featured' => true,
                ],
            ],

            'harmoni-pernikahan' => [
                [
                    'name'        => 'Paket Adat Jawa Sederhana',
                    'price_start' => 7000000,
                    'price_end'   => 16000000,
                    'description' => 'Paket pernikahan adat Jawa lengkap dengan siraman, midodareni, dan ijab kabul untuk 100–200 tamu. Termasuk koordinasi prosesi adat, rias pengantin paes ageng, gamelan, dan katering tradisional.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Pernikahan Modern Adat',
                    'price_start' => 22000000,
                    'price_end'   => 48000000,
                    'description' => 'Perpaduan adat Jawa dan sentuhan modern untuk 200–400 tamu. Dekorasi tradisional-kontemporer, busana adat premium, foto & video dokumenter, MC bilingual, dan paket katering prasmanan.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Full Service Exclusive',
                    'price_start' => 65000000,
                    'price_end'   => 125000000,
                    'description' => 'Pernikahan eksklusif full service 3 hari untuk 400–700 tamu. Meliputi seluruh rangkaian prosesi adat, dekorasi mewah, artis hiburan Jawa, katering premium, dan manajemen tamu VIP.',
                    'is_featured' => false,
                ],
            ],

            'summit-event-conference' => [
                [
                    'name'        => 'Paket Business Meeting & Workshop',
                    'price_start' => 5000000,
                    'price_end'   => 12000000,
                    'description' => 'Penyelenggaraan rapat bisnis, workshop, atau training 30–100 peserta. Termasuk meeting room setup, proyektor & sound, konsumsi, dokumentasi, dan administrasi peserta.',
                    'is_featured' => false,
                ],
                [
                    'name'        => 'Paket Conference & Business Forum',
                    'price_start' => 25000000,
                    'price_end'   => 55000000,
                    'description' => 'Konferensi bisnis, forum regional, atau simposium 200–600 peserta. Termasuk concept & design, stage produksi, pembicara nasional, live streaming, seminar kit, dan dinner pembukaan.',
                    'is_featured' => true,
                ],
                [
                    'name'        => 'Paket Grand Event & International Conference',
                    'price_start' => 80000000,
                    'price_end'   => 300000000,
                    'description' => 'Konferensi internasional atau grand event 500–2000+ peserta. Full production termasuk protokoler, penerjemah simultan, artis tamu, gala dinner malam, media center, dan laporan pasca acara komprehensif.',
                    'is_featured' => true,
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
                        'price_start' => $pkg['price_start'],
                        'price_end'   => $pkg['price_end'],
                        'description' => $pkg['description'],
                        'cover_image' => null,
                        'is_featured' => $pkg['is_featured'],
                    ]
                );
            }
        }
    }
}
