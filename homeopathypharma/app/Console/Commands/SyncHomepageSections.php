<?php

namespace App\Console\Commands;

use App\Models\HomepageSection;
use App\Support\HomepageSectionCatalog;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SyncHomepageSections extends Command
{
    protected $signature = 'homepage:sync-sections {--force-payload : Overwrite payload with catalog defaults}';

    protected $description = 'Ensure every homepage section key from HomepageSectionCatalog exists in the database';

    public function handle(): int
    {
        $now = Carbon::now();
        $created = 0;
        $updated = 0;

        foreach (HomepageSectionCatalog::definitions() as $key => $definition) {
            $section = HomepageSection::query()->firstOrNew(['key' => $key]);
            $isNew = ! $section->exists;

            $section->fill([
                'title' => $section->title ?: $definition['title'],
                'subtitle' => $section->subtitle ?: $definition['subtitle'],
                'sort_order' => $section->exists ? $section->sort_order : $definition['sort_order'],
                'is_enabled' => $section->exists ? $section->is_enabled : true,
                'status' => $section->exists ? $section->status : 'published',
                'published_at' => $section->published_at ?: $now,
            ]);

            if ($isNew || $this->option('force-payload')) {
                $section->payload = $definition['payload'];
            } else {
                $merged = array_merge($definition['payload'], $section->payload ?? []);
                // Keep Popular / Super Saving "view all" links pointed at collection filters
                // even when older section payloads still use /shop or /shop?sort=price_asc.
                if (in_array($key, ['featured_products', 'deals'], true)) {
                    if (isset($definition['payload']['view_all_href'])) {
                        $merged['view_all_href'] = $definition['payload']['view_all_href'];
                    }
                    if (isset($definition['payload']['view_all_label'])) {
                        $merged['view_all_label'] = $definition['payload']['view_all_label'];
                    }
                }
                $section->payload = $merged;
            }

            $section->save();
            $isNew ? $created++ : $updated++;
        }

        $this->info("Homepage sections synced. Created: {$created}, updated: {$updated}.");

        return self::SUCCESS;
    }
}
