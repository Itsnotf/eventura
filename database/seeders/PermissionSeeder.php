<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'users index',
            'users create',
            'users edit',
            'users delete',
            'roles index',
            'roles create',
            'roles edit',
            'roles delete',
            'brands index',
            'brands create',
            'brands edit',
            'brands delete',
            'brands show',
            'brands packages index',
            'brands packages create',
            'brands packages edit',
            'brands packages delete',
            'brands packages show',
            'brands portfolios index',
            'brands portfolios create',
            'brands portfolios edit',
            'brands portfolios delete',
            'brands portfolios show',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission]);
        }
    }
}
