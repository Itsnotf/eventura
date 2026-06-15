# Eventura — Rancang Ulang Seeder (semua modul, 7 brand)

> Menyertai `eventura-v3-plan.md`. Seeder ini mengasumsikan **migration terkoreksi dari rencana v3 sudah dijalankan** — khususnya: `event_plan_items` punya `price_start_snapshot` & `price_end_snapshot` (R1.2), `inquiries` punya `read_at`/`vendor_response`/`responded_at`/`is_archived`/`closed_at` (R1.1), dan tabel `site_settings` (R1.3). Semua seeder **idempotent**.
>
> **Tujuan data demo:** membuktikan fitur, bukan sekadar mengisi. Maka sengaja ada: testimoni tersembunyi (membuktikan rata-rata dihitung dari SEMUA testimoni — A2), rencana lintas vendor (membuktikan total RENTANG — D5/R1.2), dan inquiry dengan status event-driven (membuktikan A3).

7 brand & kategorinya (kategori brand = EO/WO; kategori layanan ada di paket):

| Brand | Kategori | Kota | Spesialisasi paket |
|---|---|---|---|
| Dinar Wedding Organizer | WO | Jakarta | Paket lengkap, dekorasi, catering, rias |
| Lumina Wedding Organizer | WO | Bandung | Paket lengkap, dekorasi, MC, catering |
| Needs Wedding Organizer | WO | Surabaya | Paket lengkap, venue, rias, undangan |
| MJ Storia | WO, EO | Yogyakarta | Dokumentasi (foto/video), sound |
| Benang Merah | WO | Semarang | Dekorasi & styling, undangan, rias |
| Mars Production | EO | Jakarta | Sound & lighting, MC, paket event |
| Endless Production | EO, WO | Bali | Dokumentasi, sound, MC |

---

## Urutan `DatabaseSeeder`

```php
<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            ServiceCategorySeeder::class,   // kategori layanan dulu (dipakai paket)
            UserSeeder::class,              // admin + 7 vendor + customer
            BrandSeeder::class,             // 7 brand (butuh user vendor)
            BrandPackagesSeeder::class,     // paket (butuh brand + kategori layanan)
            PortfolioSeeder::class,
            TestimonialSeeder::class,       // butuh brand + customer
            FavoritesSeeder::class,         // butuh brand + customer
            EventPlanSeeder::class,         // butuh paket (snapshot harga)
            InquirySeeder::class,           // butuh brand + customer (+ plan)
            BrandUnavailableDateSeeder::class,
            SiteSettingSeeder::class,       // konten Tentang/Kontak
        ]);
    }
}
```

---

## `PermissionSeeder` — tambahan untuk Site Settings

Tambahkan dua permission baru ke array `$permissions` yang sudah ada (sisanya tidak berubah):

```php
            // Admin: pengaturan situs (Tentang & Kontak)
            'site settings index', 'site settings edit',
```

## `RoleSeeder` — tidak perlu menambah daftar vendor/user

Admin sudah `syncPermissions(Permission::all())` sehingga otomatis mendapat `site settings *`. Vendor & customer tidak berubah. (Pastikan `Gate::before` admin sudah ada sesuai rencana.)

## `ServiceCategorySeeder` — tetap

Seeder kategori layanan yang sekarang **sudah benar** (10 kategori + backfill "Paket Lengkap"). Tidak diubah.

---

## `UserSeeder` — admin + 7 vendor + customer

