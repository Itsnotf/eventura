<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Admin: user & role management
            'users index', 'users create', 'users edit', 'users delete',
            'roles index', 'roles create', 'roles edit', 'roles delete',

            // Admin: brand management
            'brands index', 'brands create', 'brands edit', 'brands delete', 'brands show',
            'brands verify',

            // Vendor: own brand packages
            'brands packages index', 'brands packages create', 'brands packages edit',
            'brands packages delete', 'brands packages show',

            // Vendor: own brand portfolios
            'brands portfolios index', 'brands portfolios create', 'brands portfolios edit',
            'brands portfolios delete', 'brands portfolios show',

            // Admin: vendor applications
            'vendor applications index', 'vendor applications show',
            'vendor applications approve', 'vendor applications reject',

            // Admin: service categories
            'service categories index', 'service categories create',
            'service categories edit', 'service categories delete',

            // Vendor: testimonials moderation
            'testimonials index', 'testimonials moderate',

            // User (customer): testimonials
            'testimonials create',

            // User: favorites
            'favorites index', 'favorites create', 'favorites delete',

            // User: event plans
            'event plans index', 'event plans create', 'event plans edit', 'event plans delete',

            // User: send inquiry; Vendor: manage own inquiries
            'inquiries create',
            'inquiries index', 'inquiries show', 'inquiries update',

            // Vendor: availability
            'availability manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
