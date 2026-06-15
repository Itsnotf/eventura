<?php

namespace App\Http\Controllers;

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
            new Middleware('permission:inquiries update', only: ['respond', 'archive', 'unarchive']),
            // close hanya butuh auth + cek kepemilikan (customer action)
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

    /** Vendor: inbox — all inquiries to their brand (non-archived by default) */
    public function index(Request $request)
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        if (!$brand) {
            abort(403);
        }

        $query = Inquiries::with(['user', 'eventPlan'])
            ->where('brand_id', $brand->id);

        if (!$request->boolean('archived')) {
            $query->where('is_archived', false);
        }

        $inquiries = $query->latest()->paginate(20);

        return Inertia::render('inquiries/index', [
            'inquiries'    => $inquiries,
            'showArchived' => $request->boolean('archived'),
            'flash'        => ['success' => session('success')],
        ]);
    }

    /** Vendor: view single inquiry — auto-marks as read */
    public function show(string $id)
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::with(['user', 'brand', 'eventPlan.items.serviceCategory'])->findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        // Auto-mark as read on first open (event-driven)
        if ($inquiry->status === 'pending') {
            $inquiry->update(['status' => 'read', 'read_at' => now()]);
        }

        return Inertia::render('inquiries/show', [
            'inquiry' => $inquiry->fresh(['user', 'brand', 'eventPlan.items.serviceCategory']),
            'flash'   => ['success' => session('success')],
        ]);
    }

    /** Vendor: send a real response — sets status to responded */
    public function respond(Request $request, string $id)
    {
        $data = $request->validate([
            'vendor_response' => ['required', 'string', 'min:5', 'max:3000'],
        ]);

        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        $inquiry->update([
            'vendor_response' => $data['vendor_response'],
            'status'          => 'responded',
            'responded_at'    => now(),
        ]);

        return back()->with('success', 'Balasan berhasil dikirim.');
    }

    /** Vendor: archive for inbox tidying — does NOT change visible status */
    public function archive(string $id)
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        $inquiry->update(['is_archived' => true]);

        return back()->with('success', 'Inquiry diarsipkan.');
    }

    /** Vendor: unarchive */
    public function unarchive(string $id)
    {
        $user  = User::with('brand')->find(Auth::id());
        $brand = $user?->brand;

        $inquiry = Inquiries::findOrFail($id);

        if (!$user->hasRole('admin') && (!$brand || $inquiry->brand_id !== $brand->id)) {
            abort(403);
        }

        $inquiry->update(['is_archived' => false]);

        return back()->with('success', 'Inquiry dipindahkan ke inbox.');
    }

    /** Customer: close own inquiry */
    public function close(string $id)
    {
        $inquiry = Inquiries::findOrFail($id);

        if ($inquiry->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->update(['status' => 'closed', 'closed_at' => now()]);

        return back()->with('success', 'Inquiry ditutup.');
    }
}
