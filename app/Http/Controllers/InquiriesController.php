<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use App\Models\EventPlans;
use App\Models\Inquiries;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InquiriesController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('permission:inquiries create', only: ['store']),
            new Middleware('permission:inquiries index', only: ['index']),
            new Middleware('permission:inquiries create', only: ['myInquiries']),
            new Middleware('permission:inquiries show', only: ['show']),
            new Middleware('permission:inquiries update', only: ['updateStatus']),
        ];
    }

    /** Customer: send inquiry to a brand */
    public function store(Request $request)
    {
        $data = $request->validate([
            'brand_id'      => ['required', 'integer', 'exists:brands,id'],
            'event_type'    => ['required', 'string', 'max:100'],
            'event_date'    => ['nullable', 'date'],
            'message'       => ['required', 'string', 'min:10', 'max:2000'],
            'event_plan_id' => ['nullable', 'integer', 'exists:event_plans,id'],
        ]);

        Inquiries::create([
            ...$data,
            'user_id' => Auth::id(),
            'status'  => 'pending',
        ]);

        return back()->with('success', 'Inquiry berhasil dikirim. Vendor akan menghubungi Anda segera.');
    }

    /** Customer: list my inquiries */
    public function myInquiries()
    {
        $inquiries = Inquiries::with('brand')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

        return Inertia::render('inquiries/my-inquiries', [
            'inquiries' => $inquiries,
        ]);
    }

    /** Vendor: inbox — all inquiries to their brand */
    public function index()
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        if (!$brand) {
            abort(403);
        }

        $inquiries = Inquiries::with(['user', 'eventPlan'])
            ->where('brand_id', $brand->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('inquiries/index', [
            'inquiries' => $inquiries,
            'flash'     => ['success' => session('success')],
        ]);
    }

    /** Vendor: view single inquiry */
    public function show(string $id)
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::with(['user', 'brand', 'eventPlan.items.serviceCategory'])->findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        // Mark as read
        if ($inquiry->status === 'pending') {
            $inquiry->update(['status' => 'read']);
        }

        return Inertia::render('inquiries/show', [
            'inquiry' => $inquiry,
            'flash'   => ['success' => session('success')],
        ]);
    }

    /** Vendor: update status / add note */
    public function updateStatus(Request $request, string $id)
    {
        $data = $request->validate([
            'status'      => ['required', 'in:pending,read,responded,closed'],
            'vendor_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        $inquiry->update($data);

        return back()->with('success', 'Status inquiry diperbarui.');
    }
}
