<?php

namespace App\Http\Controllers;

use App\Models\BrandUnavailableDates;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AvailabilityController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('permission:availability manage'),
        ];
    }

    public function index()
    {
        $brand = User::with('brand')->find(Auth::id())?->brand;

        if (!$brand) {
            abort(403);
        }

        $unavailable = BrandUnavailableDates::where('brand_id', $brand->id)
            ->orderBy('date')
            ->get(['id', 'date', 'reason']);

        return Inertia::render('availability/index', [
            'unavailableDates' => $unavailable,
            'flash'            => ['success' => session('success')],
        ]);
    }

    public function store(Request $request)
    {
        $brand = User::with('brand')->find(Auth::id())?->brand;

        if (!$brand) {
            abort(403);
        }

        $data = $request->validate([
            'date'   => ['required', 'date', 'after_or_equal:today'],
            'reason' => ['nullable', 'string', 'max:200'],
        ]);

        BrandUnavailableDates::firstOrCreate(
            ['brand_id' => $brand->id, 'date' => $data['date']],
            ['reason'   => $data['reason'] ?? null]
        );

        return back()->with('success', 'Tanggal tidak tersedia ditambahkan.');
    }

    public function destroy(string $id)
    {
        $brand = User::with('brand')->find(Auth::id())?->brand;

        if (!$brand) {
            abort(403);
        }

        BrandUnavailableDates::where('brand_id', $brand->id)->where('id', $id)->delete();

        return back()->with('success', 'Tanggal dihapus.');
    }
}
