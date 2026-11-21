<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class EnrichProductDetailsCommand extends Command
{
    protected $signature = 'catalogue:enrich-product-details
        {--brand= : Only enrich one brand slug (sbl, dr-reckeweg, schwabe)}
        {--path= : Enrichment JSON path (defaults to storage/app/imports/product-details.json)}
        {--limit=0 : Limit products updated (0 = all)}
        {--dry-run : Show counts without writing}';

    protected $description = 'Apply scraped brand-site description, benefits, dosage, and safety details to products';

    private const DOSAGE = 'As prescribed by the doctor.';

    public function handle(): int
    {
        $path = (string) $this->option('path');
        if ($path === '') {
            $path = storage_path('app/imports/product-details.json');
        }

        if (! is_file($path)) {
            $this->error('Enrichment file not found: '.$path);

            return self::FAILURE;
        }

        $rows = json_decode((string) file_get_contents($path), true);
        if (! is_array($rows)) {
            $this->error('Invalid enrichment JSON.');

            return self::FAILURE;
        }

        $only = Str::lower(trim((string) $this->option('brand')));
        $limit = (int) $this->option('limit');
        $dryRun = (bool) $this->option('dry-run');

        $updated = 0;
        $missing = 0;
        $seen = 0;

        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }

            $brandSlug = Str::lower((string) ($row['brand'] ?? ''));
            if ($only !== '' && $brandSlug !== $only) {
                continue;
            }

            $sourceSlug = (string) ($row['source_slug'] ?? '');
            $productSlug = (string) ($row['product_slug'] ?? '');
            if ($productSlug === '' && $brandSlug !== '' && $sourceSlug !== '') {
                $productSlug = $this->expectedProductSlug($brandSlug, $sourceSlug);
            }
            if ($productSlug === '') {
                continue;
            }

            $seen++;
            if ($limit > 0 && $updated >= $limit) {
                break;
            }

            $product = Product::query()->where('slug', $productSlug)->first();
            if (! $product && $brandSlug !== '' && $sourceSlug !== '') {
                $product = Product::query()
                    ->where('slug', 'like', $brandSlug.'-%')
                    ->where(function ($q) use ($sourceSlug) {
                        $q->where('slug', 'like', '%'.Str::slug($sourceSlug))
                            ->orWhere('sku', 'like', '%'.Str::upper(Str::limit($sourceSlug, 40, '')));
                    })
                    ->first();
            }

            if (! $product) {
                $missing++;

                continue;
            }

            $description = $this->cleanText($row['description'] ?? null);
            $benefits = $this->cleanText($row['benefits'] ?? null);
            $ingredients = $this->cleanText($row['ingredients'] ?? $row['composition'] ?? null);
            $safety = $this->cleanText($row['safety'] ?? $row['warnings'] ?? null);
            $dosage = $this->cleanText($row['dosage'] ?? null) ?: self::DOSAGE;

            if ($dryRun) {
                $updated++;

                continue;
            }

            $product->fill([
                'description' => $description ?: $product->description,
                'benefits' => $benefits ?: $product->benefits,
                'ingredients' => $ingredients ?: $product->ingredients,
                'directions' => $dosage,
                'warnings' => $safety ?: $product->warnings,
            ]);

            if ($description && (blank($product->short_description) || Str::startsWith((string) $product->short_description, $product->brand?->name.' —'))) {
                $product->short_description = Str::limit($description, 220, '…');
            }

            $product->save();
            $updated++;
        }

        // Ensure every published catalogue product at least has dosage text.
        if (! $dryRun) {
            $brandIds = Brand::query()
                ->when($only !== '', fn ($q) => $q->where('slug', $only))
                ->whereIn('slug', ['sbl', 'dr-reckeweg', 'schwabe'])
                ->pluck('id');

            Product::query()
                ->whereIn('brand_id', $brandIds)
                ->where(function ($q) {
                    $q->whereNull('directions')->orWhere('directions', '');
                })
                ->update(['directions' => self::DOSAGE]);
        }

        $this->info(($dryRun ? 'Dry-run ' : '')."seen={$seen} updated={$updated} missing={$missing}");

        return self::SUCCESS;
    }

    private function expectedProductSlug(string $brandSlug, string $sourceSlug): string
    {
        $normalized = Str::slug($sourceSlug);
        $prefix = Str::slug($brandSlug).'-';
        if ($normalized !== '' && str_starts_with($normalized, $prefix)) {
            $normalized = substr($normalized, strlen($prefix));
        }

        return Str::limit(Str::slug($brandSlug.($normalized !== '' ? '-'.$normalized : '')), 180, '');
    }

    private function cleanText(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $text = trim(html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $text = preg_replace("/[ \t]+/", ' ', $text) ?? $text;
        $text = preg_replace("/\n{3,}/", "\n\n", $text) ?? $text;
        $text = trim($text);

        return $text !== '' ? $text : null;
    }
}
