<?php

namespace App\Models;

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
        'description',
        'address',
        'whatsapp_number',
        'instagram',
        'website',
        'is_active',
        'featured_count',
    ];

    protected function casts(): array
    {
        return [
            'category' => 'array',
            'is_active' => 'boolean',
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
}
