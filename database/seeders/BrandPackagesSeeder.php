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

        // brand-slug => [ [name, category-slug, start, end, desc, featured], ... ]
        $data = [
            'dinar-wedding-organizer' => [
                ['Paket All-In Wedding', 'paket-lengkap-full-event-wedding', 25_000_000, 60_000_000, 'Paket pernikahan menyeluruh 200–400 tamu: koordinasi hari-H, dekorasi ballroom, rias & busana, MC, sound, dokumentasi, dan catering.', true],
                ['Paket Dekorasi Pelaminan', 'dekorasi', 8_000_000, 18_000_000, 'Dekorasi pelaminan & area resepsi dengan bunga segar, backdrop, dan table setting elegan.', true],
                ['Paket Catering Prasmanan', 'catering', 15_000_000, 40_000_000, 'Catering prasmanan 200–400 porsi dengan menu nusantara & internasional, lengkap dengan pramusaji.', false],
                ['Paket Rias Pengantin', 'rias-busana', 4_000_000, 9_000_000, 'Rias pengantin modern/tradisional oleh MUA berpengalaman, termasuk trial dan busana.', false],
            ],
            'lumina-wedding-organizer' => [
                ['Paket Wedding Komplit', 'paket-lengkap-full-event-wedding', 30_000_000, 70_000_000, 'Paket pernikahan komplit dengan konsep modern: perencanaan, dekorasi, hiburan, dan koordinasi penuh.', true],
                ['Paket Dekorasi Tematik', 'dekorasi', 10_000_000, 22_000_000, 'Dekorasi tematik custom sesuai konsep pasangan, dari rustic hingga elegan minimalis.', true],
                ['Paket MC & Hiburan', 'mc-hiburan', 3_000_000, 8_000_000, 'MC profesional + band akustik/DJ untuk menghidupkan resepsi.', false],
                ['Paket Catering Premium', 'catering', 18_000_000, 45_000_000, 'Catering premium dengan live cooking station dan dessert corner.', false],
            ],
            'needs-wedding-organizer' => [
                ['Paket Wedding Hemat', 'paket-lengkap-full-event-wedding', 20_000_000, 50_000_000, 'Paket pernikahan fleksibel sesuai anggaran, tetap rapi dan berkesan untuk 150–300 tamu.', true],
                ['Sewa Venue & Gedung', 'venue-gedung', 15_000_000, 40_000_000, 'Koordinasi & sewa gedung/venue mitra dengan kapasitas beragam di Surabaya.', false],
                ['Paket Rias & Busana', 'rias-busana', 3_500_000, 8_000_000, 'Rias pengantin + sewa busana untuk akad dan resepsi.', false],
                ['Undangan & Souvenir', 'undangan-souvenir', 2_000_000, 6_000_000, 'Undangan cetak/digital dan souvenir custom sesuai jumlah tamu.', false],
            ],
            'mj-storia' => [
                ['Dokumentasi Silver', 'dokumentasi-foto-video', 4_000_000, 7_000_000, 'Dokumentasi foto pernikahan: 2 fotografer, album digital 150+ foto, siap 21 hari.', true],
                ['Dokumentasi Gold Cinematic', 'dokumentasi-foto-video', 8_000_000, 15_000_000, 'Foto + video sinematik: 2 fotografer & 1 videografer, highlight 5–7 menit, raw footage.', true],
                ['Paket Sound System', 'sound-system-lighting', 5_000_000, 12_000_000, 'Sound system & lighting untuk resepsi indoor/outdoor dengan operator.', false],
            ],
            'benang-merah' => [
                ['Dekorasi Intimate', 'dekorasi', 6_000_000, 14_000_000, 'Dekorasi intimate 50–120 tamu dengan styling rapi dan instagramable.', true],
                ['Dekorasi Grand', 'dekorasi', 15_000_000, 35_000_000, 'Dekorasi grand untuk ballroom besar: floral installation, lighting, dan panggung.', true],
                ['Undangan & Souvenir', 'undangan-souvenir', 2_500_000, 7_000_000, 'Undangan custom (cetak/digital) dan souvenir dengan desain serasi tema.', false],
                ['Styling & Rias Pengantin', 'rias-busana', 4_000_000, 9_000_000, 'Styling pengantin + rias oleh tim berpengalaman, selaras dengan dekorasi.', false],
            ],
            'mars-production' => [
                ['Sound & Lighting Pro', 'sound-system-lighting', 6_000_000, 18_000_000, 'Paket sound system & lighting skala event korporat/konser kecil dengan teknisi.', true],
                ['MC & Hiburan Event', 'mc-hiburan', 4_000_000, 12_000_000, 'MC profesional + pengisi acara/band untuk gala dan event perusahaan.', false],
                ['Paket Produksi Event', 'paket-lengkap-full-event-wedding', 35_000_000, 90_000_000, 'Produksi acara menyeluruh: panggung, multimedia, sound, lighting, dan manajemen acara.', true],
            ],
            'endless-production' => [
                ['Dokumentasi Cinematic', 'dokumentasi-foto-video', 5_000_000, 12_000_000, 'Dokumentasi sinematik pernikahan/acara di Bali dengan pendekatan storytelling.', true],
                ['Sound & Lighting', 'sound-system-lighting', 5_000_000, 14_000_000, 'Sound system & lighting untuk acara tepi pantai maupun indoor.', false],
                ['MC & Hiburan', 'mc-hiburan', 3_000_000, 9_000_000, 'MC dwibahasa + hiburan untuk acara dengan tamu lokal & internasional.', false],
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
