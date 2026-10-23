<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    protected $fillable = [
        'source', 'external_id', 'caption', 'media_type', 'permalink',
        'remote_media_url', 'media_asset_id', 'posted_at', 'sort_order', 'status',
    ];

    protected function casts(): array
    {
        return ['posted_at' => 'datetime'];
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'media_asset_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function displayUrl(): ?string
    {
        if ($this->media) {
            return $this->media->publicUrl();
        }

        return $this->remote_media_url;
    }
}