```php
<?php
// database/seeders/UserSeeder.php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ───────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin Eventura', 'password' => 'password', 'email_verified_at' => now()]
        );
        $admin->syncRoles(['admin']);

        // ── Vendor (pemilik 7 brand) ────────────────────────────
        $vendors = [
            ['name' => 'Dinar Maheswari', 'email' => 'dinar@dinarwo.id'],
            ['name' => 'Lumina Sari',     'email' => 'lumina@luminawo.id'],
            ['name' => 'Nisa Rahmadani',  'email' => 'needs@needswo.id'],
            ['name' => 'Mikael Joshua',   'email' => 'mj@mjstoria.id'],
            ['name' => 'Rara Anjani',     'email' => 'hello@benangmerah.id'],
            ['name' => 'Reza Mahendra',   'email' => 'reza@marsproduction.id'],
            ['name' => 'Gede Adnyana',    'email' => 'gede@endlessproduction.id'],
        ];
        foreach ($vendors as $v) {
            $u = User::firstOrCreate(
                ['email' => $v['email']],
                ['name' => $v['name'], 'password' => 'password', 'email_verified_at' => now()]
            );
            $u->syncRoles(['vendor']);
        }

        // ── Customer (pelanggan) ────────────────────────────────
        $customers = [
            ['name' => 'Demo Customer', 'email' => 'customer@gmail.com'],
            ['name' => 'Aulia Putri',   'email' => 'aulia@example.com'],
            ['name' => 'Bagas Pratama', 'email' => 'bagas@example.com'],
            ['name' => 'Citra Lestari', 'email' => 'citra@example.com'],
        ];
        foreach ($customers as $c) {
            $u = User::firstOrCreate(
                ['email' => $c['email']],
                ['name' => $c['name'], 'password' => 'password', 'email_verified_at' => now()]
            );
            $u->syncRoles(['user']);
        }
    }
}
```

---

## `BrandSeeder` — 7 brand

> `cover_image`/`logo` sengaja `null` (realistis: vendor/admin mengunggah setelahnya; UI harus punya fallback). Verifikasi sebagian brand untuk mendemokan badge.

```php
<?php
// database/seeders/BrandSeeder.php
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
```

---

## `BrandPackagesSeeder` — paket lintas kategori layanan (harga numerik)

> Disusun agar simulasi mix-and-match bermakna: layanan yang sama tersebar di beberapa vendor sehingga user bisa membandingkan & memadukan.

```php
<?php
// database/seeders/BrandPackagesSeeder.php
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
```

---

## `PortfolioSeeder` — 1–2 portfolio per brand

> Ingat kolomnya `deskripsi` (bukan `description`). Gambar dibuat 1–2 placeholder `null`-path opsional; di sini fokus pada record portfolio (gambar bisa diunggah belakangan).

```php
<?php
// database/seeders/PortfolioSeeder.php
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
```

---

## `TestimonialSeeder` — termasuk testimoni TERSEMBUNYI (membuktikan A2)

> **Penting:** Dinar WO sengaja diberi rating 5 (publish) + rating 3 (TIDAK publish). Maka rata-rata yang benar = **4.0** dan harus tetap 4.0 di publik meski yang tampil hanya yang 5 — inilah pembuktian "rata-rata dari semua testimoni".

```php
<?php
// database/seeders/TestimonialSeeder.php
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
            ['mj-storia', 'customer@gmail.com', 2, 'Beberapa file menyusul agak lama dari janji.', false], // disembunyikan

            ['benang-merah', 'aulia@example.com', 4, 'Dekorasi sesuai konsep, detailnya rapi.', true],

            ['mars-production', 'bagas@example.com', 5, 'Sound & lighting event kantor kami sangat profesional.', true],

            ['endless-production', 'citra@example.com', 4, 'Dokumentasi pantai hasilnya keren, timnya sigap.', true],
        ];

        foreach ($rows as [$slug, $email, $rating, $body, $published]) {
            $brandId = $b($slug);
            $userId  = $u($email);
            if (!$brandId || !$userId) continue;

            // unique (brand_id, user_id) → firstOrCreate aman
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
```

---

## `FavoritesSeeder` — shortlist customer

