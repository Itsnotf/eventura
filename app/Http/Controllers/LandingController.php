<?php

namespace App\Http\Controllers;

use App\Models\BrandAnalytic;
use App\Models\BrandPortfolios;
use App\Models\Brands;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function home()
    {
        $featured = Cache::remember('featured_brands', 600, function () {
            $minCount = Brands::where('is_active', true)->min('featured_count') ?? 0;

            $featured = Brands::where('is_active', true)
                ->where('featured_count', $minCount)
                ->withMin('packages', 'price_start')
                ->inRandomOrder()
                ->take(6)
                ->get();

            if ($featured->count() < 6) {
                $needed   = 6 - $featured->count();
                $existing = $featured->pluck('id');

                $more = Brands::where('is_active', true)
                    ->where('featured_count', '>', $minCount)
                    ->whereNotIn('id', $existing)
                    ->withMin('packages', 'price_start')
                    ->inRandomOrder()
                    ->take($needed)
                    ->get();

                $featured = $featured->merge($more);
            }

            if ($featured->isNotEmpty()) {
                Brands::whereIn('id', $featured->pluck('id'))->increment('featured_count');
            }

            return $featured;
        });

        return Inertia::render('welcome', [
            'featuredBrands' => $featured,
        ]);
    }

    public function explore(Request $request)
    {
        $query = Brands::where('is_active', true)
            ->withMin('packages', 'price_start');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && in_array($request->category, ['EO', 'WO'])) {
            $query->whereJsonContains('category', $request->category);
        }

        $brands = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('landing/explore', [
            'brands'  => $brands,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function brandDetail(string $slug)
    {
        $brand = Brands::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'packages'   => fn($q) => $q->orderByDesc('is_featured')->orderBy('price_start'),
                'portfolios' => fn($q) => $q->with(['images' => fn($q) => $q->limit(1)])->latest()->limit(6),
            ])
            ->firstOrFail();

        BrandAnalytic::record($brand->id, BrandAnalytic::PROFILE_VIEW);

        return Inertia::render('landing/brand-detail', [
            'brand' => $brand,
        ]);
    }

    public function portfolioDetail(string $slug, int $portfolioId)
    {
        $brand = Brands::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $portfolio = BrandPortfolios::where('id', $portfolioId)
            ->where('brand_id', $brand->id)
            ->with('images')
            ->firstOrFail();

        BrandAnalytic::record($brand->id, BrandAnalytic::PORTFOLIO_VIEW, $portfolio->id);

        return Inertia::render('landing/portfolio-detail', [
            'brand'     => $brand,
            'portfolio' => $portfolio,
        ]);
    }

    public function portfolios(Request $request)
    {
        $query = BrandPortfolios::with([
            'brand',
            'images' => fn($q) => $q->limit(1),
        ])->whereHas('brand', fn($q) => $q->where('is_active', true));

        if ($request->filled('event_type')) {
            $query->where('event_type', $request->event_type);
        }

        $portfolios = $query->latest()->paginate(12)->withQueryString();

        $eventTypes = BrandPortfolios::whereHas('brand', fn($q) => $q->where('is_active', true))
            ->distinct()
            ->orderBy('event_type')
            ->pluck('event_type');

        return Inertia::render('landing/portfolio', [
            'portfolios' => $portfolios,
            'eventTypes' => $eventTypes,
            'filters'    => $request->only(['event_type']),
        ]);
    }

    public function join()
    {
        return Inertia::render('landing/join', [
            'flash' => ['success' => session('success')],
        ]);
    }
}
