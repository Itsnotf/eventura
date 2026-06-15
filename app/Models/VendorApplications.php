<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorApplications extends Model
{
    protected $table = 'vendor_applications';

    protected $fillable = [
        'applicant_name',
        'email',
        'phone',
        'brand_name',
        'category',
        'message',
        'document',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'category'    => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'id');
    }
}
