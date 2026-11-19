<?php

namespace App\Http\Controllers;

use App\Services\HealthExplorerCatalog;
use App\Services\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Throwable;

class HealthExplorerController extends Controller
{
    public function show(SiteSettings $settings): View
    {
        return view('pages.health-explorer', [
            'settings' => $settings,
            'catalogUrl' => url('/api/health-explorer/catalog'),
        ]);
    }

    public function catalog(HealthExplorerCatalog $explorerCatalog): JsonResponse
    {
        try {
            $catalog = $explorerCatalog->get();
        } catch (Throwable) {
            return response()->json([
                'message' => 'Health explorer catalogue is not available.',
            ], 404);
        }

        // Public explorer only sees enabled systems; full catalogue stays in storage/admin.
        $catalog['systems'] = array_values(array_filter(
            $catalog['systems'] ?? [],
            fn ($system) => ! array_key_exists('enabled', $system) || ! empty($system['enabled'])
        ));

        return response()
            ->json($catalog)
            ->header('Cache-Control', 'public, max-age=60');
    }
}
