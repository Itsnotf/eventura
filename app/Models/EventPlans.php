<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPlans extends Model
{
    protected $table = 'event_plans';

    protected $fillable = ['user_id', 'name', 'event_date', 'event_type', 'notes'];

    protected function casts(): array
    {
        return ['event_date' => 'date'];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(EventPlanItems::class, 'event_plan_id');
    }
}
