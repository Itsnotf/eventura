<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin  = Role::firstOrCreate(['name' => 'admin',  'guard_name' => 'web']);
        $vendor = Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);
        $user   = Role::firstOrCreate(['name' => 'user',   'guard_name' => 'web']);

        // Admin gets ALL permissions explicitly so hasAnyPermission() works on the frontend.
        $admin->syncPermissions(Permission::all());

        // Vendor permissions
        $vendorPermissions = [
            'brands index', 'brands create', 'brands edit', 'brands show',
            'brands packages index', 'brands packages create', 'brands packages edit',
            'brands packages delete', 'brands packages show',
            'brands portfolios index', 'brands portfolios create', 'brands portfolios edit',
            'brands portfolios delete', 'brands portfolios show',
            'testimonials index', 'testimonials moderate',
            'inquiries index', 'inquiries show', 'inquiries update',
            'availability manage',
        ];

        // Customer (user) permissions
        $userPermissions = [
            'testimonials create',
            'favorites index', 'favorites create', 'favorites delete',
            'event plans index', 'event plans create', 'event plans edit', 'event plans delete',
            'inquiries create',
        ];



        $vendor->syncPermissions(Permission::whereIn('name', $vendorPermissions)->get());
        $user->syncPermissions(Permission::whereIn('name', $userPermissions)->get());
    }
}
