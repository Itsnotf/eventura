<?php

namespace Database\Seeders;

use App\Models\BrandPortfolios;
use App\Models\Brands;
use App\Models\ImagePortfolios;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    private int $imgCounter = 1;

    public function run(): void
    {
        $portfolioData = [
            'mahkota-bridal-event' => [
                [
                    'title'      => 'Pernikahan Adat Jawa – Reza & Ayu',
                    'deskripsi'  => 'Momen sakral pernikahan adat Jawa yang digelar di Gedung Balai Kartini Jakarta. Prosesi siraman, midodareni, hingga resepsi berlangsung khidmat dan penuh haru. Kehadiran 350 tamu dari berbagai penjuru membuat hari bersejarah ini semakin meriah.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-01-20',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Resepsi Modern Ballroom – Dika & Nisa',
                    'deskripsi'  => 'Pernikahan bertema white & gold modern di Ballroom Grand Hyatt Jakarta. Dekorasi bunga mawar putih yang memukau, live string quartet, dan dinner fine dining menjadikan malam ini tak terlupakan bagi 450 tamu undangan.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-03-10',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Intimate Garden Wedding – Bayu & Sari',
                    'deskripsi'  => 'Pernikahan intimate di taman pribadi dengan nuansa bohemian yang hangat dan personal. Hanya 80 tamu terpilih yang hadir menyaksikan momen bersatunya dua insan dalam suasana kebun bunga yang indah.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-05-18',
                    'img_count'  => 4,
                ],
            ],

            'nuansa-event-pro' => [
                [
                    'title'      => 'Annual Gathering PT Maju Bersama 2024',
                    'deskripsi'  => 'Event gathering tahunan PT Maju Bersama yang dihadiri 600 karyawan dari seluruh Indonesia. Acara berlangsung selama satu hari penuh dengan sesi team building, talkshow inspiratif, games interaktif, dan gala dinner yang berkesan.',
                    'event_type' => 'Corporate Event',
                    'event_date' => '2024-02-14',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Product Launch – Samsung Galaxy S24 Bandung',
                    'deskripsi'  => 'Peluncuran resmi Samsung Galaxy S24 di kota Bandung dengan konsep futuristik yang memukau. Dihadiri 200 media dan influencer pilihan, acara menciptakan buzz yang luar biasa di media sosial nasional.',
                    'event_type' => 'Product Launch',
                    'event_date' => '2024-01-08',
                    'img_count'  => 3,
                ],
                [
                    'title'      => 'Seminar Nasional Teknologi Pendidikan 2024',
                    'deskripsi'  => 'Seminar dua hari yang menghadirkan 12 pembicara nasional di bidang edtech dan inovasi pendidikan. Diikuti 800 peserta dari seluruh Jawa Barat, acara ini menjadi forum terbesar di kategorinya di tahun 2024.',
                    'event_type' => 'Seminar',
                    'event_date' => '2024-04-22',
                    'img_count'  => 3,
                ],
            ],

            'permata-wedding' => [
                [
                    'title'      => 'Pernikahan Mewah – Kevin & Jennifer',
                    'deskripsi'  => 'Pernikahan mewah bertema garden party di Ballroom Shangri-La Surabaya. Dekorasi bunga segar impor yang spektakuler, live jazz band, dan sajian kuliner kelas dunia membuat 500 tamu undangan terpukau sepanjang malam.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-02-25',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Akad Nikah & Resepsi – Bintang & Lestari',
                    'deskripsi'  => 'Akad nikah khidmat di Masjid Al-Akbar Surabaya dilanjutkan resepsi malam yang megah. Konsep intimate namun berkesan dengan tamu 250 orang, dekorasi navy blue & gold, serta video sinematik yang menyentuh hati.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-04-14',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Outdoor Beach Wedding – Rizky & Dian',
                    'deskripsi'  => 'Pernikahan outdoor di tepi pantai Banyuwangi dengan view Selat Bali yang memesona. Upacara sore hari dengan golden hour yang sempurna, disaksikan 120 tamu dalam suasana romantis angin laut dan bunga tropis.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-06-01',
                    'img_count'  => 4,
                ],
            ],

            'gala-event-solutions' => [
                [
                    'title'      => 'Pernikahan Internasional – James & Dewi',
                    'deskripsi'  => 'Pernikahan pasangan internasional yang menggabungkan tradisi Jawa dan Eropa di Yogyakarta. Prosesi midodareni di keraton dilanjutkan resepsi di Royal Ambarrukmo Hotel, dihadiri tamu dari 8 negara.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-03-30',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Gala Dinner Anniversary PT Nusantara Abadi',
                    'deskripsi'  => 'Perayaan HUT ke-25 PT Nusantara Abadi dalam format gala dinner mewah di Ballroom Hotel Tentrem Yogyakarta. Dihadiri 300 tamu VIP termasuk pejabat daerah dan mitra bisnis strategis.',
                    'event_type' => 'Corporate Event',
                    'event_date' => '2024-05-05',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Festival Seni & Budaya Yogyakarta 2024',
                    'deskripsi'  => 'Festival seni dan budaya dua hari di Alun-Alun Kidul Yogyakarta yang menampilkan 40+ pertunjukan seni tradisional dan kontemporer. Dikunjungi lebih dari 15.000 pengunjung dari berbagai provinsi.',
                    'event_type' => 'Festival',
                    'event_date' => '2024-07-10',
                    'img_count'  => 4,
                ],
            ],

            'elegan-bali-wedding' => [
                [
                    'title'      => 'Cliff Wedding – Michael & Sofia',
                    'deskripsi'  => 'Upacara pernikahan dramatis di tebing Uluwatu dengan latar belakang Samudra Hindia yang memukau. Pasangan dari Australia ini memilih Bali untuk momen terpenting mereka, disaksikan 60 tamu dalam suasana sunset yang magis.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-01-28',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Pernikahan Adat Bali – Made & Putri',
                    'deskripsi'  => 'Upacara pernikahan adat Bali yang autentik dan penuh makna spiritual. Ritual metatah, pawiwahan, dan mepamit berlangsung di pura keluarga, dilanjutkan pesta adat yang meriah dengan tarian kecak dan gamelan.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-04-06',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Sunset Ceremony Nusa Dua – Thomas & Elisa',
                    'deskripsi'  => 'Pernikahan pinggir pantai di Nusa Dua dengan konsep tropical luxury. Ceremony di atas pasir putih saat golden hour, dilanjutkan dinner di atas platform kayu terapung dengan cahaya lilin dan bintang.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-06-15',
                    'img_count'  => 4,
                ],
            ],

            'proevent-indonesia' => [
                [
                    'title'      => 'Konser Musik Nusantara 2024 – Jakarta',
                    'deskripsi'  => 'Konser musik spektakuler menampilkan 8 artis papan atas Indonesia di Jakarta International Stadium. Disaksikan 25.000 penonton, acara ini menjadi salah satu konser terbesar tahun 2024 dengan production value kelas dunia.',
                    'event_type' => 'Concert',
                    'event_date' => '2024-03-08',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Jakarta Corporate Summit 2024',
                    'deskripsi'  => 'Forum bisnis tahunan terbesar di Indonesia yang menghadirkan 50 pembicara dari dalam dan luar negeri. Dihadiri 1.200 eksekutif dan pemilik bisnis, acara berlangsung 2 hari di Jakarta Convention Center.',
                    'event_type' => 'Conference',
                    'event_date' => '2024-05-20',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Pameran UMKM Jakarta Barat 2024',
                    'deskripsi'  => 'Pameran UMKM terbesar di Jakarta Barat menampilkan 300 booth dari berbagai kategori produk lokal. Dibuka oleh Wakil Gubernur DKI Jakarta, acara berlangsung 4 hari dengan 20.000+ pengunjung.',
                    'event_type' => 'Exhibition',
                    'event_date' => '2024-07-25',
                    'img_count'  => 4,
                ],
            ],

            'bunga-raya-wedding' => [
                [
                    'title'      => 'Pernikahan Megah – Fajar & Lestari',
                    'deskripsi'  => 'Pernikahan mewah di Ballroom Hotel Santika Premiere Semarang dengan dekorasi bunga mawar merah muda yang memenuhi seluruh ruangan. Dihadiri 500 tamu dengan sajian dinner dan hiburan live band yang meriah.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-02-10',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Garden Party Wedding – Anto & Sinta',
                    'deskripsi'  => 'Pernikahan outdoor garden party di villa tepi Rawa Pening Semarang. Nuansa alam yang asri, dekorasi bohemian dengan wildflowers, dan catering BBQ outdoor menjadikan acara ini sangat berkesan untuk 200 tamu.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-05-25',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Sweet Intimate Wedding – Yuda & Ratna',
                    'deskripsi'  => 'Pernikahan intimate penuh kasih untuk 75 tamu dekat dan keluarga. Dekorasi pink & white yang manis, sesi foto vintage, dan suasana kekeluargaan yang hangat menciptakan kenangan indah untuk pasangan muda ini.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-08-03',
                    'img_count'  => 3,
                ],
            ],

            'spektra-events' => [
                [
                    'title'      => 'Perayaan HUT Kota Medan ke-434',
                    'deskripsi'  => 'Event perayaan ulang tahun Kota Medan ke-434 yang megah di Lapangan Merdeka Medan. Menampilkan pertunjukan seni, parade budaya, pesta kembang api, dan konser artis lokal yang dihadiri 30.000+ warga kota.',
                    'event_type' => 'Festival',
                    'event_date' => '2024-07-01',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Seminar Bisnis & Investasi Sumatera 2024',
                    'deskripsi'  => 'Forum seminar bisnis dan investasi terbesar di Sumatera yang menghadirkan 20 narasumber nasional. Diikuti 700 pelaku usaha dan investor dari seluruh Sumatera di Hermes Palace Hotel Medan.',
                    'event_type' => 'Seminar',
                    'event_date' => '2024-04-15',
                    'img_count'  => 3,
                ],
                [
                    'title'      => 'Annual Award Night – PT Sawit Utama Indonesia',
                    'deskripsi'  => 'Malam penghargaan tahunan PT Sawit Utama Indonesia untuk karyawan berprestasi. Acara gala dinner bertema masquerade ball dengan dekorasi glamor, hiburan special performance, dan pemberian award kepada 50 karyawan terbaik.',
                    'event_type' => 'Corporate Event',
                    'event_date' => '2024-06-28',
                    'img_count'  => 4,
                ],
            ],

            'harmoni-pernikahan' => [
                [
                    'title'      => 'Akad & Resepsi Adat Jawa – Bagas & Rini',
                    'deskripsi'  => 'Pernikahan lengkap dengan rangkaian adat Jawa dari siraman pagi hingga resepsi malam di Gedung Batari Solo. Busana adat paes ageng yang memukau, gamelan Jawa yang merdu, dan 400 tamu yang turut berbahagia.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-01-14',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Pernikahan Solo Putri – Bimo & Anis',
                    'deskripsi'  => 'Pernikahan Solo Putri yang elegan dan sakral di Pendopo Agung Surakarta. Prosesi adat yang dijaga keasliannya dengan sentuhan modern pada dekorasi dan dokumentasi, menghadirkan nuansa kebangsawanan Jawa yang autentik.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-04-20',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Modern Wedding Reception – Yogi & Sarah',
                    'deskripsi'  => 'Perpaduan adat Jawa dan konsep modern dalam satu resepsi yang harmonis. Akad nikah bernuansa tradisional dilanjutkan resepsi kontemporer dengan dekorasi minimalis mewah untuk 300 tamu di The Sunan Hotel Solo.',
                    'event_type' => 'Wedding',
                    'event_date' => '2024-07-13',
                    'img_count'  => 4,
                ],
            ],

            'summit-event-conference' => [
                [
                    'title'      => 'Makassar International Business Forum 2024',
                    'deskripsi'  => 'Forum bisnis internasional pertama di Makassar yang menghadirkan pembicara dari 10 negara. Diikuti 800 peserta dari kawasan Indonesia Timur, ASEAN, dan Australia di Trans Convention Center Makassar.',
                    'event_type' => 'Conference',
                    'event_date' => '2024-03-22',
                    'img_count'  => 4,
                ],
                [
                    'title'      => 'Pesta Rakyat HUT RI ke-79 – Makassar',
                    'deskripsi'  => 'Perayaan kemerdekaan RI ke-79 yang meriah di Pantai Losari Makassar. Menampilkan parade budaya Sulawesi, konser artis nasional, pesta kembang api, dan berbagai perlombaan rakyat yang dihadiri 50.000+ warga.',
                    'event_type' => 'Festival',
                    'event_date' => '2024-08-17',
                    'img_count'  => 5,
                ],
                [
                    'title'      => 'Corporate Team Building – PT Semen Tonasa',
                    'deskripsi'  => 'Program team building outdoor 2 hari 1 malam di Malino Highlands untuk 250 karyawan PT Semen Tonasa. Outbound activities, leadership workshop, gala dinner BBQ, dan penghargaan karyawan terbaik dalam suasana alam pegunungan.',
                    'event_type' => 'Corporate Event',
                    'event_date' => '2024-06-10',
                    'img_count'  => 3,
                ],
            ],
        ];

        foreach ($portfolioData as $slug => $portfolios) {
            $brand = Brands::where('slug', $slug)->first();
            if (!$brand) {
                continue;
            }

            $this->command->info("  Brand: {$brand->name}");

            foreach ($portfolios as $pData) {
                $portfolio = BrandPortfolios::firstOrCreate(
                    ['brand_id' => $brand->id, 'title' => $pData['title']],
                    [
                        'deskripsi'  => $pData['deskripsi'],
                        'event_type' => $pData['event_type'],
                        'event_date' => $pData['event_date'],
                    ]
                );

                if ($portfolio->images()->count() === 0) {
                    for ($i = 1; $i <= $pData['img_count']; $i++) {
                        $seed      = "port-img-{$this->imgCounter}";
                        $localPath = "portfolios/img-{$this->imgCounter}.jpg";
                        $this->imgCounter++;

                        $savedPath = $this->downloadImage(
                            "https://picsum.photos/seed/{$seed}/900/600",
                            $localPath
                        );

                        if ($savedPath) {
                            ImagePortfolios::create([
                                'brand_portfolio_id' => $portfolio->id,
                                'image'              => $savedPath,
                            ]);
                        }
                    }

                    $this->command->info("    ✓ {$pData['title']} ({$pData['img_count']} images)");
                }
            }
        }
    }

    protected function downloadImage(string $url, string $localPath): ?string
    {
        try {
            $ctx = stream_context_create([
                'http' => [
                    'timeout'         => 30,
                    'follow_location' => true,
                    'user_agent'      => 'Mozilla/5.0 (compatible; Laravel-Seeder/1.0)',
                ],
                'ssl' => [
                    'verify_peer'      => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $data = @file_get_contents($url, false, $ctx);
            if ($data === false) {
                return null;
            }

            $fullPath = storage_path('app/public/' . $localPath);
            $dir      = dirname($fullPath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            file_put_contents($fullPath, $data);
            return $localPath;
        } catch (\Throwable) {
            return null;
        }
    }
}
