<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Admin bypasses all permission checks
        Gate::before(fn ($user) => $user->hasRole('admin') ? true : null);
    }
}
