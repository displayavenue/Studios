<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SyncProductCategoriesCommand extends Command
{
    protected $signature = 'catalogue:sync-product-categories
        {--dry-run : Report matches without writing}
        {--path= : Catalogue directory (defaults to storage/app/imports)}';

    protected $description = 'Categorise catalogue products into shop concern categories (Head & Hair, Face & Skin, etc.)';

    /** @var array<string, list<string>> */
    private array $nameKeywords = [
        'head-hair' => [
            'hair', 'scalp', 'dandruff', 'shampoo', 'alopecia', 'bald', 'migraine', 'headache',
            'cranial', 'zauber', 'hair oil', 'hair growth', 'hair drop',
        ],
        'face-skin' => [
            'skin', 'acne', 'eczema', 'psoriasis', 'ointment', 'cream', 'lotion', 'derma',
            'rash', 'wart', 'fungal', 'ringworm', 'vitiligo', 'leucoderma', 'urticaria',
            'oral care', 'toothpaste', 'mouth ulcer',
        ],
        'digestive-health' => [
            'digest', 'stomach', 'liver', 'constipat', 'piles', 'haemorrh', 'hemorrh',
            'diarr', 'dysenter', 'gastric', 'acidity', 'indigest', 'nux vom', 'colic',
            'worm', 'appetite', 'bowel',
        ],
        'womens-care' => [
            'women', 'gynae', 'gynec', 'menstru', 'uter', 'ovarian', 'pregnan', 'lactat',
            'leucorrh', 'vaginal', 'breast', 'pcos', 'period',
        ],
        'mens-care-2aqd' => [
            'men\'s', 'mens ', 'prostate', 'damia', 'erectile', 'sperm', 'impoten', 'virility',
        ],
        'child-care' => [
            'baby', 'child', 'infant', 'paediat', 'pediat', 'kids', 'teething', 'colic baby',
        ],
        'joint-bone' => [
            'joint', 'bone', 'arthrit', 'rheuma', 'muscle', 'sprain', 'backache', 'osteo',
            'sciatica', 'lumbago', 'gout', 'calcarea phos', 'rhus tox',
        ],
        'immunity' => [
            'immun', 'tonic', 'influenza', 'viral', 'infection', 'fever', 'alfalfa', 'ginseng',
            'echinacea', 'cold &', 'cold and',
        ],
        'stress-sleep' => [
            'stress', 'sleep', 'insomnia', 'anxiety', 'calm', 'nervous', 'depression',
            'coffea', 'passiflora', 'avena', 'relax',
        ],
        'senior-health' => [
            'senior', 'geriatr', 'memory', 'alzheimer', 'prostate', 'hypertension',
            'barium', 'causticum', 'secale', 'conium', 'lycopodium', 'anti age', 'anti-age',
        ],
        'respiratory-health' => [
            'respir', 'cough', 'asthma', 'throat', 'lung', 'bronch', 'sinus', 'cold care',
            'antituss', 'expector', 'pharyng', 'tonsill',
        ],
        'weight-and-metabolism' => [
            'weight', 'metabol', 'obes', 'slim', 'fat burn', 'thyroid',
        ],
        'general-wellness' => [
            'wellness', 'vitality', 'general tonic', 'multi', 'health tonic',
        ],
    ];

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $path = (string) ($this->option('path') ?: storage_path('app/imports'));

        $categories = Category::query()->published()->get()->keyBy('slug');
        if ($categories->isEmpty()) {
            $this->error('No published categories found.');

            return self::FAILURE;
        }

        /** @var array<int, array<int, true>> $assignments productId => [categoryId => true] */
        $assignments = [];

        $this->applySblCatalogCategories($path, $categories, $assignments);
        $this->applyNameKeywords($categories, $assignments);

        $fallbackId = $categories->get('general-wellness')?->id;
        if ($fallbackId) {
            Product::query()
                ->published()
                ->orderBy('id')
                ->chunkById(200, function ($products) use (&$assignments, $fallbackId): void {
                    foreach ($products as $product) {
                        if (! isset($assignments[$product->id]) || $assignments[$product->id] === []) {
                            $assignments[$product->id][$fallbackId] = true;
                        }
                    }
                });
        }

        $linked = 0;
        $productsTouched = 0;

        foreach ($assignments as $productId => $categoryMap) {
            $ids = array_map('intval', array_keys($categoryMap));
            sort($ids);
            if ($ids === []) {
                continue;
            }
            $productsTouched++;
            $linked += count($ids);
            if (! $dryRun) {
                Product::query()->find($productId)?->categories()->sync($ids);
            }
        }

        $this->info(($dryRun ? '[dry-run] ' : '')."Categorised {$productsTouched} products ({$linked} category links).");

        foreach ($categories as $slug => $category) {
            $count = Product::query()
                ->published()
                ->whereHas('categories', fn ($q) => $q->where('categories.id', $category->id))
                ->count();
            if ($dryRun) {
                $pending = 0;
                foreach ($assignments as $map) {
                    if (isset($map[$category->id])) {
                        $pending++;
                    }
                }
                $this->line("  {$slug}: ~{$pending} pending (currently {$count})");
            } else {
                $this->line("  {$slug}: {$count}");
            }
        }

        return self::SUCCESS;
    }

    /**
     * @param  \Illuminate\Support\Collection<string, Category>  $categories
     * @param  array<int, array<int, true>>  $assignments
     */
    private function applySblCatalogCategories(string $path, $categories, array &$assignments): void
    {
        $file = rtrim($path, '/').'/sbl-catalog.json';
        if (! is_file($file)) {
            $this->warn("SBL catalogue not found at {$file}; skipping catalogue category map.");

            return;
        }

        $rows = json_decode((string) file_get_contents($file), true);
        if (! is_array($rows)) {
            return;
        }

        $bySlug = Product::query()
            ->published()
            ->where('slug', 'like', 'sbl-%')
            ->pluck('id', 'slug');

        $mapped = 0;
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $sourceSlug = (string) ($row['source_slug'] ?? '');
            $catalogCategory = (string) ($row['category'] ?? '');
            if ($sourceSlug === '' || $catalogCategory === '') {
                continue;
            }

            $siteSlugs = $this->mapCatalogCategory($catalogCategory);
            if ($siteSlugs === []) {
                continue;
            }

            $productSlug = 'sbl-'.Str::slug($sourceSlug);
            // Import uses brandSlug-sourceSlug with limited sanitising — try common forms.
            $candidates = array_unique([
                $productSlug,
                'sbl-'.$sourceSlug,
                'sbl-'.Str::lower($sourceSlug),
            ]);

            $productId = null;
            foreach ($candidates as $candidate) {
                if (isset($bySlug[$candidate])) {
                    $productId = (int) $bySlug[$candidate];
                    break;
                }
            }
            if (! $productId) {
                continue;
            }

            foreach ($siteSlugs as $siteSlug) {
                $category = $categories->get($siteSlug);
                if (! $category) {
                    continue;
                }
                $assignments[$productId][$category->id] = true;
                $mapped++;
            }
        }

        $this->line("SBL catalogue specialty matches: {$mapped}");
    }

    /**
     * @param  \Illuminate\Support\Collection<string, Category>  $categories
     * @param  array<int, array<int, true>>  $assignments
     */
    private function applyNameKeywords($categories, array &$assignments): void
    {
        $matched = 0;
        Product::query()
            ->published()
            ->orderBy('id')
            ->chunkById(250, function ($products) use ($categories, &$assignments, &$matched): void {
                foreach ($products as $product) {
                    $haystack = Str::lower($product->name.' '.$product->slug.' '.$product->short_description);
                    foreach ($this->nameKeywords as $siteSlug => $keywords) {
                        $category = $categories->get($siteSlug);
                        if (! $category) {
                            continue;
                        }
                        foreach ($keywords as $keyword) {
                            if ($keyword !== '' && str_contains($haystack, Str::lower($keyword))) {
                                $assignments[$product->id][$category->id] = true;
                                $matched++;
                                break;
                            }
                        }
                    }
                }
            });

        $this->line("Name-keyword matches: {$matched}");
    }

    /**
     * @return list<string>
     */
    private function mapCatalogCategory(string $catalogCategory): array
    {
        $raw = Str::lower($catalogCategory);
        $slugs = [];

        $rules = [
            'head-hair' => ['hair', 'eye/ear', 'eye', 'ear'],
            'face-skin' => ['skin', 'ointment', 'oral care'],
            'child-care' => ['baby'],
            'womens-care' => ['women'],
            'joint-bone' => ['joint', 'bone', 'muscle'],
            'respiratory-health' => ['respiratory'],
            'digestive-health' => ['stomach', 'constipat', 'piles', 'rectum'],
            'immunity' => ['weakness', 'immun'],
            'general-wellness' => ['general', 'herbals', 'other products'],
        ];

        foreach ($rules as $siteSlug => $needles) {
            foreach ($needles as $needle) {
                if (str_contains($raw, $needle)) {
                    $slugs[] = $siteSlug;
                    break;
                }
            }
        }

        // Pure dilutions / mother tinctures / LM / biochemics are not concern-specific.
        $genericOnly = (
            str_contains($raw, 'dilution')
            || str_contains($raw, 'mother tincture')
            || str_contains($raw, 'lm potency')
            || str_contains($raw, 'trituration')
            || str_contains($raw, 'bio-chemic')
            || $raw === 'homoeopathic'
        ) && $slugs === [];

        if ($genericOnly) {
            return [];
        }

        return array_values(array_unique($slugs));
    }
}
