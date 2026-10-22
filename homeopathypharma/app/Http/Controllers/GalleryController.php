<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use App\Services\Instagram\InstagramFeedService;
use App\Services\SiteSettings;
use Illuminate\View\View;

class GalleryController extends Controller
{
    public function __invoke(SiteSettings $settings, InstagramFeedService $instagram): View
    {
        // Best-effort sync when Instagram is connected (rate-limited lightly by cache).
        if ($instagram->isConfigured() && cache()->add('instagram.sync.lock', 1, now()->addMinutes(30))) {
            $instagram->sync();
        }

        $items = GalleryItem::query()
            ->published()
            ->with('media')
            ->orderByDesc('posted_at')
            ->orderBy('sort_order')
            ->paginate(24);

        return view('pages.gallery', [
            'settings' => $settings,
            'items' => $items,
            'instagramConfigured' => $instagram->isConfigured(),
            'instagramUrl' => $settings->instagramUrl(),
        ]);
    }
}
