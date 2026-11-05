<?php

namespace App\Models;

use App\Support\HomepageSectionCatalog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HomepageSection extends Model
{
    protected $fillable = [
        'key',
        'title',
        'subtitle',
        'payload',
        'sort_order',
        'is_enabled',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'is_enabled' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_enabled', true)
            ->where('status', 'published');
    }

    /**
     * @return array<string, mixed>
     */
    public function data(): array
    {
        return HomepageSectionCatalog::normalizePayload($this->key, $this->payload ?? []);
    }

    public function value(string $payloadKey, mixed $default = null): mixed
    {
        $data = $this->data();

        return $data[$payloadKey] ?? $default;
    }

    public function adminLabel(): string
    {
        return HomepageSectionCatalog::label($this->key);
    }

    /**
     * Resolve the public image URL for this section (Media Library first, then path fallback).
     */
    public function imageUrl(?string $fallbackPath = null): ?string
    {
        $data = $this->data();
        $mediaId = $data['media_asset_id'] ?? null;
        if ($mediaId) {
            $asset = MediaAsset::query()->find($mediaId);
            if ($asset) {
                return $asset->publicUrl();
            }
        }

        $path = trim((string) ($data['image_path'] ?? $fallbackPath ?? ''));
        if ($path === '') {
            return $fallbackPath ? asset($fallbackPath) : null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return asset($path);
    }
}
