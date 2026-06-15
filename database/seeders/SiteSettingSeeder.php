<?php

namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // group, key, type, label, value, sort
            ['about',   'about.headline',     'text',     'Judul Tentang Kami',     'Menghubungkan Anda dengan EO & WO Terbaik', 1],
            ['about',   'about.subheadline',  'text',     'Subjudul',               'Eventura memudahkan Anda menemukan, membandingkan, dan menghubungi vendor acara tepercaya.', 2],
            ['about',   'about.body',         'textarea', 'Cerita / Deskripsi',     'Eventura lahir dari satu keyakinan: merencanakan acara seharusnya menyenangkan, bukan membingungkan. Kami menyatukan vendor Event Organizer dan Wedding Organizer dalam satu tempat agar Anda bisa membandingkan paket, melihat portofolio, dan menyusun rencana dengan percaya diri.', 3],
            ['about',   'about.mission',      'textarea', 'Misi Kami',              'Memberdayakan pasangan dan penyelenggara acara dengan informasi yang jujur dan transparan, serta membantu vendor lokal berkembang.', 4],
            ['about',   'about.image',        'image',    'Gambar Utama',           '', 5],

            ['contact', 'contact.address',    'textarea', 'Alamat',                 'Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan 12190', 1],
            ['contact', 'contact.email',      'email',    'Email',                  'halo@eventura.id', 2],
            ['contact', 'contact.phone',      'text',     'Telepon',                '(021) 5000-1234', 3],
            ['contact', 'contact.whatsapp',   'text',     'WhatsApp',               '081200001234', 4],
            ['contact', 'contact.instagram',  'url',      'Instagram',              'https://instagram.com/eventura.id', 5],
            ['contact', 'contact.maps_embed', 'textarea', 'Embed Peta (URL/iframe)','', 6],
        ];

        foreach ($settings as [$group, $key, $type, $label, $value, $sort]) {
            SiteSettings::firstOrCreate(
                ['key' => $key],
                ['group' => $group, 'type' => $type, 'label' => $label, 'value' => $value, 'sort' => $sort]
            );
        }
    }
}
