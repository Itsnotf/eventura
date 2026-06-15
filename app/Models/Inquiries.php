<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiries extends Model
{
    protected $table = 'inquiries';

    protected $fillable = [
        'user_id',
        'brand_id',
        'event_plan_id',
        'event_type',
        'event_date',
        'message',
        'status',
        'vendor_note',
    ];

    protected function casts(): array
    {
        return ['event_date' => 'date'];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id');
    }

    public function eventPlan()
    {
        return $this->belongsTo(EventPlans::class, 'event_plan_id');
    }
}
