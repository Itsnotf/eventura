<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandPortfoliosRequest\CreatePortfoliosRequest;
use App\Http\Requests\BrandPortfoliosRequest\UpdatePortfoliosRequest;
use App\Models\BrandPortfolios;
use App\Models\Brands;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandPortfoliosController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('permission:brands portfolios index', only: ['index']),
            new Middleware('permission:brands portfolios create', only: ['create', 'store']),
            new Middleware('permission:brands portfolios edit', only: ['edit', 'update']),
            new Middleware('permission:brands portfolios delete', only: ['destroy']),
            new Middleware('permission:brands portfolios show', only: ['show']),
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

        $query = BrandPortfolios::with('brand')
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
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

        $brandPortfolios = $query->paginate(8)->withQueryString();

        return inertia('brands-portfolios/index', [
            'brandPortfolios' => $brandPortfolios,
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

        return inertia('brands-portfolios/create', [
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePortfoliosRequest $request)
    {
        $currentUser = $this->getCurrentUser();

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $request->brand_id != $currentUser->brand->id) {
            return redirect()->route('brand-portfolios.index')->with('success', 'gak boleh nakal yah.');
        }

        $validated = $request->validated();
        $validated['video'] = $request->hasFile('video')
            ? $request->file('video')->store('brand-portfolios/videos', 'public')
            : null;

        BrandPortfolios::create($validated);

        return redirect()->route('brand-portfolios.index')->with('success', 'Brand Portfolio created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brandPortfolio = BrandPortfolios::with('brand', 'images')->findOrFail($id);
        return inertia('brands-portfolios/show', [
            'brandPortfolio' => $brandPortfolio,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPortfolio = BrandPortfolios::with('brand')->findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $brandPortfolio->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brands = $currentUser->hasRole('admin')
            ? Brands::all()
            : Brands::where('user_id', $currentUser->id)->get();

        return inertia('brands-portfolios/edit', [
            'brandPortfolio' => $brandPortfolio,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePortfoliosRequest $request, string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPortfolio = BrandPortfolios::findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $request->brand_id != $currentUser->brand->id) {
            return redirect()->route('brand-portfolios.show', $id)->with('success', 'gak boleh nakal yah.');
        }

        $validated = $request->validated();
        $validated['video'] = $request->hasFile('video')
            ? $request->file('video')->store('brand-portfolios/videos', 'public')
            : $brandPortfolio->video;

        $brandPortfolio->update($validated);

        return redirect()->route('brand-portfolios.index')->with('success', 'Brand Portfolio updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $currentUser = $this->getCurrentUser();
        $brandPortfolio = BrandPortfolios::findOrFail($id);

        if (!$currentUser->hasRole('admin') && $currentUser->brand && $brandPortfolio->brand_id != $currentUser->brand->id) {
            abort(403);
        }

        $brandPortfolio->delete();

        return redirect()->route('brand-portfolios.index')->with('success', 'Brand Portfolio deleted successfully.');
    }
}
