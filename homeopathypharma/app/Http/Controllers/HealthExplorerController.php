<?php

namespace App\Http\Controllers;

use App\Services\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\View\View;

class HealthExplorerController extends Controller
{
    public function show(SiteSettings $settings): View
    {
        return view('pages.health-explorer', [
            'settings' => $settings,
            'catalogUrl' => url('/api/health-explorer/catalog'),
        ]);
    }

    public function catalog(): JsonResponse
    {
        $path = public_path('data/health-explorer/catalog.json');

        if (! File::exists($path)) {
            return response()->json([
                'message' => 'Health explorer catalogue is not available.',
            ], 404);
        }

        $catalog = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);

        return response()
            ->json($catalog)
            ->header('Cache-Control', 'public, max-age=300');
    }
}
