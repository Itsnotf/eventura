<?php

namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // About group
            ['key' => 'about_title',       'group' => 'about',   'type' => 'text',     'label' => 'Judul Halaman Tentang Kami',  'sort' => 1,  'value' => 'Tentang Palembang Event Center'],
            ['key' => 'about_tagline',     'group' => 'about',   'type' => 'text',     'label' => 'Tagline',                     'sort' => 2,  'value' => 'Platform terpercaya untuk menemukan EO & WO profesional di Palembang dan sekitarnya'],
            ['key' => 'about_description', 'group' => 'about',   'type' => 'textarea', 'label' => 'Deskripsi',                   'sort' => 3,  'value' => "Palembang Event Center adalah marketplace yang menghubungkan calon klien dengan Event Organizer (EO) dan Wedding Organizer (WO) profesional di Palembang dan sekitarnya.\n\nKami hadir untuk memudahkan proses pencarian, perbandingan, dan komunikasi antara klien dengan vendor terpercaya yang telah terverifikasi.\n\nDengan Palembang Event Center, mewujudkan acara impian Anda menjadi lebih mudah, cepat, dan terpercaya."],
            ['key' => 'about_vision',      'group' => 'about',   'type' => 'textarea', 'label' => 'Visi',                        'sort' => 4,  'value' => 'Menjadi platform marketplace EO & WO terdepan di Palembang yang menghubungkan vendor profesional dengan klien di Sumatera Selatan.'],
            ['key' => 'about_mission',     'group' => 'about',   'type' => 'textarea', 'label' => 'Misi',                        'sort' => 5,  'value' => "- Menyediakan platform yang mudah digunakan untuk menemukan dan membandingkan vendor EO & WO.\n- Menjamin kualitas vendor melalui proses verifikasi yang ketat.\n- Membangun ekosistem industri event yang transparan dan terpercaya.\n- Membantu vendor lokal berkembang dan menjangkau lebih banyak klien."],
            ['key' => 'about_image',       'group' => 'about',   'type' => 'image',    'label' => 'Gambar Utama (opsional)',      'sort' => 6,  'value' => ''],

            // Contact group
            ['key' => 'contact_title',     'group' => 'contact', 'type' => 'text',     'label' => 'Judul Halaman Kontak',        'sort' => 1,  'value' => 'Hubungi Kami'],
            ['key' => 'contact_intro',     'group' => 'contact', 'type' => 'textarea', 'label' => 'Paragraf Pembuka',            'sort' => 2,  'value' => 'Ada pertanyaan, masukan, atau ingin berkolaborasi? Kami senang mendengar dari Anda. Silakan hubungi kami melalui informasi di bawah ini.'],
            ['key' => 'contact_email',     'group' => 'contact', 'type' => 'email',    'label' => 'Email',                       'sort' => 3,  'value' => 'hello@eventura.id'],
            ['key' => 'contact_phone',     'group' => 'contact', 'type' => 'text',     'label' => 'Nomor Telepon / WhatsApp',    'sort' => 4,  'value' => '+62 812-0000-0000'],
            ['key' => 'contact_address',   'group' => 'contact', 'type' => 'textarea', 'label' => 'Alamat',                      'sort' => 5,  'value' => 'Palembang, Sumatera Selatan, Indonesia'],
            ['key' => 'contact_hours',     'group' => 'contact', 'type' => 'text',     'label' => 'Jam Operasional',             'sort' => 6,  'value' => 'Senin – Jumat, 09.00 – 17.00 WIB'],
            ['key' => 'contact_instagram', 'group' => 'contact', 'type' => 'url',      'label' => 'Instagram',                   'sort' => 7,  'value' => 'https://instagram.com/eventura.id'],
            ['key' => 'contact_maps',      'group' => 'contact', 'type' => 'textarea', 'label' => 'Google Maps (URL Embed)',      'sort' => 8,  'value' => ''],
        ];

        foreach ($settings as $setting) {
            SiteSettings::firstOrCreate(
                ['key' => $setting['key']],
                $setting,
            );
        }
    }
}
