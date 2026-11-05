<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\AuditLogger;
use App\Services\CachePurgeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CacheController extends Controller
{
    public function index(): View
    {
        return view('admin.cache.index', [
            'token' => (string) SiteSetting::getValue('frontend_cache_token', '—'),
            'lastClearedAt' => SiteSetting::getValue('frontend_cache_cleared_at'),
        ]);
    }

    public function purge(Request $request, CachePurgeService $purge, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'invalidate_sessions' => ['sometimes', 'boolean'],
        ]);

        $steps = $purge->purge($request->boolean('invalidate_sessions', true));

        SiteSetting::query()->updateOrCreate(
            ['key' => 'frontend_cache_cleared_at'],
            [
                'group' => 'system',
                'value' => now()->timezone('Asia/Kolkata')->toDateTimeString(),
                'type' => 'string',
            ]
        );
        SiteSetting::forgetCache();

        $audit->log('cache.purged', null, [
            'steps' => $steps,
            'invalidate_sessions' => $request->boolean('invalidate_sessions', true),
        ]);

        return redirect()
            ->route('admin.cache.index')
            ->with('status', 'Cache & cookies cleared.')
            ->with('cache_steps', $steps);
    }
}
