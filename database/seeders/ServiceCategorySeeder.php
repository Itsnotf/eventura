<?php

namespace Database\Seeders;

use App\Models\BrandPackages;
use App\Models\ServiceCategories;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Paket Lengkap (Full Event/Wedding)',
            'Catering',
            'Dekorasi',
            'Dokumentasi (Foto & Video)',
            'Rias & Busana',
            'Sound System & Lighting',
            'Venue / Gedung',
            'MC & Hiburan',
            'Undangan & Souvenir',
            'Lainnya',
        ];

        foreach ($categories as $name) {
            ServiceCategories::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }

        // Backfill existing packages to "Paket Lengkap"
        $paketLengkap = ServiceCategories::where('slug', 'paket-lengkap-full-event-wedding')->first();

        if ($paketLengkap) {
            BrandPackages::whereNull('service_category_id')
                ->update(['service_category_id' => $paketLengkap->id]);
        }
    }
}
