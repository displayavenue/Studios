<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;

class CachePurgeService
{
    /**
     * Clear app caches, bump frontend asset tokens, and optionally wipe other sessions/cookies.
     *
     * @return list<string>
     */
    public function purge(bool $invalidateVisitorSessions = true): array
    {
        $done = [];

        try {
            Artisan::call('optimize:clear');
            $done[] = 'Application optimize cache cleared (config, route, view, events, compiled).';
        } catch (\Throwable $e) {
            // Fall back to individual clears if optimize:clear is unavailable.
            foreach (['cache:clear', 'view:clear', 'route:clear', 'config:clear'] as $cmd) {
                try {
                    Artisan::call($cmd);
                    $done[] = "Ran {$cmd}.";
                } catch (\Throwable) {
                    // ignore individual failures
                }
            }
        }

        Cache::flush();
        $done[] = 'Runtime cache store flushed.';

        SiteSetting::forgetCache();
        $done[] = 'Site settings cache cleared.';

        $token = (string) time();
        SiteSetting::query()->updateOrCreate(
            ['key' => 'frontend_cache_token'],
            [
                'group' => 'system',
                'value' => $token,
                'type' => 'string',
            ]
        );
        SiteSetting::forgetCache();
        $done[] = "Frontend asset cache token bumped to {$token} (forces CSS/JS refresh).";

        // Clear compiled Blade leftovers if any remain.
        $viewPath = storage_path('framework/views');
        if (is_dir($viewPath)) {
            foreach (File::files($viewPath) as $file) {
                @unlink($file->getPathname());
            }
            $done[] = 'Compiled Blade views removed.';
        }

        if ($invalidateVisitorSessions) {
            $done = array_merge($done, $this->invalidateOtherSessions());
        }

        return $done;
    }

    /**
     * @return list<string>
     */
    private function invalidateOtherSessions(): array
    {
        $done = [];
        $keepId = Session::getId();

        if (config('session.driver') === 'database') {
            $table = config('session.table', 'sessions');
            $deleted = DB::table($table)->when($keepId, fn ($q) => $q->where('id', '!=', $keepId))->delete();
            $done[] = "Cleared {$deleted} visitor/admin session cookie(s) from the database (your current login kept).";
        } elseif (config('session.driver') === 'file') {
            $path = config('session.files', storage_path('framework/sessions'));
            $count = 0;
            if (is_dir($path)) {
                foreach (File::files($path) as $file) {
                    if ($keepId && $file->getFilename() === $keepId) {
                        continue;
                    }
                    if (@unlink($file->getPathname())) {
                        $count++;
                    }
                }
            }
            $done[] = "Cleared {$count} session file(s) (your current login kept).";
        } else {
            $done[] = 'Session driver is '.config('session.driver').' — cookie invalidation skipped (use logout or wait for expiry).';
        }

        return $done;
    }
}
