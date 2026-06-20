<?php

namespace Database\Seeders;

use App\Models\Brands;
use App\Models\User;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        // Embed Google Maps sementara (NAKA SIGNATURE, Palembang) — disimpan sebagai URL src.
        // Nanti tiap vendor bisa mengganti lewat form brand.
        $maps = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.4023916126876!2d104.74149459698945!3d-2.9857035193349106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b7508da0f56a1%3A0x8b64644ca138db6d!2sNAKA%20SIGNATURE!5e0!3m2!1sid!2sid!4v1781983009350!5m2!1sid!2sid';

        $brands = [
            [
                'owner' => 'dinar@dinarwo.id',
                'name' => 'Dinar Wedding Organizer', 'slug' => 'dinar-wedding-organizer',
                'category' => ['WO'], 'is_verified' => true,
                'description' => 'Dinar Wedding Organizer menghadirkan pernikahan elegan dan terorganisir di Palembang. Dari paket rumahan hingga gedung dan hotel berbintang, tim kami menangani koordinasi penuh hari-H dengan rapi.',
                'instagram' => 'dinar.weddingeventorganizer',
            ],
            [
                'owner' => 'needs@needswo.id',
                'name' => 'Needs Wedding Organizer', 'slug' => 'needs-wedding-organizer',
                'category' => ['WO'], 'is_verified' => false,
                'description' => 'Needs Wedding Organizer membantu pasangan di Palembang mewujudkan pernikahan sesuai kebutuhan dan anggaran — fleksibel, transparan, dan detail di setiap tahap perencanaan.',
                'instagram' => 'needs.wo',
            ],
            [
                'owner' => 'lumina@luminawo.id',
                'name' => 'Lumina Wedding Organizer', 'slug' => 'lumina-wedding-organizer',
                'category' => ['WO'], 'is_verified' => true,
                'description' => 'Lumina Wedding Organizer spesialis pernikahan bernuansa hangat dan modern di Palembang, memadukan dekorasi premium, hiburan, dan koordinasi profesional untuk hari yang berkesan.',
                'instagram' => 'lumina_weddingorganizer',
            ],
            [
                'owner' => 'endless@endlesscreative.id',
                'name' => 'Endless Creative Production', 'slug' => 'endless-creative-production',
                'category' => ['EO'], 'is_verified' => true,
                'description' => 'Endless Creative Production adalah event organizer untuk seminar, gathering korporat, product launching, hingga konser di Palembang. Konsep kreatif dengan eksekusi produksi yang matang.',
                'instagram' => 'endlesscreative_production',
            ],
            [
                'owner' => 'reza@marsproduction.id',
                'name' => 'Mars Production', 'slug' => 'mars-production',
                'category' => ['EO'], 'is_verified' => true,
                'description' => 'Mars Production menggarap beragam acara — workshop, seminar nasional, anniversary, hingga music festival — dengan tim, sound, lighting, dan panggung berstandar profesional di Palembang.',
                'instagram' => 'marspro.indonesia',
            ],
            [
                'owner' => 'hello@benangmerah.id',
                'name' => 'Benang Merah', 'slug' => 'benang-merah',
                'category' => ['CC'], 'is_verified' => false,
                'description' => 'Benang Merah adalah content creator yang menangkap momen acaramu dalam reels, story, dan konten TikTok yang rapi dan estetik, siap untuk media sosial.',
                'instagram' => 'benangmerah.cc',
            ],
            [
                'owner' => 'mj@mjstoria.id',
                'name' => 'MJ Storia', 'slug' => 'mj-storia',
                'category' => ['CC'], 'is_verified' => true,
                'description' => 'MJ Storia adalah content creator dengan gaya storytelling elegan — reels, story, dan BTS content untuk mengabadikan setiap momen acara di Palembang.',
                'instagram' => 'mj_storia',
            ],
            [
                'owner' => 'kuliner@wongkito.id',
                'name' => 'Kuliner Wong Kito', 'slug' => 'kuliner-wong-kito',
                'category' => ['Catering'], 'is_verified' => false,
                'description' => 'Kuliner Wong Kito menyajikan catering khas Palembang untuk syukuran, arisan, ulang tahun, lamaran, hingga pernikahan — dari pempek dan tekwan hingga prasmanan lengkap.',
                'instagram' => 'kuliner_wongkitoo',
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
                    'logo'            => null,         // diisi sendiri setelah seed
                    'cover_image'     => null,         // diisi sendiri setelah seed
                    'description'     => $b['description'],
                    'address'         => $maps,        // embed Google Maps (URL src)
                    'whatsapp_number' => '0895620512465',
                    'instagram'       => $b['instagram'],
                    'website'         => null,
                    'is_active'       => true,
                    'featured_count'  => 0,
                    'is_verified'     => $b['is_verified'],
                    'verified_at'     => $b['is_verified'] ? now() : null,
                ]
            );
        }
    }
}
