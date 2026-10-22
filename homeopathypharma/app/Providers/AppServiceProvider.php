<?php

namespace App\Providers;

use App\Models\DoctorProfile;
use App\Models\HomepageSection;
use App\Models\MediaAsset;
use App\Models\PolicyPage;
use App\Models\TeamMember;
use App\Services\Notifications\LogNotifier;
use App\Services\Notifications\Notifier;
use App\Services\Video\NullVideoMeetingProvider;
use App\Services\Video\VideoMeetingProvider;
use App\Services\SiteSettings;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SiteSettings::class);
        $this->app->bind(VideoMeetingProvider::class, NullVideoMeetingProvider::class);
        $this->app->bind(Notifier::class, LogNotifier::class);
    }

    public function boot(): void
    {
        Route::bind('medium', fn (string $value) => MediaAsset::query()->findOrFail($value));
        Route::bind('team', fn (string $value) => TeamMember::query()->findOrFail($value));
        Route::bind('homepage', fn (string $value) => HomepageSection::query()->findOrFail($value));
        Route::bind('doctor', fn (string $value) => DoctorProfile::query()->findOrFail($value));
        Route::bind('policy', fn (string $value) => PolicyPage::query()->findOrFail($value));

        View::composer(['layouts.app', 'components.*'], function ($view) {
            $view->with('settings', app(SiteSettings::class));
        });
    }
}

