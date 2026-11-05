<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use App\Support\HomepageSectionCatalog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class HomepageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        foreach (HomepageSectionCatalog::definitions() as $key => $definition) {
            $existing = HomepageSection::query()->where('key', $key)->first();

            HomepageSection::query()->updateOrCreate(
                ['key' => $key],
                [
                    'title' => $existing?->title ?: $definition['title'],
                    'subtitle' => $existing?->subtitle ?: $definition['subtitle'],
                    'payload' => array_merge($definition['payload'], $existing?->payload ?? []),
                    'sort_order' => $existing?->sort_order ?? $definition['sort_order'],
                    'is_enabled' => $existing?->is_enabled ?? true,
                    'status' => $existing?->status ?? 'published',
                    'published_at' => $existing?->published_at ?? $now,
                ]
            );
        }
    }
}
