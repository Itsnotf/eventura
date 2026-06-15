<?php

namespace Database\Seeders;

use App\Models\Brands;
use App\Models\Testimonials;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $u = fn (string $email) => User::where('email', $email)->value('id');
        $b = fn (string $slug)  => Brands::where('slug', $slug)->value('id');

        // [brand-slug, customer-email, rating, body, is_published]
        $rows = [
            // Dinar: 5 (tampil) + 3 (disembunyikan) → rata-rata SEMUA = 4.0
            ['dinar-wedding-organizer', 'aulia@example.com', 5, 'Koordinasi hari-H sangat rapi, semua sesuai rencana. Sangat direkomendasikan!', true],
            ['dinar-wedding-organizer', 'bagas@example.com', 3, 'Hasil bagus tapi komunikasi di awal agak lambat.', false],

            ['lumina-wedding-organizer', 'citra@example.com', 5, 'Dekorasinya cantik banget dan timnya ramah. Tamu pada memuji.', true],
            ['lumina-wedding-organizer', 'aulia@example.com', 4, 'Overall memuaskan, hiburannya seru.', true],

            ['needs-wedding-organizer', 'bagas@example.com', 4, 'Fleksibel dengan budget kami, hasilnya tetap rapi.', true],

            ['mj-storia', 'citra@example.com', 5, 'Video sinematiknya bikin nangis, benar-benar nangkep momen.', true],
            ['mj-storia', 'aulia@example.com', 5, 'Fotonya estetik dan pengerjaan cepat.', true],
            ['mj-storia', 'customer@gmail.com', 2, 'Beberapa file menyusul agak lama dari janji.', false],

            ['benang-merah', 'aulia@example.com', 4, 'Dekorasi sesuai konsep, detailnya rapi.', true],

            ['mars-production', 'bagas@example.com', 5, 'Sound & lighting event kantor kami sangat profesional.', true],

            ['endless-production', 'citra@example.com', 4, 'Dokumentasi pantai hasilnya keren, timnya sigap.', true],
        ];

        foreach ($rows as [$slug, $email, $rating, $body, $published]) {
            $brandId = $b($slug);
            $userId  = $u($email);
            if (!$brandId || !$userId) continue;

            Testimonials::firstOrCreate(
                ['brand_id' => $brandId, 'user_id' => $userId],
                [
                    'rating'       => $rating,
                    'body'         => $body,
                    'is_published' => $published,
                    'published_at' => $published ? now() : null,
                ]
            );
        }
    }
}
