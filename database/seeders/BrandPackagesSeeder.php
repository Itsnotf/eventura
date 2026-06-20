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
        $cats = ServiceCategories::pluck('id', 'slug')->all();
        $cat  = fn (string $slug): int => $cats[$slug] ?? $cats['lainnya'];

        // Include bersama untuk brand yang memakai satu daftar fasilitas untuk semua paket.
        $needsInclude  = 'WO full service, tim 8–12 crew, dekorasi, catering sesuai jumlah tamu, makeup & busana pengantin, MC, live music, dokumentasi, wedding cake, bridal room, dan gladi bersih.';
        $luminaInclude = 'WO full service, 8–12 crew, catering sesuai jumlah tamu, dekorasi premium, makeup & busana pengantin, MC, live music, dokumentasi, wedding cake, bridal room, dan gladi bersih.';
        $marsInclude   = 'Event planner, rundown acara, crew 10–20 orang, MC, sound system, lighting, dokumentasi, registration desk, backdrop, LED screen (paket tertentu), dekorasi, dan guest star.';

        $PL  = 'paket-lengkap-full-event-wedding';
        $KMS = 'konten-media-sosial';
        $CAT = 'catering';

        // brand-slug => [ [name, category-slug, price_start, price_end, description, is_featured], ... ]
        $data = [
            'dinar-wedding-organizer' => [
                ['Paket Rumahan – 300 Pax', $PL, 35_000_000, null, 'Untuk 300 tamu. Sudah termasuk: WO full service, 6 crew on duty, dekorasi pelaminan standar, makeup pengantin & keluarga inti, busana pengantin, MC, sound system, dokumentasi foto & video, buku tamu & kotak angpao, rundown acara, dan koordinasi vendor.', false],
                ['Paket Gedung Sukaria – 500 Pax', $PL, 55_000_000, null, 'Untuk 500 tamu. Sudah termasuk: sewa Gedung Sukaria, WO full service, 8 crew, dekorasi premium, makeup & busana pengantin, MC, live music akustik, dokumentasi, sound system, dan gladi bersih.', true],
                ['Paket Graha Limbersa – 1000 Pax', $PL, 115_000_000, null, 'Untuk 1000 tamu. Sudah termasuk: venue Graha Limbersa, catering 1000 pax, dekorasi premium, 10 crew WO, makeup & busana pengantin, dokumentasi foto video, MC, entertainment, bridal room, dan wedding cake.', true],
                ['Paket Hotel The Zuri – 700 Pax', $PL, 135_000_000, null, 'Untuk 700 tamu. Sudah termasuk: ballroom The Zuri, catering 700 pax, dekorasi premium, WO full service, MC, live music, dokumentasi, wedding cake, bridal room, dan 10 crew WO.', false],
                ['Paket Gedung Kebun Gede – 600 Pax', $PL, 70_000_000, null, 'Untuk 600 tamu. Sudah termasuk: Gedung Kebun Gede, catering 600 pax, dekorasi, makeup & busana pengantin, MC, sound system, dokumentasi, dan 8 crew WO.', false],
            ],
            'needs-wedding-organizer' => [
                ['Paket Rumahan – 350 Pax', $PL, 40_000_000, null, 'Untuk 350 tamu. Sudah termasuk: ' . $needsInclude, false],
                ['Paket Asrama Haji – 800 Pax', $PL, 100_000_000, null, 'Untuk 800 tamu. Sudah termasuk: ' . $needsInclude, true],
                ['Paket Canopy Function Hall – 500 Pax', $PL, 75_000_000, null, 'Untuk 500 tamu. Sudah termasuk: ' . $needsInclude, false],
                ['Paket Dermaga Convention Center – 1000 Pax', $PL, 150_000_000, null, 'Untuk 1000 tamu. Sudah termasuk: ' . $needsInclude, true],
                ['Paket Hotel Harper – 600 Pax', $PL, 120_000_000, null, 'Untuk 600 tamu. Sudah termasuk: ' . $needsInclude, false],
            ],
            'lumina-wedding-organizer' => [
                ['Paket Rumahan – 400 Pax', $PL, 45_000_000, null, 'Untuk 400 tamu. Sudah termasuk: ' . $luminaInclude, false],
                ['Paket Balai Diklat – 500 Pax', $PL, 65_000_000, null, 'Untuk 500 tamu. Sudah termasuk: ' . $luminaInclude, false],
                ['Paket Mandiri Ballroom – 1000 Pax', $PL, 145_000_000, null, 'Untuk 1000 tamu. Sudah termasuk: ' . $luminaInclude, true],
                ['Paket OPI Convention Center – 800 Pax', $PL, 120_000_000, null, 'Untuk 800 tamu. Sudah termasuk: ' . $luminaInclude, true],
                ['Paket Hotel Beston – 650 Pax', $PL, 110_000_000, null, 'Untuk 650 tamu. Sudah termasuk: ' . $luminaInclude, false],
            ],
            'endless-creative-production' => [
                ['Seminar Package', $PL, 10_000_000, null, 'Sudah termasuk: event planner, 10 crew, MC, sound system, dokumentasi, registration desk, pembicara, dan dekorasi simple.', false],
                ['Corporate Gathering Package', $PL, 15_000_000, null, 'Sudah termasuk: 12 crew, MC, backdrop, sound system, dokumentasi, rundown acara, dan dekorasi.', false],
                ['Birthday Party Package', $PL, 15_000_000, null, 'Untuk 100 tamu, venue di cafe. Sudah termasuk: dekorasi, MC, sound system, dokumentasi, games, dan souvenir.', false],
                ['Product Launching Package', $PL, 35_000_000, null, 'Sudah termasuk: event organizer, 15 crew, LED screen, lighting, MC, dokumentasi, dekorasi, dan guest star.', true],
                ['Concert Package', $PL, 100_000_000, null, 'Sudah termasuk: event management, 20 crew, stage, lighting, sound system, LED screen, talent handling, dokumentasi, guest star + rides, dan logistik.', true],
            ],
            'mars-production' => [
                ['Workshop Package', $PL, 20_000_000, null, 'Sudah termasuk: ' . $marsInclude, false],
                ['Seminar Nasional Package', $PL, 15_000_000, null, 'Sudah termasuk: ' . $marsInclude, false],
                ['Gathering Package', $PL, 25_000_000, null, 'Sudah termasuk: ' . $marsInclude, false],
                ['Anniversary Event Package', $PL, 30_000_000, null, 'Sudah termasuk: ' . $marsInclude, true],
                ['Music Festival Package', $PL, 120_000_000, null, 'Sudah termasuk: ' . $marsInclude, true],
            ],
            'benang-merah' => [
                ['Simpul Package', $KMS, 315_000, null, 'Standby maksimal 2 jam + free 1 jam, 1 reels recap, 7 story Instagram, 1 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', false],
                ['Rajutan Package', $KMS, 400_000, null, 'Standby maksimal 4 jam + free 1 jam, unlimited story, 1 reels recap, BTS content, 2 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', true],
                ['Tenun Package', $KMS, 525_000, null, 'Standby maksimal 7 jam + free 1 jam, unlimited story, 2 reels recap, 1 BTS content, 2 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', true],
            ],
            'mj-storia' => [
                ['Memoir Package', $KMS, 315_000, null, 'Benefit setara paket dasar: standby maksimal 2 jam + free 1 jam, 1 reels recap, 7 story Instagram, 1 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', false],
                ['Chronicle Package', $KMS, 400_000, null, 'Benefit setara paket menengah: standby maksimal 4 jam + free 1 jam, unlimited story, 1 reels recap, BTS content, 2 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', true],
                ['Legacy Package', $KMS, 525_000, null, 'Benefit setara paket premium: standby maksimal 7 jam + free 1 jam, unlimited story, 2 reels recap, 1 BTS content, 2 trend TikTok by request, 1 crew on duty, free random photo, dan all raw files.', true],
            ],
            'kuliner-wong-kito' => [
                ['Paket Syukuran', $CAT, 3_500_000, null, '100 porsi. Menu: nasi putih, ayam goreng, sambal, sayur, dan air mineral.', false],
                ['Paket Arisan Keluarga', $CAT, 6_500_000, null, '150 porsi. Menu: aneka lauk, buah, dessert, dan minuman.', false],
                ['Paket Ulang Tahun', $CAT, 12_000_000, null, '250 porsi. Menu: buffet, snack box, dessert, dan soft drink.', false],
                ['Paket Lamaran', $CAT, 18_000_000, null, '300 porsi. Menu khas Palembang: pempek, tekwan, dessert, dengan waiters.', true],
                ['Paket Pernikahan Wong Kito', $CAT, 45_000_000, null, '500 porsi. Prasmanan lengkap: pempek kapal selam, tekwan, model, es kacang merah, dessert, stall makanan, waiters, dan peralatan makan lengkap.', true],
            ],
        ];

        foreach ($data as $slug => $packages) {
            $brand = Brands::where('slug', $slug)->first();
            if (!$brand) continue;

            foreach ($packages as [$name, $catSlug, $start, $end, $desc, $featured]) {
                BrandPackages::firstOrCreate(
                    ['brand_id' => $brand->id, 'name' => $name],
                    [
                        'service_category_id' => $cat($catSlug),
                        'price_start'         => $start,
                        'price_end'           => $end,
                        'description'         => $desc,
                        'cover_image'         => null,
                        'is_featured'         => $featured,
                    ]
                );
            }
        }
    }
}
