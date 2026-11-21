<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class MarkBrandHighlightsCommand extends Command
{
    protected $signature = 'catalogue:mark-brand-highlights
        {--brand= : Limit to one brand slug}
        {--popular=12 : Popular products per brand (default; larger brands get more)}
        {--deals=12 : Super Saving products per brand (default; larger brands get more)}
        {--dry-run : Report selections without writing}';

    protected $description = 'Mark Popular and Super Saving picks for every published brand (admin can override)';

    public function handle(): int
    {
        $only = strtolower(trim((string) $this->option('brand')));
        $popularLimit = max(0, (int) $this->option('popular'));
        $dealLimit = max(0, (int) $this->option('deals'));
        $dryRun = (bool) $this->option('dry-run');

        $brandsQuery = Brand::query()->published()->orderBy('sort_order')->orderBy('name');
        if ($only !== '') {
            $brandsQuery->where('slug', $only);
        }

        $brands = $brandsQuery->get();
        if ($brands->isEmpty()) {
            $this->error($only !== '' ? "Brand [{$only}] not found." : 'No published brands found.');

            return self::FAILURE;
        }

        foreach ($brands as $brand) {
            $products = Product::query()
                ->where('brand_id', $brand->id)
                ->where('status', 'published')
                ->where('price_paise', '>', 0)
                ->withCount('images')
                ->orderByDesc('id')
                ->get();

            if ($products->isEmpty()) {
                $this->warn("No published products for {$brand->name}.");

                continue;
            }

            $brandPopular = $this->limitForBrand($popularLimit, $products->count());
            $brandDeals = $this->limitForBrand($dealLimit, $products->count());

            $popular = $this->pickPopular($products, $brandPopular);
            $deals = $this->pickDeals($products, $brandDeals, $popular->pluck('id')->all());

            $this->info(sprintf(
                '%s: popular=%d deals=%d (of %d products)',
                $brand->name,
                $popular->count(),
                $deals->count(),
                $products->count()
            ));

            if ($dryRun) {
                foreach ($popular as $product) {
                    $this->line('  popular: '.$product->name);
                }
                foreach ($deals as $product) {
                    $this->line('  deal: '.$product->name);
                }

                continue;
            }

            Product::query()
                ->where('brand_id', $brand->id)
                ->update([
                    'is_featured' => false,
                    'is_super_saving' => false,
                ]);

            if ($popular->isNotEmpty()) {
                Product::query()
                    ->whereIn('id', $popular->pluck('id')->all())
                    ->update(['is_featured' => true]);
            }

            foreach ($deals as $product) {
                $updates = ['is_super_saving' => true];
                if ($product->sale_price_paise === null || $product->sale_price_paise >= $product->price_paise) {
                    $updates['sale_price_paise'] = (int) max(100, (int) round($product->price_paise * 0.85));
                }
                Product::query()->whereKey($product->id)->update($updates);
            }
        }

        $this->info('Done. Admin Popular / Super Saving toggles remain available to override.');

        return self::SUCCESS;
    }

    /**
     * Scale picks with catalogue size so large brands contribute more to "View all".
     */
    private function limitForBrand(int $base, int $productCount): int
    {
        if ($base <= 0 || $productCount <= 0) {
            return 0;
        }

        if ($productCount >= 4000) {
            return min($productCount, max($base, 48));
        }
        if ($productCount >= 1000) {
            return min($productCount, max($base, 24));
        }
        if ($productCount >= 500) {
            return min($productCount, max($base, 18));
        }

        return min($productCount, $base);
    }

    /**
     * Prefer speciality / named care products over pure dilutions for homepage Popular.
     *
     * @param  Collection<int, Product>  $products
     * @return Collection<int, Product>
     */
    private function pickPopular(Collection $products, int $limit): Collection
    {
        if ($limit <= 0) {
            return collect();
        }

        $scored = $products->map(function (Product $product) {
            $name = strtolower($product->name.' '.$product->package_size);
            $score = 0;
            if ((int) ($product->images_count ?? 0) > 0) {
                $score += 5;
            }
            if (filled($product->package_size)) {
                $score += 2;
            }
            if (preg_match('/\b(syrup|tonic|cream|ointment|shampoo|oil|juice|drops|tablet|capsule|soap|gel)\b/i', $name)) {
                $score += 4;
            }
            if (preg_match('/\b(dilution|mother tincture|trituration|globule|lm\b|potency)\b/i', $name)) {
                $score -= 2;
            }
            if ($product->sale_price_paise && $product->sale_price_paise < $product->price_paise) {
                $score += 1;
            }

            return [$score, $product];
        })->sortByDesc(fn ($row) => $row[0])->values();

        return $scored->take($limit)->map(fn ($row) => $row[1])->values();
    }

    /**
     * Prefer products that already have a sale price; otherwise apply a light discount later.
     *
     * @param  Collection<int, Product>  $products
     * @param  list<int>  $excludeIds
     * @return Collection<int, Product>
     */
    private function pickDeals(Collection $products, int $limit, array $excludeIds): Collection
    {
        if ($limit <= 0) {
            return collect();
        }

        $candidates = $products->reject(fn (Product $p) => in_array($p->id, $excludeIds, true))->values();

        $withSale = $candidates
            ->filter(fn (Product $p) => $p->sale_price_paise !== null && $p->sale_price_paise < $p->price_paise)
            ->sortByDesc(function (Product $p) {
                return (1 - ($p->sale_price_paise / max(1, $p->price_paise))) * 100;
            })
            ->values();

        $picked = $withSale->take($limit);
        if ($picked->count() >= $limit) {
            return $picked;
        }

        $need = $limit - $picked->count();
        $pickedIds = $picked->pluck('id')->all();
        $fillers = $candidates
            ->reject(fn (Product $p) => in_array($p->id, $pickedIds, true))
            ->filter(fn (Product $p) => (int) ($p->images_count ?? 0) > 0 || filled($p->package_size))
            ->take($need);

        return $picked->concat($fillers)->values();
    }
}
