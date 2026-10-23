<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class HealthCondition extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'category',
        'image_url',
        'image_alt',
        'snippet',
        'short_description',
        'long_description',
        'faqs',
        'reviews',
        'review_count',
        'rating_average',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'is_indexed',
        'status',
        'published_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'faqs' => 'array',
            'reviews' => 'array',
            'seo_keywords' => 'array',
            'is_indexed' => 'boolean',
            'rating_average' => 'float',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeIndexed(Builder $query): Builder
    {
        return $query->published()->where('is_indexed', true);
    }

    public function whatsappMessage(): string
    {
        return 'Hi HOMEOPATHY PHARMA, I want guidance about '.$this->title.'.';
    }
}
