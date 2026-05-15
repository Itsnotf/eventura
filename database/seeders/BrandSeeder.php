<?php

namespace Database\Seeders;

use App\Models\Brands;
use App\Models\User;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'email'           => 'rina@mahkotabridal.id',
                'name'            => 'Mahkota Bridal & Event',
                'slug'            => 'mahkota-bridal-event',
                'category'        => ['WO'],
                'cover_seed'      => 'mahkota-bridal-cover',
                'description'     => 'Mahkota Bridal & Event adalah wedding organizer premium di Jakarta dengan pengalaman lebih dari 10 tahun. Kami menghadirkan pernikahan impian Anda dengan sentuhan elegan, detail yang sempurna, dan layanan penuh dari awal hingga akhir hari spesial Anda. Dipercaya oleh lebih dari 500 pasangan.',
                'address'         => 'Jl. Kemang Raya No. 45, Kebayoran Baru, Jakarta Selatan 12730',
                'whatsapp_number' => '081234567801',
                'instagram'       => '@mahkota.bridal.event',
                'website'         => 'www.mahkotabridal.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'budi@nuansaeventpro.id',
                'name'            => 'Nuansa Event Pro',
                'slug'            => 'nuansa-event-pro',
                'category'        => ['EO'],
                'cover_seed'      => 'nuansa-event-cover',
                'description'     => 'Nuansa Event Pro spesialis penyelenggara event korporat, seminar, dan gala dinner di Bandung dan sekitarnya. Tim profesional kami siap memastikan setiap acara perusahaan Anda berjalan lancar, berkesan, dan sesuai standar tertinggi.',
                'address'         => 'Jl. Asia Afrika No. 112, Lengkong, Bandung, Jawa Barat 40261',
                'whatsapp_number' => '081234567802',
                'instagram'       => '@nuansa.event.pro',
                'website'         => 'www.nuansaeventpro.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'sari@permatawedding.id',
                'name'            => 'Permata Wedding Organizer',
                'slug'            => 'permata-wedding',
                'category'        => ['WO'],
                'cover_seed'      => 'permata-wedding-cover',
                'description'     => 'Permata Wedding Organizer hadir untuk mewujudkan pernikahan idaman Anda di Surabaya dan Jawa Timur. Kami menawarkan paket pernikahan dari yang intimate hingga grand ballroom dengan dekorasi mewah dan tim berpengalaman yang siap melayani.',
                'address'         => 'Jl. Darmo Permai Selatan No. 8, Sukomanunggal, Surabaya, Jawa Timur 60189',
                'whatsapp_number' => '081234567803',
                'instagram'       => '@permata.wedding.id',
                'website'         => 'www.permatawedding.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'dian@galaevent.id',
                'name'            => 'Gala Event Solutions',
                'slug'            => 'gala-event-solutions',
                'category'        => ['EO', 'WO'],
                'cover_seed'      => 'gala-event-cover',
                'description'     => 'Gala Event Solutions adalah one-stop event organizer di Yogyakarta yang menangani pernikahan maupun event korporat. Dengan keahlian di kedua bidang, kami memastikan setiap acara — dari resepsi pernikahan hingga festival besar — terorganisir dengan sempurna.',
                'address'         => 'Jl. Pakuningratan No. 60, Jetis, Kota Yogyakarta, DI Yogyakarta 55232',
                'whatsapp_number' => '081234567804',
                'instagram'       => '@gala.event.jogja',
                'website'         => 'www.galaevent.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'agus@eleganbali.id',
                'name'            => 'Elegan Bali Wedding',
                'slug'            => 'elegan-bali-wedding',
                'category'        => ['WO'],
                'cover_seed'      => 'elegan-bali-cover',
                'description'     => 'Elegan Bali Wedding menghadirkan pernikahan impian Anda di tanah surga — Bali. Spesialis upacara di tepi tebing, pinggir pantai, hingga resort mewah. Kami melayani pasangan lokal maupun internasional dengan konsep custom yang tak tertandingi.',
                'address'         => 'Jl. Sunset Road No. 77, Kuta, Badung, Bali 80361',
                'whatsapp_number' => '081234567805',
                'instagram'       => '@elegan.bali.wedding',
                'website'         => 'www.eleganbali.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'maya@proeventindonesia.id',
                'name'            => 'ProEvent Indonesia',
                'slug'            => 'proevent-indonesia',
                'category'        => ['EO'],
                'cover_seed'      => 'proevent-cover',
                'description'     => 'ProEvent Indonesia adalah event organizer terkemuka di Jakarta yang berspesialisasi dalam konser musik, pameran, product launch, dan event skala besar. Dengan jaringan vendor terluas dan pengalaman ratusan event nasional, kami adalah pilihan utama brand-brand besar Indonesia.',
                'address'         => 'Jl. Sudirman Kav. 33, Karet Tengsin, Tanah Abang, Jakarta Pusat 10250',
                'whatsapp_number' => '081234567806',
                'instagram'       => '@proevent.indonesia',
                'website'         => 'www.proeventindonesia.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'hendra@bungarayawedding.id',
                'name'            => 'Bunga Raya Wedding',
                'slug'            => 'bunga-raya-wedding',
                'category'        => ['WO'],
                'cover_seed'      => 'bunga-raya-cover',
                'description'     => 'Bunga Raya Wedding hadir di Semarang dengan visi menghadirkan pernikahan penuh cinta dan nuansa bunga yang memukau. Tim dekorator dan koordinator kami bekerja detail untuk memastikan setiap momen pernikahan Anda menjadi kenangan abadi.',
                'address'         => 'Jl. Pemuda No. 150, Sekayu, Semarang Tengah, Kota Semarang 50132',
                'whatsapp_number' => '081234567807',
                'instagram'       => '@bunga.raya.wedding',
                'website'         => null,
                'is_active'       => true,
            ],
            [
                'email'           => 'dewi@spektraevents.id',
                'name'            => 'Spektra Events',
                'slug'            => 'spektra-events',
                'category'        => ['EO'],
                'cover_seed'      => 'spektra-cover',
                'description'     => 'Spektra Events adalah event organizer terpercaya di Sumatera Utara yang menangani festival kota, gathering perusahaan, dan event budaya. Berakar kuat di Medan, kami bangga telah menyelenggarakan ratusan acara bergengsi untuk pemerintah dan swasta.',
                'address'         => 'Jl. Gatot Subroto No. 88, Sei Sikambing B, Medan Sunggal, Kota Medan 20122',
                'whatsapp_number' => '081234567808',
                'instagram'       => '@spektra.events',
                'website'         => 'www.spektraevents.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'rudi@harmoniwedding.id',
                'name'            => 'Harmoni Pernikahan',
                'slug'            => 'harmoni-pernikahan',
                'category'        => ['WO'],
                'cover_seed'      => 'harmoni-cover',
                'description'     => 'Harmoni Pernikahan adalah wedding organizer berbasis di Solo yang mengkhususkan diri pada pernikahan adat Jawa yang sakral dan modern. Kami memahami seluk-beluk prosesi adat dan siap memadukan dengan sentuhan kontemporer untuk pernikahan yang berkesan.',
                'address'         => 'Jl. Slamet Riyadi No. 212, Sriwedari, Laweyan, Kota Surakarta 57141',
                'whatsapp_number' => '081234567809',
                'instagram'       => '@harmoni.pernikahan',
                'website'         => 'www.harmonipernikahan.id',
                'is_active'       => true,
            ],
            [
                'email'           => 'lia@summitevent.id',
                'name'            => 'Summit Event & Conference',
                'slug'            => 'summit-event-conference',
                'category'        => ['EO'],
                'cover_seed'      => 'summit-cover',
                'description'     => 'Summit Event & Conference adalah event organizer profesional di Makassar yang fokus pada konferensi bisnis, forum internasional, dan event korporat skala besar. Kami hadir untuk memastikan event Anda di Indonesia Timur terlaksana dengan standar kelas dunia.',
                'address'         => 'Jl. AP Pettarani No. 18, Tamamaung, Panakkukang, Kota Makassar 90231',
                'whatsapp_number' => '081234567810',
                'instagram'       => '@summit.event.id',
                'website'         => 'www.summitevent.id',
                'is_active'       => true,
            ],
        ];

        foreach ($brands as $data) {
            $userId = User::where('email', $data['email'])->value('id');

            $coverPath = $this->downloadImage(
                "https://picsum.photos/seed/{$data['cover_seed']}/1280/480",
                "brands/cover-{$data['slug']}.jpg"
            );

            $this->command->info("  Brand: {$data['name']} — cover " . ($coverPath ? '✓' : '✗ (null)'));

            Brands::firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'user_id'         => $userId,
                    'name'            => $data['name'],
                    'category'        => $data['category'],
                    'logo'            => null,
                    'cover_image'     => $coverPath,
                    'description'     => $data['description'],
                    'address'         => $data['address'],
                    'whatsapp_number' => $data['whatsapp_number'],
                    'instagram'       => $data['instagram'],
                    'website'         => $data['website'],
                    'is_active'       => $data['is_active'],
                    'featured_count'  => 0,
                ]
            );
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
