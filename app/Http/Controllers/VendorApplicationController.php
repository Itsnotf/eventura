<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendorApplicationRequest\StoreVendorApplicationRequest;
use App\Models\Brands;
use App\Models\User;
use App\Models\VendorApplications;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VendorApplicationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:vendor applications index', only: ['index']),
            new Middleware('permission:vendor applications show', only: ['show']),
            new Middleware('permission:vendor applications approve', only: ['approve']),
            new Middleware('permission:vendor applications reject', only: ['reject']),
        ];
    }

    /** Public: submit application form */
    public function apply(StoreVendorApplicationRequest $request)
    {
        $documentPath = $request->file('document')->store('vendor-applications', 'public');

        VendorApplications::create([
            'applicant_name' => $request->applicant_name,
            'email'          => $request->email,
            'phone'          => $request->phone,
            'brand_name'     => $request->brand_name,
            'category'       => $request->category,
            'message'        => $request->message,
            'document'       => $documentPath,
            'status'         => 'pending',
        ]);

        return redirect()->route('join')->with('success', 'Aplikasi Anda berhasil dikirim. Admin akan menghubungi Anda segera.');
    }

    /** Admin: list all applications */
    public function index(Request $request)
    {
        $applications = VendorApplications::with('reviewer')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('vendor-applications/index', [
            'applications' => $applications,
            'filters'      => $request->only('status'),
            'flash'        => ['success' => session('success')],
        ]);
    }

    /** Admin: view single application */
    public function show(string $id)
    {
        $application = VendorApplications::with('reviewer')->findOrFail($id);

        return Inertia::render('vendor-applications/show', [
            'application'  => $application,
            'documentUrl'  => asset('storage/' . $application->document),
        ]);
    }

    /** Admin: approve → create User + Brand */
    public function approve(string $id)
    {
        $application = VendorApplications::findOrFail($id);

        if ($application->status !== 'pending') {
            return back()->with('error', 'Aplikasi ini sudah diproses.');
        }

        // Find or create vendor user
        $vendor = User::firstOrCreate(
            ['email' => $application->email],
            [
                'name'              => $application->applicant_name,
                'password'          => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
            ]
        );
        $vendor->syncRoles(['vendor']);

        // Create brand if user doesn't have one yet
        if (!$vendor->brand) {
            Brands::create([
                'user_id'     => $vendor->id,
                'name'        => $application->brand_name,
                'slug'        => Str::slug($application->brand_name) . '-' . Str::random(4),
                'category'    => [$application->category],
                'description' => '',
                'address'     => '',
                'is_active'   => true,
            ]);
        }

        $application->update([
            'status'      => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // Send password reset so vendor can set their own password
        \Illuminate\Support\Facades\Password::broker()->sendResetLink(['email' => $vendor->email]);

        return redirect()->route('vendor-applications.index')
            ->with('success', "Aplikasi {$application->brand_name} disetujui. Undangan dikirim ke {$application->email}.");
    }

    /** Admin: reject application */
    public function reject(string $id)
    {
        $application = VendorApplications::findOrFail($id);

        if ($application->status !== 'pending') {
            return back()->with('error', 'Aplikasi ini sudah diproses.');
        }

        $application->update([
            'status'      => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('vendor-applications.index')
            ->with('success', "Aplikasi {$application->brand_name} ditolak.");
    }
}
