<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandPackages extends Model
{
    use HasFactory;
    protected $fillable = [
        'brand_id',
        'service_category_id',
        'name',
        'price_start',
        'price_end',
        'description',
        'cover_image',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id', 'id');
    }

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategories::class, 'service_category_id', 'id');
    }
}
