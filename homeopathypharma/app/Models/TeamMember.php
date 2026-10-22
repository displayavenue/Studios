<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'designation',
        'role_key',
        'photo_media_id',
        'biography',
        'responsibilities',
        'qualifications',
        'link_url',
        'sort_order',
        'show_on_homepage',
        'status',
        'started_on',
        'seo_title',
        'seo_description',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'started_on' => 'date',
            'published_at' => 'datetime',
            'show_on_homepage' => 'boolean',
        ];
    }

    public function scopeHomepage(Builder $query): Builder
    {
        return $query->published()->where('show_on_homepage', true)->orderBy('sort_order')->orderBy('name');
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
