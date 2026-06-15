<?php

namespace Database\Seeders;

use App\Models\Brands;
use App\Models\EventPlans;
use App\Models\Inquiries;
use App\Models\User;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        $u = fn (string $email) => User::where('email', $email)->value('id');
        $b = fn (string $slug)  => Brands::where('slug', $slug)->value('id');

        $plan = EventPlans::where('name', 'Pernikahan Impian — 250 Tamu')->first();

        // pending — baru dikirim, belum dibuka vendor
        Inquiries::firstOrCreate(
            ['user_id' => $u('bagas@example.com'), 'brand_id' => $b('needs-wedding-organizer'), 'event_type' => 'Pernikahan'],
            [
                'event_date' => now()->addMonths(5)->toDateString(),
                'message'    => 'Halo, saya tertarik paket wedding hemat untuk 200 tamu. Boleh minta rincian harganya?',
                'status'     => 'pending',
            ]
        );

        // read — sudah dibuka vendor (read_at terisi)
        Inquiries::firstOrCreate(
            ['user_id' => $u('citra@example.com'), 'brand_id' => $b('mj-storia'), 'event_type' => 'Pernikahan'],
            [
                'event_date' => now()->addMonths(3)->toDateString(),
                'message'    => 'Apakah paket dokumentasi gold tersedia tanggal yang saya pilih?',
                'status'     => 'read',
                'read_at'    => now()->subDays(1),
            ]
        );

        // responded — vendor sudah membalas
        Inquiries::firstOrCreate(
            ['user_id' => $u('aulia@example.com'), 'brand_id' => $b('benang-merah'), 'event_type' => 'Pernikahan'],
            [
                'event_date'      => now()->addMonths(4)->toDateString(),
                'message'         => 'Minta penawaran dekorasi grand maroon untuk ballroom 300 tamu.',
                'status'          => 'responded',
                'read_at'         => now()->subDays(2),
                'vendor_response' => 'Terima kasih, Kak Aulia. Untuk ballroom 300 tamu konsep maroon, estimasi 18–28 juta. Boleh kami jadwalkan survei lokasi minggu depan?',
                'responded_at'    => now()->subDays(1),
            ]
        );

        // closed — ditutup oleh customer
        Inquiries::firstOrCreate(
            ['user_id' => $u('bagas@example.com'), 'brand_id' => $b('mars-production'), 'event_type' => 'Event Korporat'],
            [
                'event_date'      => now()->addMonths(2)->toDateString(),
                'message'         => 'Butuh sound & lighting untuk gathering kantor 300 orang.',
                'status'          => 'closed',
                'read_at'         => now()->subDays(6),
                'vendor_response' => 'Siap, kami available. Sudah kami kirim proposal ke email Bapak.',
                'responded_at'    => now()->subDays(5),
                'closed_at'       => now()->subDays(3),
            ]
        );

        // dari rencana simulasi (event_plan_id terisi)
        if ($plan) {
            Inquiries::firstOrCreate(
                ['user_id' => $u('aulia@example.com'), 'brand_id' => $b('mj-storia'), 'event_type' => 'Pernikahan'],
                [
                    'event_plan_id' => $plan->id,
                    'event_date'    => $plan->event_date,
                    'message'       => 'Halo MJ Storia, paket dokumentasi gold ini bagian dari rencana pernikahan saya. Mohon info ketersediaannya.',
                    'status'        => 'pending',
                ]
            );
        }
    }
}
