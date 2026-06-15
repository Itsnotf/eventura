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
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\EventPlansController;
use App\Http\Controllers\InquiriesController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\ServiceCategoriesController;
use App\Http\Controllers\TestimonialsController;
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

Route::get('/compare', [LandingController::class, 'compare'])->name('compare');
Route::get('/not-found', [BrandsController::class, 'notFound'])->name('not-found');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('brands', BrandsController::class);
    Route::post('brands/{id}/verify', [BrandsController::class, 'verify'])->name('brands.verify');
    Route::post('brands/{id}/unverify', [BrandsController::class, 'unverify'])->name('brands.unverify');
    Route::resource('brand-packages', BrandPackagesController::class);
    Route::resource('brand-portfolios', BrandPortfoliosController::class);

    Route::post('brand-portfolios/{brandPortfolioId}/images', [ImagePortfolioController::class, 'store'])
        ->name('brand-portfolio-images.store');
    Route::delete('brand-portfolios/{brandPortfolioId}/images/{imageId}', [ImagePortfolioController::class, 'destroy'])
        ->name('brand-portfolio-images.destroy');

    // Favorites
    Route::post('favorites/toggle', [FavoritesController::class, 'toggle'])->name('favorites.toggle');
    Route::get('favorites', [FavoritesController::class, 'index'])->name('favorites.index');

    // Event Plans
    Route::get('event-plans', [EventPlansController::class, 'index'])->name('event-plans.index');
    Route::post('event-plans', [EventPlansController::class, 'store'])->name('event-plans.store');
    Route::get('event-plans/{id}', [EventPlansController::class, 'show'])->name('event-plans.show');
    Route::delete('event-plans/{id}', [EventPlansController::class, 'destroy'])->name('event-plans.destroy');
    Route::post('event-plans/{id}/items', [EventPlansController::class, 'addItem'])->name('event-plans.items.add');
    Route::delete('event-plans/{id}/items/{itemId}', [EventPlansController::class, 'removeItem'])->name('event-plans.items.remove');

    // Inquiries
    Route::post('inquiries', [InquiriesController::class, 'store'])->name('inquiries.store');
    Route::get('my-inquiries', [InquiriesController::class, 'myInquiries'])->name('inquiries.mine');
    Route::get('inquiries', [InquiriesController::class, 'index'])->name('inquiries.index');
    Route::get('inquiries/{id}', [InquiriesController::class, 'show'])->name('inquiries.show');
    Route::patch('inquiries/{id}/status', [InquiriesController::class, 'updateStatus'])->name('inquiries.update-status');

    // Availability
    Route::get('availability', [AvailabilityController::class, 'index'])->name('availability.index');
    Route::post('availability', [AvailabilityController::class, 'store'])->name('availability.store');
    Route::delete('availability/{id}', [AvailabilityController::class, 'destroy'])->name('availability.destroy');

    // Testimonials
    Route::post('testimonials', [TestimonialsController::class, 'store'])->name('testimonials.store');
    Route::get('testimonials', [TestimonialsController::class, 'index'])->name('testimonials.index');
    Route::post('testimonials/{id}/publish', [TestimonialsController::class, 'publish'])->name('testimonials.publish');
    Route::post('testimonials/{id}/unpublish', [TestimonialsController::class, 'unpublish'])->name('testimonials.unpublish');

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

