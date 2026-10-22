<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PolicyPage extends Model
{
    protected $fillable = [
        'key', 'title', 'slug', 'body', 'seo_title', 'seo_description', 'status', 'published_at',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
