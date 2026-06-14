<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandsRequest\CreateBrandRequest;
use App\Http\Requests\BrandsRequest\UpdateBrandRequest;
use App\Models\Brands;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:brands index', only: ['index']),
            new Middleware('permission:brands create', only: ['create', 'store']),
            new Middleware('permission:brands edit', only: ['edit', 'update']),
            new Middleware('permission:brands delete', only: ['destroy']),
            new Middleware('permission:brands show', only: ['show']),
        ];
    }


    private function getCurrentUser()
    {
        $currentUser = Auth::user();

        $user = User::with('brand')->find($currentUser->id);
        return $user;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $currentUser = $this->getCurrentUser();


        if ($currentUser->hasRole('admin')) {
            $brands = Brands::with('user')
                ->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                })
                ->paginate(8)
                ->withQueryString();
        } else if ($currentUser->brand) {
            return $this->show($currentUser->brand->id);
        }else {
            return $this->notFound();
        }


        return inertia('brands/index', [
            'brands' => $brands,
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
         $users = null;

        $currentUser = $this->getCurrentUser();

        if (!$currentUser->hasRole('admin')) {
            $users = \App\Models\User::where('id', $currentUser->id)->get();
        } else {
            $users = \App\Models\User::all();
        }

        return Inertia::render("brands/create", [
            'users' => $users,
        ]);
    }


    public function notFound()
    {
        return Inertia::render('brands/brand-not-found');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBrandRequest $request)
    {
        $user = $this->getCurrentUser();

        if (!$user->hasRole('admin')) {
            if ($user->brand) {
                abort(403, 'Anda sudah memiliki brand.');
            }
            $userId = $user->id;
        } else {
            $userId = $request->user_id;
        }

        Brands::create([
            "user_id" => $userId,
            "name" => $request->name,
            "slug" => $request->slug,
            "category" => $request->category,
            "logo" => $request->logo ? $request->file('logo')->store('brands', 'public') : null,
            "cover_image" => $request->cover_image ? $request->file('cover_image')->store('brands', 'public') : null,
            "description" => $request->description,
            "address" => $request->address,
            "whatsapp_number" => $request->whatsapp_number,
            "instagram" => $request->instagram,
            "website" => $request->website,
            "is_active" => $request->is_active ?? true,
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $brand = Brands::with('user', 'packages')->findOrFail($id);

        return Inertia::render('brands/show', [
            'brand' => $brand,
            'logoUrl' => $brand->logo ? asset('storage/' . $brand->logo) : null,
            'coverImageUrl' => $brand->cover_image ? asset('storage/' . $brand->cover_image) : null,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $users = null;

        $currentUser = $this->getCurrentUser();

        if (!$currentUser->hasRole('admin') && $currentUser->brand->id != $id) {
            $users = \App\Models\User::where('id', $currentUser->id)->get();
        } else {
            $users = \App\Models\User::all();
        }

        $brand = Brands::with('user')->findOrFail($id);
        return Inertia::render('brands/edit', [
            'brand' => $brand,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, string $id)
    {

        $user = $this->getCurrentUser();
        $brand = Brands::findOrFail($id);

        if (!$user->hasRole('admin') && $brand->user_id != $user->id) {
            abort(403);
        }

        $brand->update([
            "user_id" => $request->user_id,
            "name" => $request->name,
            "slug" => $request->slug,
            "category" => $request->category,
            "logo" => $request->logo ? $request->file('logo')->store('brands', 'public') : $brand->logo,
            "cover_image" => $request->cover_image ? $request->file('cover_image')->store('brands', 'public') : $brand->cover_image,
            "description" => $request->description,
            "address" => $request->address,
            "whatsapp_number" => $request->whatsapp_number,
            "instagram" => $request->instagram,
            "website" => $request->website,
            "is_active" => $request->is_active ?? $brand->is_active,
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brands::findOrFail($id);
        $brand->delete();

        return redirect()->route('brands.index')->with('success', 'Brand deleted successfully.');
    }
}
