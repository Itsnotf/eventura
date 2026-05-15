<?php

namespace App\Http\Controllers;

use App\Models\BrandAnalytic;
use App\Models\Brands;
use Illuminate\Http\JsonResponse;

class BrandAnalyticsController extends Controller
{
    public function trackWhatsapp(string $slug): JsonResponse
    {
        $brand = Brands::where('slug', $slug)->where('is_active', true)->first();

        if ($brand) {
            BrandAnalytic::record($brand->id, BrandAnalytic::WHATSAPP_CLICK);
        }

        return response()->json(['ok' => true]);
    }
}
