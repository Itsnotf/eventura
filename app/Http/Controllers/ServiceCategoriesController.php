<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceCategoryRequest\StoreServiceCategoryRequest;
use App\Http\Requests\ServiceCategoryRequest\UpdateServiceCategoryRequest;
use App\Models\ServiceCategories;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceCategoriesController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:service categories index', only: ['index']),
            new Middleware('permission:service categories create', only: ['create', 'store']),
            new Middleware('permission:service categories edit', only: ['edit', 'update']),
            new Middleware('permission:service categories delete', only: ['destroy']),
        ];
    }

    public function index()
    {
        return Inertia::render('service-categories/index', [
            'categories' => ServiceCategories::withCount('packages')->orderBy('name')->get(),
            'flash'      => ['success' => session('success')],
        ]);
    }

    public function create()
    {
        return Inertia::render('service-categories/create');
    }

    public function store(StoreServiceCategoryRequest $request)
    {
        ServiceCategories::create([
            'name' => $request->name,
            'slug' => $request->slug ?: Str::slug($request->name),
            'icon' => $request->icon,
        ]);

        return redirect()->route('service-categories.index')->with('success', 'Kategori berhasil dibuat.');
    }

    public function edit(string $id)
    {
        return Inertia::render('service-categories/edit', [
            'category' => ServiceCategories::findOrFail($id),
        ]);
    }

    public function update(UpdateServiceCategoryRequest $request, string $id)
    {
        $category = ServiceCategories::findOrFail($id);
        $category->update([
            'name' => $request->name,
            'slug' => $request->slug ?: Str::slug($request->name),
            'icon' => $request->icon,
        ]);

        return redirect()->route('service-categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $category = ServiceCategories::findOrFail($id);

        if ($category->packages()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih dipakai oleh paket.');
        }

        $category->delete();
        return redirect()->route('service-categories.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
