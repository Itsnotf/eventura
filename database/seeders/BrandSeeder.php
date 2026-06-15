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
                'owner' => 'dinar@dinarwo.id',
                'name' => 'Dinar Wedding Organizer', 'slug' => 'dinar-wedding-organizer',
                'category' => ['WO'], 'is_verified' => true,
                'description' => 'Dinar Wedding Organizer menghadirkan pernikahan elegan dan terorganisir di Jakarta. Dari konsep intimate hingga grand ballroom, tim kami menangani koordinasi penuh hari-H dengan detail yang rapi.',
                'address' => 'Jl. Cikini Raya No. 21, Menteng, Jakarta Pusat 10330',
                'whatsapp_number' => '081200000001', 'instagram' => '@dinar.wo', 'website' => 'www.dinarwo.id',
            ],
            [
                'owner' => 'lumina@luminawo.id',
                'name' => 'Lumina Wedding Organizer', 'slug' => 'lumina-wedding-organizer',
                'category' => ['WO'], 'is_verified' => true,
                'description' => 'Lumina Wedding Organizer spesialis pernikahan bernuansa hangat dan modern di Bandung. Kami memadukan dekorasi estetik, hiburan, dan koordinasi profesional untuk hari yang berkesan.',
                'address' => 'Jl. Setiabudhi No. 89, Sukasari, Bandung 40154',
                'whatsapp_number' => '081200000002', 'instagram' => '@lumina.wo', 'website' => 'www.luminawo.id',
            ],
            [
                'owner' => 'needs@needswo.id',
                'name' => 'Needs Wedding Organizer', 'slug' => 'needs-wedding-organizer',
                'category' => ['WO'], 'is_verified' => false,
                'description' => 'Needs Wedding Organizer membantu pasangan di Surabaya mewujudkan pernikahan sesuai kebutuhan dan anggaran. Fleksibel, transparan, dan detail dalam setiap perencanaan.',
                'address' => 'Jl. Mayjend Sungkono No. 12, Dukuh Pakis, Surabaya 60224',
                'whatsapp_number' => '081200000003', 'instagram' => '@needs.wo', 'website' => 'www.needswo.id',
            ],
            [
                'owner' => 'mj@mjstoria.id',
                'name' => 'MJ Storia', 'slug' => 'mj-storia',
                'category' => ['WO', 'EO'], 'is_verified' => true,
                'description' => 'MJ Storia adalah rumah dokumentasi & produksi yang menangkap cerita di setiap momen. Foto dan video sinematik untuk pernikahan maupun acara, dengan gaya storytelling yang khas.',
                'address' => 'Jl. Prawirotaman No. 7, Mergangsan, Yogyakarta 55153',
                'whatsapp_number' => '081200000004', 'instagram' => '@mjstoria', 'website' => 'www.mjstoria.id',
            ],
            [
                'owner' => 'hello@benangmerah.id',
                'name' => 'Benang Merah', 'slug' => 'benang-merah',
                'category' => ['WO'], 'is_verified' => false,
                'description' => 'Benang Merah adalah studio dekorasi & styling yang merangkai detail menjadi suasana. Konsep dekorasi custom, undangan, dan styling pengantin yang rapi dan bermakna.',
                'address' => 'Jl. Pandanaran No. 30, Semarang Tengah, Semarang 50134',
                'whatsapp_number' => '081200000005', 'instagram' => '@benangmerah.decor', 'website' => 'www.benangmerah.id',
            ],
            [
                'owner' => 'reza@marsproduction.id',
                'name' => 'Mars Production', 'slug' => 'mars-production',
                'category' => ['EO'], 'is_verified' => true,
                'description' => 'Mars Production adalah event production house untuk acara korporat, konser kecil, dan gala. Spesialis sound system, lighting, panggung, dan hiburan dengan standar profesional.',
                'address' => 'Jl. TB Simatupang No. 50, Cilandak, Jakarta Selatan 12430',
                'whatsapp_number' => '081200000006', 'instagram' => '@mars.production', 'website' => 'www.marsproduction.id',
            ],
            [
                'owner' => 'gede@endlessproduction.id',
                'name' => 'Endless Production', 'slug' => 'endless-production',
                'category' => ['EO', 'WO'], 'is_verified' => false,
                'description' => 'Endless Production menggarap dokumentasi dan produksi acara di Bali. Dari pernikahan tepi pantai hingga event korporat, kami menyatukan visual, audio, dan hiburan dalam satu tangan.',
                'address' => 'Jl. Sunset Road No. 100, Kuta, Badung, Bali 80361',
                'whatsapp_number' => '081200000007', 'instagram' => '@endless.production', 'website' => 'www.endlessproduction.id',
            ],
        ];

        foreach ($brands as $b) {
            $user = User::where('email', $b['owner'])->first();
            if (!$user) continue;

            Brands::firstOrCreate(
                ['slug' => $b['slug']],
                [
                    'user_id'         => $user->id,
                    'name'            => $b['name'],
                    'category'        => $b['category'],
                    'logo'            => null,
                    'cover_image'     => null,
                    'description'     => $b['description'],
                    'address'         => $b['address'],
                    'whatsapp_number' => $b['whatsapp_number'],
                    'instagram'       => $b['instagram'],
                    'website'         => $b['website'],
                    'is_active'       => true,
                    'featured_count'  => 0,
                    'is_verified'     => $b['is_verified'],
                    'verified_at'     => $b['is_verified'] ? now() : null,
                ]
            );
        }
    }
}
