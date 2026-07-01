<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'category',
        'logo',
        'cover_image',
        'company_profile_video',
        'description',
        'address',
        'whatsapp_number',
        'instagram',
        'website',
        'is_active',
        'featured_count',
        'is_verified',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'category'    => 'array',
            'is_active'   => 'boolean',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function packages()
    {
        return $this->hasMany(BrandPackages::class, 'brand_id', 'id');
    }

    public function portfolios()
    {
        return $this->hasMany(BrandPortfolios::class, 'brand_id', 'id');
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonials::class, 'brand_id', 'id');
    }

    public function favoritedByUsers()
    {
        return $this->hasMany(Favorites::class, 'brand_id');
    }

    // Rata-rata dari SEMUA testimoni (published maupun tidak) — A2
    public function averageRating(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->testimonials->isNotEmpty()
                ? round($this->testimonials->avg('rating'), 1)
                : null
        );
    }

    // Jumlah SEMUA testimoni — A2
    public function reviewsCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->testimonials->count()
        );
    }
}
