<?php

namespace App\Http\Controllers;

use App\Models\BrandAnalytic;
use App\Models\BrandPortfolios;
use App\Models\BrandUnavailableDates;
use App\Models\Brands;
use App\Models\EventPlans;
use App\Models\Testimonials;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->withMin('packages', 'price_start')
            ->withAvg('testimonials', 'rating');

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

        if ($request->filled('city')) {
            $query->where('address', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('verified') && $request->verified === '1') {
            $query->where('is_verified', true);
        }

        if ($request->filled('min_price')) {
            $query->whereHas('packages', fn($q) => $q->where('price_start', '>=', (int) $request->min_price));
        }

        if ($request->filled('max_price')) {
            $query->whereHas('packages', fn($q) => $q->where('price_start', '<=', (int) $request->max_price));
        }

        if ($request->filled('min_rating')) {
            $query->withAvg('testimonials', 'rating')
                ->having('testimonials_avg_rating', '>=', (float) $request->min_rating);
        }

        $sort = $request->get('sort', 'latest');

        if ($sort === 'price_asc') {
            $query->orderBy('packages_min_price_start');
        } elseif ($sort === 'name') {
            $query->orderBy('name');
        } elseif ($sort === 'rating') {
            $query->orderByDesc('testimonials_avg_rating');
        } else {
            $query->latest();
        }

        $brands = $query->paginate(12)->withQueryString();

        return Inertia::render('landing/explore', [
            'brands'  => $brands,
            // Cast to object so empty result serializes as {} not [] in JSON.
            // [] (PHP empty array) → "[]" (JSON array) → filters.sort resolves to Array.prototype.sort → useState crash.
            'filters' => (object) $request->only(['search', 'category', 'city', 'verified', 'min_price', 'max_price', 'min_rating', 'sort']),
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

        $testimonials = Testimonials::with('user:id,name')
            ->where('brand_id', $brand->id)
            ->where('is_published', true)
            ->latest('published_at')
            ->get(['id', 'brand_id', 'user_id', 'rating', 'body', 'published_at']);

        $avgRating = $testimonials->isNotEmpty()
            ? round($testimonials->avg('rating'), 1)
            : null;

        $userId = Auth::id();

        $userHasTestimonial = $userId
            ? Testimonials::where('brand_id', $brand->id)->where('user_id', $userId)->exists()
            : false;

        $userEventPlans = $userId
            ? EventPlans::where('user_id', $userId)->select('id', 'name')->orderBy('name')->get()
            : collect();

        $unavailableDates = BrandUnavailableDates::where('brand_id', $brand->id)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->pluck('date')
            ->map(fn($d) => $d->toDateString());

        return Inertia::render('landing/brand-detail', [
            'brand'              => $brand,
            'testimonials'       => $testimonials,
            'avgRating'          => $avgRating,
            'userHasTestimonial' => $userHasTestimonial,
            'userEventPlans'     => $userEventPlans,
            'unavailableDates'   => $unavailableDates,
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

    public function compare(Request $request)
    {
        $ids = collect(explode(',', $request->get('ids', '')))
            ->map(fn($id) => (int) trim($id))
            ->filter()
            ->unique()
            ->take(3);

        $brands = Brands::whereIn('id', $ids)
            ->where('is_active', true)
            ->with([
                'packages' => fn($q) => $q->orderByDesc('is_featured')->orderBy('price_start'),
            ])
            ->withMin('packages', 'price_start')
            ->withAvg('testimonials', 'rating')
            ->withCount('testimonials')
            ->get();

        return Inertia::render('landing/compare', [
            'brands' => $brands,
        ]);
    }

    public function join()
    {
        return Inertia::render('landing/join', [
            'flash' => ['success' => session('success')],
        ]);
    }
}
