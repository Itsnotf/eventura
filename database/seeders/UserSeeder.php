<?php

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