```php
<?php
// database/seeders/FavoritesSeeder.php
namespace Database\Seeders;

use App\Models\Brands;
use App\Models\Favorites;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoritesSeeder extends Seeder
{
    public function run(): void
    {
        $u = fn (string $email) => User::where('email', $email)->value('id');
        $b = fn (string $slug)  => Brands::where('slug', $slug)->value('id');

        $pairs = [
            ['aulia@example.com', 'dinar-wedding-organizer'],
            ['aulia@example.com', 'mj-storia'],
            ['aulia@example.com', 'benang-merah'],
            ['bagas@example.com', 'needs-wedding-organizer'],
            ['bagas@example.com', 'mars-production'],
            ['citra@example.com', 'lumina-wedding-organizer'],
            ['citra@example.com', 'endless-production'],
        ];

        foreach ($pairs as [$email, $slug]) {
            $userId  = $u($email);
            $brandId = $b($slug);
            if (!$userId || !$brandId) continue;

            Favorites::firstOrCreate(['user_id' => $userId, 'brand_id' => $brandId]);
        }
    }
}
```

---

## `EventPlanSeeder` — rencana LINTAS VENDOR (membuktikan total RENTANG)

> Mengambil paket dari **vendor & kategori layanan berbeda** (maks 1 per kategori), menyimpan snapshot **start & end** agar UI menampilkan rentang total = Σ start … Σ end. Asumsi skema R1.2 (`price_start_snapshot`, `price_end_snapshot`).

```php
<?php
// database/seeders/EventPlanSeeder.php
namespace Database\Seeders;

use App\Models\BrandPackages;
use App\Models\EventPlanItems;
use App\Models\EventPlans;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventPlanSeeder extends Seeder
{
    public function run(): void
    {
        $aulia = User::where('email', 'aulia@example.com')->first();
        if (!$aulia) return;

        $plan = EventPlans::firstOrCreate(
            ['user_id' => $aulia->id, 'name' => 'Pernikahan Impian — 250 Tamu'],
            ['event_date' => now()->addMonths(4)->toDateString(), 'event_type' => 'Pernikahan', 'notes' => 'Padukan vendor terbaik per kebutuhan.']
        );

        // Pilih paket dari kategori berbeda & vendor berbeda (mix & match ideal)
        $picks = [
            ['dinar-wedding-organizer', 'Paket Catering Prasmanan'],     // catering
            ['benang-merah',           'Dekorasi Grand'],               // dekorasi
            ['mj-storia',              'Dokumentasi Gold Cinematic'],   // dokumentasi
            ['mars-production',        'Sound & Lighting Pro'],         // sound
            ['lumina-wedding-organizer','Paket MC & Hiburan'],          // mc
        ];

        foreach ($picks as [$brandSlug, $pkgName]) {
            $package = BrandPackages::with('brand')
                ->whereHas('brand', fn ($q) => $q->where('slug', $brandSlug))
                ->where('name', $pkgName)
                ->first();
            if (!$package) continue;

            EventPlanItems::firstOrCreate(
                ['event_plan_id' => $plan->id, 'brand_package_id' => $package->id],
                [
                    'brand_id'             => $package->brand_id,
                    'service_category_id'  => $package->service_category_id,
                    'price_start_snapshot' => $package->price_start,
                    'price_end_snapshot'   => $package->price_end,
                    'package_name_snapshot'=> $package->name,
                    'brand_name_snapshot'  => $package->brand->name,
                ]
            );
        }
        // Total rentang yang diharapkan UI: Σ start … Σ end dari 5 item di atas.
    }
}
```

---

## `InquirySeeder` — status EVENT-DRIVEN + balasan (membuktikan A3)

> Menampilkan seluruh siklus jujur: `pending` (belum dibuka), `read` (`read_at` terisi), `responded` (`vendor_response` + `responded_at` terisi), `closed` (`closed_at`, ditutup customer), dan satu inquiry yang berasal dari rencana (`event_plan_id`). Asumsi skema R1.1.

