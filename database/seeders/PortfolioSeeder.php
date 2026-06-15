<?php

namespace Database\Seeders;

use App\Models\BrandPortfolios;
use App\Models\Brands;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'dinar-wedding-organizer' => [
                ['The Wedding of Sarah & Rafi', 'Pernikahan', '2025-09-14', 'Resepsi ballroom 350 tamu dengan dekorasi gold-ivory dan koordinasi penuh hari-H.'],
                ['Intimate Akad Nikah Putri', 'Akad Nikah', '2025-11-02', 'Akad nikah intimate 80 tamu bernuansa earthy dan hangat.'],
            ],
            'lumina-wedding-organizer' => [
                ['Rustic Garden Wedding', 'Pernikahan', '2025-08-23', 'Pernikahan outdoor rustic di Bandung dengan band akustik dan dekorasi taman.'],
            ],
            'needs-wedding-organizer' => [
                ['Wedding Hemat Andi & Tika', 'Pernikahan', '2025-07-19', 'Pernikahan terjangkau namun rapi untuk 200 tamu di gedung mitra.'],
            ],
            'mj-storia' => [
                ['Cinematic Story: Dini & Yoga', 'Pernikahan', '2025-10-05', 'Highlight video sinematik dan album foto dengan pendekatan storytelling.'],
                ['Corporate Gala Documentation', 'Event Korporat', '2025-12-01', 'Dokumentasi gala dinner perusahaan teknologi.'],
            ],
            'benang-merah' => [
                ['Decor: Maroon Elegance', 'Pernikahan', '2025-09-28', 'Dekorasi grand bernuansa maroon dengan floral installation.'],
            ],
            'mars-production' => [
                ['Tech Summit Production', 'Event Korporat', '2025-11-15', 'Produksi panggung, multimedia, sound & lighting untuk summit 1.000 peserta.'],
            ],
            'endless-production' => [
                ['Beach Wedding in Uluwatu', 'Pernikahan', '2025-10-22', 'Dokumentasi & sound untuk pernikahan tepi pantai dengan tamu internasional.'],
            ],
        ];

        foreach ($data as $slug => $portfolios) {
            $brand = Brands::where('slug', $slug)->first();
            if (!$brand) continue;

            foreach ($portfolios as [$title, $type, $date, $desc]) {
                BrandPortfolios::firstOrCreate(
                    ['brand_id' => $brand->id, 'title' => $title],
                    ['event_type' => $type, 'event_date' => $date, 'deskripsi' => $desc]
                );
            }
        }
    }
}
