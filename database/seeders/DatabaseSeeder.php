<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            BrandSeeder::class,
            ServiceCategorySeeder::class,
            BrandPackagesSeeder::class,
            PortfolioSeeder::class,
        ]);
    }
}