```php
<?php
// database/seeders/InquirySeeder.php
namespace Database\Seeders;

use App\Models\Brands;
use App\Models\EventPlans;
use App\Models\Inquiries;
use App\Models\User;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        $u = fn (string $email) => User::where('email', $email)->value('id');
        $b = fn (string $slug)  => Brands::where('slug', $slug)->value('id');

        $plan = EventPlans::where('name', 'Pernikahan Impian — 250 Tamu')->first();

        // pending — baru dikirim, belum dibuka vendor
        Inquiries::firstOrCreate(
            ['user_id' => $u('bagas@example.com'), 'brand_id' => $b('needs-wedding-organizer'), 'event_type' => 'Pernikahan'],
            [
                'event_date' => now()->addMonths(5)->toDateString(),
                'message'    => 'Halo, saya tertarik paket wedding hemat untuk 200 tamu. Boleh minta rincian harganya?',
                'status'     => 'pending',
            ]
        );

        // read — sudah dibuka vendor (read_at terisi)
        Inquiries::firstOrCreate(
            ['user_id' => $u('citra@example.com'), 'brand_id' => $b('mj-storia'), 'event_type' => 'Pernikahan'],
            [
                'event_date' => now()->addMonths(3)->toDateString(),
                'message'    => 'Apakah paket dokumentasi gold tersedia tanggal yang saya pilih?',
                'status'     => 'read',
                'read_at'    => now()->subDays(1),
            ]
        );

        // responded — vendor sudah membalas (responded otomatis karena ada balasan)
        Inquiries::firstOrCreate(
            ['user_id' => $u('aulia@example.com'), 'brand_id' => $b('benang-merah'), 'event_type' => 'Pernikahan'],
            [
                'event_date'      => now()->addMonths(4)->toDateString(),
                'message'         => 'Minta penawaran dekorasi grand maroon untuk ballroom 300 tamu.',
                'status'          => 'responded',
                'read_at'         => now()->subDays(2),
                'vendor_response' => 'Terima kasih, Kak Aulia. Untuk ballroom 300 tamu konsep maroon, estimasi 18–28 juta. Boleh kami jadwalkan survei lokasi minggu depan?',
                'responded_at'    => now()->subDays(1),
            ]
        );

        // closed — ditutup oleh customer
        Inquiries::firstOrCreate(
            ['user_id' => $u('bagas@example.com'), 'brand_id' => $b('mars-production'), 'event_type' => 'Event Korporat'],
            [
                'event_date'      => now()->addMonths(2)->toDateString(),
                'message'         => 'Butuh sound & lighting untuk gathering kantor 300 orang.',
                'status'          => 'closed',
                'read_at'         => now()->subDays(6),
                'vendor_response' => 'Siap, kami available. Sudah kami kirim proposal ke email Bapak.',
                'responded_at'    => now()->subDays(5),
                'closed_at'       => now()->subDays(3),
            ]
        );

        // dari rencana simulasi (event_plan_id terisi)
        if ($plan) {
            Inquiries::firstOrCreate(
                ['user_id' => $u('aulia@example.com'), 'brand_id' => $b('mj-storia'), 'event_type' => 'Pernikahan'],
                [
                    'event_plan_id' => $plan->id,
                    'event_date'    => $plan->event_date,
                    'message'       => 'Halo MJ Storia, paket dokumentasi gold ini bagian dari rencana pernikahan saya. Mohon info ketersediaannya.',
                    'status'        => 'pending',
                ]
            );
        }
    }
}
```

---

## `BrandUnavailableDateSeeder` — tanggal penuh

```php
<?php
// database/seeders/BrandUnavailableDateSeeder.php
namespace Database\Seeders;

use App\Models\BrandUnavailableDates;
use App\Models\Brands;
use Illuminate\Database\Seeder;

class BrandUnavailableDateSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            'dinar-wedding-organizer' => [now()->addMonths(4)->toDateString(), now()->addMonths(4)->addDays(7)->toDateString()],
            'mj-storia'               => [now()->addMonths(3)->toDateString()],
            'mars-production'         => [now()->addMonths(2)->toDateString(), now()->addMonths(2)->addDay()->toDateString()],
        ];

        foreach ($map as $slug => $dates) {
            $brand = Brands::where('slug', $slug)->first();
            if (!$brand) continue;

            foreach ($dates as $date) {
                BrandUnavailableDates::firstOrCreate(
                    ['brand_id' => $brand->id, 'date' => $date],
                    ['note' => 'Sudah ada booking']
                );
            }
        }
    }
}
```

