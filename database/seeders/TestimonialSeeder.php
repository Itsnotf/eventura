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
        $customer = User::where('email', 'customer@gmail.com')->first();

        if (!$customer) {
            return;
        }

        $samples = [
            [
                'slug'   => 'mahkota-bridal-event',
                'rating' => 5,
                'body'   => 'Pelayanannya sangat profesional dan detail. Tim Mahkota Bridal benar-benar membuat hari pernikahan kami menjadi sempurna. Sangat direkomendasikan!',
            ],
            [
                'slug'   => 'nuansa-event-pro',
                'rating' => 4,
                'body'   => 'Dekorasi sangat sesuai konsep yang kami minta. Komunikasi tim lancar dan responsif. Hanya ada sedikit keterlambatan di hari H, tapi semuanya berjalan dengan baik.',
            ],
            [
                'slug'   => 'permata-wedding-organizer',
                'rating' => 5,
                'body'   => 'Luar biasa! Semua detail diperhatikan dengan sangat teliti. Tamu undangan pun memuji keindahan dekorasi dan kelancaran acara. Terima kasih Permata Wedding!',
            ],
        ];

        foreach ($samples as $s) {
            $brand = Brands::where('slug', $s['slug'])->first();

            if (!$brand) {
                continue;
            }

            Testimonials::firstOrCreate(
                ['brand_id' => $brand->id, 'user_id' => $customer->id],
                [
                    'rating'       => $s['rating'],
                    'body'         => $s['body'],
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(5, 30)),
                ]
            );
        }
    }
}
