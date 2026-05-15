<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandAnalytic extends Model
{
    const PROFILE_VIEW   = 'profile_view';
    const PORTFOLIO_VIEW = 'portfolio_view';
    const WHATSAPP_CLICK = 'whatsapp_click';

    protected $fillable = ['brand_id', 'type', 'subject_id', 'ip_address'];

    public function brand()
    {
        return $this->belongsTo(Brands::class, 'brand_id');
    }

    public function portfolio()
    {
        return $this->belongsTo(BrandPortfolios::class, 'subject_id');
    }

    /**
     * Record an event, deduplicating profile/portfolio views by IP within 30 minutes.
     */
    public static function record(int $brandId, string $type, ?int $subjectId = null): void
    {
        $ip = request()->ip();

        if ($type !== self::WHATSAPP_CLICK) {
            $exists = self::where('brand_id', $brandId)
                ->where('type', $type)
                ->where('subject_id', $subjectId)
                ->where('ip_address', $ip)
                ->where('created_at', '>=', now()->subMinutes(30))
                ->exists();

            if ($exists) {
                return;
            }
        }

        self::create([
            'brand_id'   => $brandId,
            'type'       => $type,
            'subject_id' => $subjectId,
            'ip_address' => $ip,
        ]);
    }
}
