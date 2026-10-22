<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    protected $fillable = [
        'author_name', 'author_role', 'quote', 'rating', 'photo_media_id',
        'show_on_homepage', 'sort_order', 'status', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'show_on_homepage' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'photo_media_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
