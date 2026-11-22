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
        'Pricing & Payments',
        'Product Selection & Availability',
        'Orders & Account',
        'Delivery & Convenience',
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
     * Parse a step-guide answer into a title + titled steps.
     *
     * Expected format:
     * Guide: Optional heading
     *
     * 1. Step title
     * Step description (one or more lines)
     *
     * 2. Next step title
     * Next description
     *
     * @return array{title: ?string, steps: list<array{title: string, body: string}>}|null
     */
    public function guide(): ?array
    {
        if (! $this->hasAnswer()) {
            return null;
        }

        $raw = trim((string) $this->answer);
        $lines = preg_split('/\r\n|\r|\n/', $raw) ?: [];

        $title = null;
        $steps = [];
        $current = null;

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '') {
                continue;
            }

            if ($title === null && $current === null && preg_match('/^(?:Guide|Title)\s*:\s*(.+)$/iu', $trimmed, $m)) {
                $title = trim($m[1]);
                continue;
            }

            if (preg_match('/^(\d+)[\.\)]\s+(.+)$/u', $trimmed, $m)) {
                if ($current !== null) {
                    $steps[] = $current;
                }
                $current = [
                    'title' => trim($m[2]),
                    'body' => '',
                ];
                continue;
            }

            if ($current === null) {
                // Not a guide format (no numbered step yet).
                return null;
            }

            $current['body'] = trim($current['body'].' '.$trimmed);
        }

        if ($current !== null) {
            $steps[] = $current;
        }

        if (count($steps) < 2) {
            return null;
        }

        // Require detail lines under steps so this is a title+body guide, not a flat list.
        $hasBodies = collect($steps)->contains(fn (array $step) => filled($step['body']));
        if (! $hasBodies) {
            return null;
        }

        return [
            'title' => $title,
            'steps' => $steps,
        ];
    }

    /**
     * Flat numbered lines without per-step detail bodies.
     *
     * @return list<string>|null
     */
    public function steps(): ?array
    {
        if (! $this->hasAnswer() || $this->guide() !== null) {
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
