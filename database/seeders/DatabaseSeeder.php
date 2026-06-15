<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            ServiceCategorySeeder::class,
            UserSeeder::class,
            BrandSeeder::class,
            BrandPackagesSeeder::class,
            PortfolioSeeder::class,
            TestimonialSeeder::class,
            FavoritesSeeder::class,
            EventPlanSeeder::class,
            InquirySeeder::class,
            BrandUnavailableDateSeeder::class,
            SiteSettingSeeder::class,
        ]);
    }
}
