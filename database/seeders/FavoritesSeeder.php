<?php

namespace Database\Seeders;

use App\Models\Brands;
use App\Models\Favorites;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoritesSeeder extends Seeder
{
    public function run(): void
    {
        $u = fn (string $email) => User::where('email', $email)->value('id');
        $b = fn (string $slug)  => Brands::where('slug', $slug)->value('id');

        $pairs = [
            ['aulia@example.com', 'dinar-wedding-organizer'],
            ['aulia@example.com', 'mj-storia'],
            ['aulia@example.com', 'benang-merah'],
            ['bagas@example.com', 'needs-wedding-organizer'],
            ['bagas@example.com', 'mars-production'],
            ['citra@example.com', 'lumina-wedding-organizer'],
            ['citra@example.com', 'endless-production'],
        ];

        foreach ($pairs as [$email, $slug]) {
            $userId  = $u($email);
            $brandId = $b($slug);
            if (!$userId || !$brandId) continue;

            Favorites::firstOrCreate(['user_id' => $userId, 'brand_id' => $brandId]);
        }
    }
}
