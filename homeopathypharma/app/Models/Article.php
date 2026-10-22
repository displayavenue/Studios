<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $fillable = [
        'article_category_id', 'title', 'slug', 'content_type', 'excerpt', 'body', 'cover_media_id',
        'author_name', 'seo_title', 'seo_description', 'is_featured', 'show_on_homepage', 'status',
        'published_at', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'show_on_homepage' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function scopeCaseStudies(Builder $query): Builder
    {
        return $query->where('content_type', 'case_study');
    }

    public function scopeBlog(Builder $query): Builder
    {
        return $query->whereIn('content_type', ['blog', 'article']);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category_id');
    }

    public function cover(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'cover_media_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
