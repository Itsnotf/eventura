<?php

namespace App\Http\Controllers;

use App\Models\BrandPackages;
use App\Models\EventPlanItems;
use App\Models\EventPlans;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventPlansController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('permission:event plans index', only: ['index']),
            new Middleware('permission:event plans create', only: ['store', 'addItem', 'removeItem']),
            new Middleware('permission:event plans delete', only: ['destroy']),
        ];
    }

    public function index()
    {
        $plans = EventPlans::with(['items.serviceCategory', 'items.brand'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('event-plans/index', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:100'],
            'event_date' => ['nullable', 'date'],
            'event_type' => ['nullable', 'string', 'max:50'],
            'notes'      => ['nullable', 'string', 'max:1000'],
        ]);

        $plan = EventPlans::create([
            ...$data,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('event-plans.show', $plan->id)
            ->with('success', 'Rencana acara berhasil dibuat.');
    }

    public function show(string $id)
    {
        $plan = EventPlans::with(['items' => fn($q) => $q->with(['brand', 'package', 'serviceCategory'])])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        $totalBudget = $plan->items->sum('price_snapshot');

        return Inertia::render('event-plans/show', [
            'plan'        => $plan,
            'totalBudget' => $totalBudget,
            'flash'       => ['success' => session('success')],
        ]);
    }

    /** Add a package to the plan (max 1 per service_category) */
    public function addItem(Request $request, string $id)
    {
        $plan = EventPlans::where('user_id', Auth::id())->findOrFail($id);

        $data = $request->validate([
            'brand_package_id' => ['required', 'integer', 'exists:brand_packages,id'],
        ]);

        $package = BrandPackages::with(['brand', 'serviceCategory'])->findOrFail($data['brand_package_id']);

        // Enforce 1 package per category per plan
        if ($package->service_category_id) {
            $exists = EventPlanItems::where('event_plan_id', $plan->id)
                ->where('service_category_id', $package->service_category_id)
                ->exists();

            if ($exists) {
                return back()->with('error', 'Kategori layanan ini sudah ada dalam rencana. Hapus paket lama terlebih dahulu.');
            }
        }

        EventPlanItems::create([
            'event_plan_id'          => $plan->id,
            'brand_id'               => $package->brand_id,
            'brand_package_id'       => $package->id,
            'service_category_id'    => $package->service_category_id,
            'price_snapshot'         => $package->price_start,
            'package_name_snapshot'  => $package->name,
            'brand_name_snapshot'    => $package->brand->name,
        ]);

        return back()->with('success', 'Paket ditambahkan ke rencana.');
    }

    /** Remove an item from the plan */
    public function removeItem(string $id, string $itemId)
    {
        $plan = EventPlans::where('user_id', Auth::id())->findOrFail($id);

        EventPlanItems::where('event_plan_id', $plan->id)
            ->where('id', $itemId)
            ->delete();

        return back()->with('success', 'Paket dihapus dari rencana.');
    }

    public function destroy(string $id)
    {
        EventPlans::where('user_id', Auth::id())->findOrFail($id)->delete();

        return redirect()->route('event-plans.index')->with('success', 'Rencana acara dihapus.');
    }
}
