<?php

namespace App\Providers;

use App\Services\SiteSettings;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SiteSettings::class);
    }

    public function boot(): void
    {
        View::composer(['layouts.app', 'components.*'], function ($view) {
            $view->with('settings', app(SiteSettings::class));
        });
    }
}
