<?php

namespace App\Http\Controllers;

use App\Models\BrandAnalytic;
use App\Models\BrandPackages;
use App\Models\BrandPortfolios;
use App\Models\Brands;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = User::with('brand')->find(Auth::id());

        if ($currentUser->hasRole('admin')) {
            $thirtyDaysAgo = now()->subDays(30);

            $topBrands = BrandAnalytic::where('type', BrandAnalytic::PROFILE_VIEW)
                ->where('created_at', '>=', $thirtyDaysAgo)
                ->select('brand_id', DB::raw('count(*) as views'))
                ->groupBy('brand_id')
                ->orderByDesc('views')
                ->limit(5)
                ->get()
                ->map(fn($row) => [
                    'brand' => Brands::find($row->brand_id)?->only(['id', 'name', 'slug']),
                    'views' => $row->views,
                ]);

            return Inertia::render('dashboard', [
                'isAdmin' => true,
                'stats' => [
                    'totalBrands'      => Brands::count(),
                    'totalUsers'       => User::count(),
                    'totalPackages'    => BrandPackages::count(),
                    'totalPortfolios'  => BrandPortfolios::count(),
                    'totalViews'       => BrandAnalytic::where('type', BrandAnalytic::PROFILE_VIEW)->where('created_at', '>=', $thirtyDaysAgo)->count(),
                    'totalWaClicks'    => BrandAnalytic::where('type', BrandAnalytic::WHATSAPP_CLICK)->where('created_at', '>=', $thirtyDaysAgo)->count(),
                ],
                'recentBrands' => Brands::with('user')->latest()->take(5)->get(),
                'recentUsers'  => User::with('roles')->latest()->take(5)->get(),
                'topBrands'    => $topBrands,
            ]);
        }

        $brand = $currentUser->brand;

        if (!$brand) {
            return Inertia::render('dashboard', [
                'isAdmin' => false,
                'brand'   => null,
                'stats'   => null,
            ]);
        }

        $thirtyDaysAgo = now()->subDays(30);
        $brandId       = $brand->id;

        $topPortfolioViews = BrandAnalytic::where('brand_id', $brandId)
            ->where('type', BrandAnalytic::PORTFOLIO_VIEW)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select('subject_id', DB::raw('count(*) as views'))
            ->groupBy('subject_id')
            ->orderByDesc('views')
            ->limit(5)
            ->get();

        $topPortfolios = BrandPortfolios::whereIn('id', $topPortfolioViews->pluck('subject_id'))
            ->get()
            ->map(fn($p) => array_merge(
                $p->only(['id', 'title', 'event_type', 'event_date']),
                ['views' => $topPortfolioViews->firstWhere('subject_id', $p->id)?->views ?? 0]
            ))
            ->sortByDesc('views')
            ->values();

        $dailyViews = BrandAnalytic::where('brand_id', $brandId)
            ->where('type', BrandAnalytic::PROFILE_VIEW)
            ->where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('views', 'date');

        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'brand'   => $brand,
            'stats'   => [
                'totalPackages'    => BrandPackages::where('brand_id', $brandId)->count(),
                'totalPortfolios'  => BrandPortfolios::where('brand_id', $brandId)->count(),
                'featuredPackages' => BrandPackages::where('brand_id', $brandId)->where('is_featured', true)->count(),
            ],
            'analytics' => [
                'profileViews'    => BrandAnalytic::where('brand_id', $brandId)->where('type', BrandAnalytic::PROFILE_VIEW)->where('created_at', '>=', $thirtyDaysAgo)->count(),
                'whatsappClicks'  => BrandAnalytic::where('brand_id', $brandId)->where('type', BrandAnalytic::WHATSAPP_CLICK)->where('created_at', '>=', $thirtyDaysAgo)->count(),
                'portfolioViews'  => BrandAnalytic::where('brand_id', $brandId)->where('type', BrandAnalytic::PORTFOLIO_VIEW)->where('created_at', '>=', $thirtyDaysAgo)->count(),
                'topPortfolios'   => $topPortfolios,
                'dailyViews'      => $dailyViews,
            ],
            'recentPackages'   => BrandPackages::where('brand_id', $brandId)->latest()->take(5)->get(),
            'recentPortfolios' => BrandPortfolios::where('brand_id', $brandId)->latest()->take(5)->get(),
        ]);
    }
}
