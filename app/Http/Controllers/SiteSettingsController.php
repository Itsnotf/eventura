<?php

namespace App\Http\Controllers;

use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class SiteSettingsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:site settings index', only: ['index']),
            new Middleware('permission:site settings edit', only: ['update']),
        ];
    }

    public function index()
    {
        $settings = SiteSettings::orderBy('group')->orderBy('sort')->get();

        return Inertia::render('site-settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings'         => ['required', 'array'],
            'settings.*.id'    => ['required', 'integer', 'exists:site_settings,id'],
            'settings.*.value' => ['nullable', 'string', 'max:10000'],
            'images'           => ['nullable', 'array'],
            'images.*'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        foreach ($request->input('settings', []) as $item) {
            SiteSettings::where('id', $item['id'])->update(['value' => $item['value'] ?? '']);
        }

        foreach ($request->file('images', []) as $settingId => $file) {
            if (!$file) continue;
            $path = $file->store('site', 'public');
            SiteSettings::where('id', (int) $settingId)->update(['value' => $path]);
        }

        SiteSettings::clearCache();

        return back()->with('success', 'Pengaturan situs berhasil disimpan.');
    }

    public function about()
    {
        $settings = SiteSettings::group('about')->keyBy('key');

        return Inertia::render('landing/tentang-kami', [
            'settings' => $settings,
        ]);
    }

    public function contact()
    {
        $settings = SiteSettings::group('contact')->keyBy('key');

        return Inertia::render('landing/kontak', [
            'settings' => $settings,
        ]);
    }
}
