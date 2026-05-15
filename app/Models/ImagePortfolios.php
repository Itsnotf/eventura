<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagePortfolios extends Model
{
    use HasFactory;
    protected $fillable = [
        'brand_portfolio_id',
        'image',
    ];

    public function brandPortfolio()
    {
        return $this->belongsTo(BrandPortfolios::class, 'brand_portfolio_id', 'id');
    }
}
