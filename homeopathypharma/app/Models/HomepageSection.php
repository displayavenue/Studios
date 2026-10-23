<?php

namespace App\Models;

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
}
