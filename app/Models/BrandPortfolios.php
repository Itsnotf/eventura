<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandPortfolios extends Model
{
    use HasFactory;
    protected $fillable = [
        'brand_id',
        'deskripsi',
        'title',
        'event_type',
        'event_date',
    ];

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(ImagePortfolios::class, 'brand_portfolio_id', 'id');
    }
}

