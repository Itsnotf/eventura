<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandPackagesRequest\CreateBrandPackagesRequest;
use App\Http\Requests\BrandPackagesRequest\UpdateBrandPackagesRequest;
use App\Models\BrandPackages;
use App\Models\Brands;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandPackagesController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:brands packages index', only: ['index']),
            new Middleware('permission:brands packages create', only: ['create', 'store']),
            new Middleware('permission:brands packages edit', only: ['edit', 'update']),
            new Middleware('permission:brands packages delete', only: ['destroy']),
            new Middleware('permission:brands packages show', only: ['show']),
        ];
    }

    private function getCurrentUser()
    {
        return User::with('brand')->find(Auth::id());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $this->getCurrentUser();

        $query = BrandPackages::with('brand')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });

        if (!$currentUser->hasRole('admin')) {
            if ($currentUser->brand) {
                $query->where('brand_id', $currentUser->brand->id);
            } else {
                $query->whereRaw('0 = 1');
            }
        }

        $brandsPackages = $query->paginate(8)->withQueryString();

        return inertia('brands-packages/index', [
            'brandsPackages' => $brandsPackages,
            'filters' => $request->only('search'),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $currentUser = $this->getCurrentUser();

        $brands = $currentUser->hasRole('admin')
            ? Brands::all()
            : Brands::where('user_id', $currentUser->id)->get();

        return Inertia::render("brands-packages/create", [
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBrandPackagesRequest $request)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $request->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brandPackage = BrandPackages::create([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'price_start' => $request->price_start,
            'price_end' => $request->price_end,
            'description' => $request->description,
            'cover_image' => $request->cover_image ? $request->file('cover_image')->store('brand_packages', 'public') : null,
            'is_featured' => $request->is_featured ?? false,
        ]);

        return redirect()->route('brand-packages.index')->with('success', 'Brand package created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brandPackage = BrandPackages::with('brand')->findOrFail($id);
        return Inertia::render('brands-packages/show', [
            'brandPackage' => $brandPackage,
            'coverImageUrl' => $brandPackage->cover_image ? asset('storage/' . $brandPackage->cover_image) : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPackage = BrandPackages::with('brand')->findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $brandPackage->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brands = $currentUser->hasRole('admin')
            ? Brands::all()
            : Brands::where('user_id', $currentUser->id)->get();

        return Inertia::render('brands-packages/edit', [
            'brandPackage' => $brandPackage,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandPackagesRequest $request, string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPackage = BrandPackages::findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $brandPackage->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brandPackage->update([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'price_start' => $request->price_start,
            'price_end' => $request->price_end,
            'description' => $request->description,
            'cover_image' => $request->cover_image ? $request->file('cover_image')->store('brand_packages', 'public') : $brandPackage->cover_image,
            'is_featured' => $request->is_featured ?? false,
        ]);

        return redirect()->route('brand-packages.index')->with('success', 'Brand package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPackage = BrandPackages::findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $brandPackage->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brandPackage->delete();
        return redirect()->route('brand-packages.index')->with('success', 'Brand package deleted successfully.');
    }
}
