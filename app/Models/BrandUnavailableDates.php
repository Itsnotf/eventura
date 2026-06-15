<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandUnavailableDates extends Model
{
    protected $table = 'brand_unavailable_dates';

    protected $fillable = ['brand_id', 'date', 'reason'];

    protected function casts(): array
    {
        return ['date' => 'date'];
    }

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id');
    }
}
