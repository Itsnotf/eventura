<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use App\Models\Favorites;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoritesController extends Controller
{
    /** Toggle favorite: add if not exists, remove if exists */
    public function toggle(Request $request)
    {
        $request->validate(['brand_id' => ['required', 'integer', 'exists:brands,id']]);

        $userId  = Auth::id();
        $brandId = $request->brand_id;

        $existing = Favorites::where('user_id', $userId)->where('brand_id', $brandId)->first();

        if ($existing) {
            $existing->delete();
            $isFavorited = false;
        } else {
            Favorites::create(['user_id' => $userId, 'brand_id' => $brandId]);
            $isFavorited = true;
        }

        return back()->with([
            'favorited' => $isFavorited,
        ]);
    }

    /** Customer: list all favorited brands */
    public function index()
    {
        $brands = Brands::whereHas('favoritedByUsers', fn($q) => $q->where('user_id', Auth::id()))
            ->withMin('packages', 'price_start')
            ->latest()
            ->get();

        return Inertia::render('favorites/index', [
            'brands' => $brands,
        ]);
    }
}
