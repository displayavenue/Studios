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

    /**
     * Numbered step lines (e.g. "1. Do this") for ordered-list rendering.
     *
     * @return list<string>|null
     */
    public function steps(): ?array
    {
        if (! $this->hasAnswer()) {
            return null;
        }

        $lines = preg_split('/\r\n|\r|\n/', trim((string) $this->answer)) ?: [];
        $lines = array_values(array_filter(array_map('trim', $lines), fn (string $line) => $line !== ''));

        if (count($lines) < 2) {
            return null;
        }

        $steps = [];
        foreach ($lines as $line) {
            if (! preg_match('/^\d+[\.\)]\s+(.+)$/u', $line, $matches)) {
                return null;
            }
            $steps[] = $matches[1];
        }

        return $steps;
    }
}
