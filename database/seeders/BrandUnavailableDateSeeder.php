<?php

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
                    ['reason' => 'Sudah ada booking']
                );
            }
        }
    }
}
