<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestimonialRequest\StoreTestimonialRequest;
use App\Models\Testimonials;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TestimonialsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:testimonials create', only: ['store']),
            new Middleware('permission:testimonials index', only: ['index']),
            new Middleware('permission:testimonials moderate', only: ['publish', 'unpublish']),
            new Middleware('auth', only: ['store', 'index', 'publish', 'unpublish']),
        ];
    }

    /** Customer: submit testimonial for a brand */
    public function store(StoreTestimonialRequest $request)
    {
        Testimonials::create([
            'brand_id'     => $request->brand_id,
            'user_id'      => Auth::id(),
            'rating'       => $request->rating,
            'body'         => $request->body,
            'is_published' => false,
        ]);

        return back()->with('success', 'Testimoni Anda berhasil dikirim dan menunggu persetujuan vendor.');
    }

    /** Vendor: list own brand's testimonials */
    public function index()
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        if (!$brand) {
            abort(403);
        }

        $testimonials = Testimonials::with('user')
            ->where('brand_id', $brand->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
            'flash'        => ['success' => session('success')],
        ]);
    }

    /** Vendor: publish a testimonial */
    public function publish(string $id)
    {
        $testimonial = $this->resolveOwn($id);
        $testimonial->update(['is_published' => true, 'published_at' => now()]);

        return back()->with('success', 'Testimoni dipublikasikan.');
    }

    /** Vendor: unpublish a testimonial */
    public function unpublish(string $id)
    {
        $testimonial = $this->resolveOwn($id);
        $testimonial->update(['is_published' => false, 'published_at' => null]);

        return back()->with('success', 'Testimoni disembunyikan.');
    }

    private function resolveOwn(string $id): Testimonials
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $testimonial = Testimonials::findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $testimonial->brand_id !== $brand->id)) {
            abort(403);
        }

        return $testimonial;
    }
}