---

## `SiteSettingSeeder` — konten Tentang Kami & Kontak (#12)

> Mengisi registry setelan editable. `type` menentukan input di editor admin; `image` menyimpan path (di-seed kosong agar admin mengunggah).

```php
<?php
// database/seeders/SiteSettingSeeder.php
namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // group, key, type, label, value, sort
            ['about',   'about.headline',     'text',     'Judul Tentang Kami',     'Menghubungkan Anda dengan EO & WO Terbaik', 1],
            ['about',   'about.subheadline',  'text',     'Subjudul',               'Eventura memudahkan Anda menemukan, membandingkan, dan menghubungi vendor acara tepercaya.', 2],
            ['about',   'about.body',         'textarea', 'Cerita / Deskripsi',     'Eventura lahir dari satu keyakinan: merencanakan acara seharusnya menyenangkan, bukan membingungkan. Kami menyatukan vendor Event Organizer dan Wedding Organizer dalam satu tempat agar Anda bisa membandingkan paket, melihat portofolio, dan menyusun rencana dengan percaya diri.', 3],
            ['about',   'about.mission',      'textarea', 'Misi Kami',              'Memberdayakan pasangan dan penyelenggara acara dengan informasi yang jujur dan transparan, serta membantu vendor lokal berkembang.', 4],
            ['about',   'about.image',        'image',    'Gambar Utama',           '', 5],

            ['contact', 'contact.address',    'textarea', 'Alamat',                 'Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan 12190', 1],
            ['contact', 'contact.email',      'email',    'Email',                  'halo@eventura.id', 2],
            ['contact', 'contact.phone',      'text',     'Telepon',                '(021) 5000-1234', 3],
            ['contact', 'contact.whatsapp',   'text',     'WhatsApp',               '081200001234', 4],
            ['contact', 'contact.instagram',  'url',      'Instagram',              'https://instagram.com/eventura.id', 5],
            ['contact', 'contact.maps_embed', 'textarea', 'Embed Peta (URL/iframe)','', 6],
        ];

        foreach ($settings as [$group, $key, $type, $label, $value, $sort]) {
            SiteSettings::firstOrCreate(
                ['key' => $key],
                ['group' => $group, 'type' => $type, 'label' => $label, 'value' => $value, 'sort' => $sort]
            );
        }
    }
}
```

---

## Cara menjalankan

```bash
php artisan migrate:fresh --seed
# atau, di DB existing, jalankan per-seeder yang idempotent:
php artisan db:seed --class=ServiceCategorySeeder
php artisan db:seed --class=BrandSeeder
# ...dst sesuai urutan DatabaseSeeder
```

## Yang dibuktikan oleh data ini

- **Rata-rata rating dari SEMUA testimoni (A2):** Dinar WO punya 5 (tampil) + 3 (disembunyikan) → rata-rata harus **4.0** dan tetap 4.0 di publik. MJ Storia punya 5,5 (tampil) + 2 (disembunyikan) → rata-rata **4.0**. Jika halaman publik menampilkan 5.0, berarti R2.1 belum benar.
- **Simulasi RENTANG (D5/R1.2):** rencana Aulia berisi 5 paket lintas vendor/kategori; UI harus menampilkan total sebagai rentang (Σ start … Σ end), bukan satu angka.
- **Status inquiry jujur (A3):** ada contoh pending/read/responded/closed dengan `read_at`/`vendor_response`/`responded_at`/`closed_at` terisi sesuai peristiwa — bukan status yang diketik bebas.
- **Badge verified (#6):** sebagian brand `is_verified=true`, sebagian `false` — untuk menguji badge & permission verifikasi.
- **Mix EO/WO (A1):** kategori brand hanya EO/WO; kategori layanan hanya di paket.
