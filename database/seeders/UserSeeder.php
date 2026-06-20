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
            ['name' => 'Admin Palembang Event Center', 'password' => 'password', 'email_verified_at' => now()]
        );
        $admin->syncRoles(['admin']);

        // ── Vendor (pemilik 8 brand) ────────────────────────────
        $vendors = [
            ['name' => 'Dinar Maheswari', 'email' => 'dinar@dinarwo.id'],          // Dinar Wedding Organizer
            ['name' => 'Nisa Rahmadani',  'email' => 'needs@needswo.id'],          // Needs Wedding Organizer
            ['name' => 'Lumina Sari',     'email' => 'lumina@luminawo.id'],        // Lumina Wedding Organizer
            ['name' => 'Galih Pratama',   'email' => 'endless@endlesscreative.id'],// Endless Creative Production
            ['name' => 'Reza Mahendra',   'email' => 'reza@marsproduction.id'],    // Mars Production
            ['name' => 'Rara Anjani',     'email' => 'hello@benangmerah.id'],      // Benang Merah
            ['name' => 'Mikael Joshua',   'email' => 'mj@mjstoria.id'],            // MJ Storia
            ['name' => 'Wahyu Kuswara',   'email' => 'kuliner@wongkito.id'],       // Kuliner Wong Kito
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
