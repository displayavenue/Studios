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
                $section->payload = array_merge($definition['payload'], $section->payload ?? []);
            }

            $section->save();
            $isNew ? $created++ : $updated++;
        }

        $this->info("Homepage sections synced. Created: {$created}, updated: {$updated}.");

        return self::SUCCESS;
    }
}
