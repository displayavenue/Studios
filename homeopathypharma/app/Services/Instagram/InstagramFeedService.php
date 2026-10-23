<?php

namespace App\Services\Instagram;

use App\Models\GalleryItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Pulls media via Instagram Graph / Basic Display style endpoints when a token is configured.
 * Does not scrape Instagram anonymously (blocked / against platform terms).
 */
class InstagramFeedService
{
    public function isConfigured(): bool
    {
        return filled(config('services.instagram.access_token'))
            && filled(config('services.instagram.user_id'));
    }

    /**
     * @return array{synced:int,message:string}
     */
    public function sync(): array
    {
        if (! $this->isConfigured()) {
            return [
                'synced' => 0,
                'message' => 'Instagram is not connected. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID, or curate gallery items in admin.',
            ];
        }

        $userId = config('services.instagram.user_id');
        $token = config('services.instagram.access_token');
        $base = rtrim((string) config('services.instagram.graph_url', 'https://graph.instagram.com'), '/');

        $response = Http::timeout(20)->get("{$base}/{$userId}/media", [
            'fields' => 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
            'access_token' => $token,
            'limit' => 50,
        ]);

        if (! $response->successful()) {
            Log::warning('instagram.sync_failed', ['status' => $response->status(), 'body' => $response->body()]);

            return [
                'synced' => 0,
                'message' => 'Instagram API request failed. Check the access token and permissions.',
            ];
        }

        $synced = 0;
        foreach ($response->json('data', []) as $item) {
            $mediaUrl = $item['media_url'] ?? $item['thumbnail_url'] ?? null;
            GalleryItem::query()->updateOrCreate(
                [
                    'source' => 'instagram',
                    'external_id' => (string) $item['id'],
                ],
                [
                    'caption' => isset($item['caption']) ? mb_substr((string) $item['caption'], 0, 500) : null,
                    'media_type' => strtolower((string) ($item['media_type'] ?? 'image')),
                    'permalink' => $item['permalink'] ?? null,
                    'remote_media_url' => $mediaUrl,
                    'posted_at' => isset($item['timestamp']) ? Carbon::parse($item['timestamp']) : null,
                    'status' => 'published',
                ]
            );
            $synced++;
        }

        return [
            'synced' => $synced,
            'message' => "Synced {$synced} Instagram posts into the gallery.",
        ];
    }
}
