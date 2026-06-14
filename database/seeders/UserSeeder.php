<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'              => 'Admin',
                'password'          => 'password',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        // Brand owners are vendors
        $brandOwners = [
            ['name' => 'Rina Wijayanti',   'email' => 'rina@mahkotabridal.id'],
            ['name' => 'Budi Santoso',      'email' => 'budi@nuansaeventpro.id'],
            ['name' => 'Sari Permatasari',  'email' => 'sari@permatawedding.id'],
            ['name' => 'Dian Kusuma',       'email' => 'dian@galaevent.id'],
            ['name' => 'Agus Setiawan',     'email' => 'agus@eleganbali.id'],
            ['name' => 'Maya Putri',        'email' => 'maya@proeventindonesia.id'],
            ['name' => 'Hendra Prasetya',   'email' => 'hendra@bungarayawedding.id'],
            ['name' => 'Dewi Anggraini',    'email' => 'dewi@spektraevents.id'],
            ['name' => 'Rudi Hartono',      'email' => 'rudi@harmoniwedding.id'],
            ['name' => 'Lia Novitasari',    'email' => 'lia@summitevent.id'],
        ];

        foreach ($brandOwners as $owner) {
            $user = User::firstOrCreate(
                ['email' => $owner['email']],
                [
                    'name'              => $owner['name'],
                    'password'          => 'password',
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles(['vendor']);
        }

        // Demo customer account
        $customer = User::firstOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name'              => 'Demo Customer',
                'password'          => 'password',
                'email_verified_at' => now(),
            ]
        );
        $customer->syncRoles(['user']);
    }
}
