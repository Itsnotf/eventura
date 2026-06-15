<?php

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
            ['dinar-wedding-organizer', 'Paket Catering Prasmanan'],
            ['benang-merah',           'Dekorasi Grand'],
            ['mj-storia',              'Dokumentasi Gold Cinematic'],
            ['mars-production',        'Sound & Lighting Pro'],
            ['lumina-wedding-organizer','Paket MC & Hiburan'],
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
    }
}
