<?php

use App\Http\Controllers\BrandAnalyticsController;
use App\Http\Controllers\BrandPackagesController;
use App\Http\Controllers\BrandPortfoliosController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImagePortfolioController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ServiceCategoriesController;
use App\Http\Controllers\VendorApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'home'])->name('home');
Route::get('/explore', [LandingController::class, 'explore'])->name('explore');
Route::get('/brand/{slug}', [LandingController::class, 'brandDetail'])->name('brand.detail');
Route::get('/brand/{slug}/portfolio/{portfolio}', [LandingController::class, 'portfolioDetail'])->name('brand.portfolio.detail');
Route::get('/portfolio', [LandingController::class, 'portfolios'])->name('portfolio');
Route::get('/join', [LandingController::class, 'join'])->name('join');
Route::post('/join/apply', [VendorApplicationController::class, 'apply'])
    ->name('join.apply')
    ->middleware('throttle:5,1');
Route::post('/brand/{slug}/track-whatsapp', [BrandAnalyticsController::class, 'trackWhatsapp'])
    ->name('brand.track-whatsapp');

Route::get('/not-found', [BrandsController::class, 'notFound'])->name('not-found');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('brands', BrandsController::class);
    Route::resource('brand-packages', BrandPackagesController::class);
    Route::resource('brand-portfolios', BrandPortfoliosController::class);

    Route::post('brand-portfolios/{brandPortfolioId}/images', [ImagePortfolioController::class, 'store'])
        ->name('brand-portfolio-images.store');
    Route::delete('brand-portfolios/{brandPortfolioId}/images/{imageId}', [ImagePortfolioController::class, 'destroy'])
        ->name('brand-portfolio-images.destroy');

    // Service Categories (admin)
    Route::resource('service-categories', ServiceCategoriesController::class)->except(['show']);

    // Vendor Applications (admin)
    Route::get('vendor-applications', [VendorApplicationController::class, 'index'])
        ->name('vendor-applications.index');
    Route::get('vendor-applications/{id}', [VendorApplicationController::class, 'show'])
        ->name('vendor-applications.show');
    Route::post('vendor-applications/{id}/approve', [VendorApplicationController::class, 'approve'])
        ->name('vendor-applications.approve');
    Route::post('vendor-applications/{id}/reject', [VendorApplicationController::class, 'reject'])
        ->name('vendor-applications.reject');

});

require __DIR__ . '/settings.php';

