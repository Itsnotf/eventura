<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategories extends Model
{
    protected $table = 'service_categories';

    protected $fillable = ['name', 'slug', 'icon'];

    public function packages()
    {
        return $this->hasMany(BrandPackages::class, 'service_category_id', 'id');
    }
}
