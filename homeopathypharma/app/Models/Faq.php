<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    public const CATEGORIES = [
        'Orders & Shopping',
        'Payments & Delivery',
        'Medicines & Products',
        'Consultation',
        'Returns & Customer Support',
    ];

    protected $fillable = [
        'category',
        'question',
        'answer',
        'sort_order',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function hasAnswer(): bool
    {
        return filled(trim((string) $this->answer));
    }
}
