<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPlanItems extends Model
{
    protected $table = 'event_plan_items';

    protected $fillable = [
        'event_plan_id',
        'brand_id',
        'brand_package_id',
        'service_category_id',
        'price_start_snapshot',
        'price_end_snapshot',
        'package_name_snapshot',
        'brand_name_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'price_start_snapshot' => 'integer',
            'price_end_snapshot'   => 'integer',
        ];
    }

    public function eventPlan()
    {
        return $this->belongsTo(EventPlans::class, 'event_plan_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id');
    }

    public function package()
    {
        return $this->belongsTo(BrandPackages::class, 'brand_package_id');
    }

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategories::class, 'service_category_id');
    }
}
