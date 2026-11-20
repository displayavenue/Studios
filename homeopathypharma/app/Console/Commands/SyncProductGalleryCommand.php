<?php

namespace App\Console\Commands;

use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\MediaUploader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SyncProductGalleryCommand extends Command
{
    protected $signature = 'catalogue:sync-product-galleries
        {--brand= : Limit to one brand slug (sbl, dr-reckeweg, schwabe)}
        {--limit=0 : Limit products processed (0 = all)}
        {--skip-scrape : Only use catalogue JSON images; do not scrape product pages}
        {--homepage-only : Only backfill Popular / Super Saving products that are missing images}
        {--path= : Catalogue directory (defaults to storage/app/imports)}';

    protected $description = 'Attach catalogue/source gallery images to products and backfill Popular/Super Saving images';

    /** @var array<string, int> */
    private array $mediaByHash = [];

    public function handle(MediaUploader $uploader): int
    {
        $catalogDir = (string) $this->option('path');
        if ($catalogDir === '') {
            $catalogDir = storage_path('app/imports');
        }

        if ($this->option('homepage-only')) {
            return $this->backfillHomepageImages($uploader, $catalogDir);
        }

        $only = (string) $this->option('brand');
        $limit = (int) $this->option('limit');
        $skipScrape = (bool) $this->option('skip-scrape');

        $files = [
            'sbl' => 'sbl-catalog.json',
            'dr-reckeweg' => 'reckeweg-catalog.json',
            'schwabe' => 'schwabe-catalog.json',
        ];

        if ($only !== '') {
            if (! isset($files[$only])) {
                $this->error("Unknown brand [{$only}]");

                return self::FAILURE;
            }
            $files = [$only => $files[$only]];
        }

        $attached = 0;
        $multi = 0;

        foreach ($files as $brandSlug => $file) {
            $path = rtrim($catalogDir, '/').'/'.$file;
            if (! is_file($path)) {
                $this->warn("Missing {$path}");

                continue;
            }

            $rows = json_decode((string) file_get_contents($path), true);
            if (! is_array($rows)) {
                $this->error("Invalid JSON {$path}");

                return self::FAILURE;
            }

            if ($limit > 0) {
                $rows = array_slice($rows, 0, $limit);
            }

            $this->info("Syncing galleries for {$brandSlug} (".count($rows).')…');
            $bar = $this->output->createProgressBar(count($rows));
            $bar->start();

            $changedCatalog = false;

            foreach ($rows as &$row) {
                if (! is_array($row)) {
                    $bar->advance();

                    continue;
                }

                $sourceSlug = (string) ($row['source_slug'] ?? $row['slug'] ?? '');
                if ($sourceSlug === '') {
                    $bar->advance();

                    continue;
                }

                $productSlug = Str::limit(Str::slug($brandSlug.'-'.$sourceSlug), 180, '');
                $product = Product::query()->where('slug', $productSlug)->first();
                if (! $product) {
                    $bar->advance();

                    continue;
                }

                $pageUrl = $skipScrape ? null : (string) ($row['url'] ?? '');
                $urls = $this->collectImageUrls($row, $pageUrl !== '' ? $pageUrl : null, $brandSlug);
                if ($urls === []) {
                    $bar->advance();

                    continue;
                }

                if (count($urls) > 1) {
                    $row['images'] = $urls;
                    $changedCatalog = true;
                    $multi++;
                }

                $attached += $this->attachUrls($product, $urls, $uploader, keepExisting: true);
                $bar->advance();
            }
            unset($row);

            $bar->finish();
            $this->newLine();

            if ($changedCatalog) {
                file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                $this->line('  updated catalogue file with multi-image entries');
            }
        }

        $this->line("attached_new_links={$attached} multi_image_products={$multi}");
        $this->backfillHomepageImages($uploader, $catalogDir);

        return self::SUCCESS;
    }

    private function backfillHomepageImages(MediaUploader $uploader, string $catalogDir): int
    {
        $targets = Product::query()
            ->published()
            ->where(function ($q) {
                $q->where('is_featured', true)->orWhere('is_super_saving', true);
            })
            ->with(['images', 'brand'])
            ->get()
            ->filter(fn (Product $p) => $p->images->isEmpty())
            ->values();

        $this->info('Backfilling homepage products missing images: '.$targets->count());

        $matched = 0;
        foreach ($targets as $product) {
            $donor = $this->findCatalogDonor($product);
            if (! $donor) {
                $this->line('  no match for '.$product->slug);

                continue;
            }

            $donor->loadMissing('images.media');
            if ($donor->images->isEmpty()) {
                $urls = $this->urlsForProductSlug($donor->slug, $catalogDir);
                if ($urls !== []) {
                    $this->attachUrls($donor, $urls, $uploader, keepExisting: true);
                    $donor->load('images.media');
                }
            }

            foreach ($donor->images as $index => $image) {
                if (! $image->media_asset_id) {
                    continue;
                }
                ProductImage::query()->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'media_asset_id' => $image->media_asset_id,
                    ],
                    [
                        'sort_order' => $index,
                        'is_primary' => $index === 0,
                    ]
                );
            }

            if ($product->images()->exists()) {
                $matched++;
                $this->line('  linked '.$product->slug.' ← '.$donor->slug);
            }
        }

        $this->info("homepage_image_matches={$matched}");

        return self::SUCCESS;
    }

    private function findCatalogDonor(Product $product): ?Product
    {
        $brandId = $product->brand_id;
        $needle = $this->normalizeName($product->name);

        $candidates = Product::query()
            ->published()
            ->where('id', '!=', $product->id)
            ->when($brandId, fn ($q) => $q->where('brand_id', $brandId))
            ->whereHas('images')
            ->with('images')
            ->get();

        $best = null;
        $bestScore = 0;
        foreach ($candidates as $candidate) {
            $score = $this->nameScore($needle, $this->normalizeName($candidate->name), $product->slug, $candidate->slug);
            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $candidate;
            }
        }

        return $bestScore >= 70 ? $best : null;
    }

    private function normalizeName(string $name): string
    {
        $name = Str::lower($name);
        $name = preg_replace('/\b(dr\.?\s*)?(reckeweg|sbl|schwabe)\b/u', '', $name) ?? $name;
        $name = preg_replace('/[^a-z0-9]+/u', ' ', $name) ?? $name;

        return trim(preg_replace('/\s+/', ' ', $name) ?? $name);
    }

    private function nameScore(string $a, string $b, string $slugA, string $slugB): int
    {
        if ($a === '' || $b === '') {
            return 0;
        }
        if ($a === $b) {
            return 100;
        }
        similar_text($a, $b, $pct);
        $score = (int) round($pct);

        $tokensA = array_filter(explode(' ', $a));
        $tokensB = array_filter(explode(' ', $b));
        $overlap = count(array_intersect($tokensA, $tokensB));
        $score += min(20, $overlap * 5);

        $tail = Str::after($slugA, '-');
        if ($tail !== '' && Str::contains($slugB, $tail)) {
            $score += 10;
        }

        return min(100, $score);
    }

    /**
     * @param  array<string, mixed>  $row
     * @return list<string>
     */
    private function collectImageUrls(array $row, ?string $pageUrl, string $brandSlug): array
    {
        $urls = [];
        $primary = trim((string) ($row['image'] ?? ''));
        if ($primary !== '') {
            $urls[] = $primary;
        }
        if (! empty($row['images']) && is_array($row['images'])) {
            foreach ($row['images'] as $image) {
                $image = trim((string) $image);
                if ($image !== '') {
                    $urls[] = $image;
                }
            }
        }

        if ($pageUrl && Str::startsWith($pageUrl, ['http://', 'https://'])) {
            $scraped = match ($brandSlug) {
                'dr-reckeweg' => $this->scrapeReckewegImages($pageUrl),
                'schwabe' => $this->scrapeSchwabeImages($pageUrl),
                default => [],
            };
            foreach ($scraped as $image) {
                $urls[] = $image;
            }
        }

        $normalized = [];
        foreach ($urls as $url) {
            $url = trim($url);
            if (! Str::startsWith($url, ['http://', 'https://'])) {
                continue;
            }
            if (str_contains($url, '/storage/products/thumb/')) {
                continue;
            }
            if (! in_array($url, $normalized, true)) {
                $normalized[] = $url;
            }
        }

        return $normalized;
    }

    /** @return list<string> */
    private function scrapeReckewegImages(string $url): array
    {
        try {
            $response = Http::timeout(25)
                ->withHeaders(['User-Agent' => 'HomeopathyPharmaCatalog/1.0'])
                ->get($url);
        } catch (\Throwable) {
            return [];
        }
        if (! $response->successful()) {
            return [];
        }

        $html = $response->body();
        $urls = [];

        if (preg_match_all('/image_src(?:&quot;|"):(?:&quot;|")(https:[^\"&]+)(?:&quot;|")/', $html, $m)) {
            foreach ($m[1] as $src) {
                $src = html_entity_decode($src, ENT_QUOTES);
                if (! str_contains($src, '/thumb/')) {
                    $urls[] = $src;
                }
            }
        }

        if ($urls === [] && preg_match_all('#https://www\.reckeweg-india\.com/storage/products/(?!thumb/)[^\"\'&\s]+#', $html, $m)) {
            $urls = $m[0];
        }

        return array_values(array_unique($urls));
    }

    /** @return list<string> */
    private function scrapeSchwabeImages(string $url): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders(['User-Agent' => 'HomeopathyPharmaCatalog/1.0'])
                ->get($url);
        } catch (\Throwable) {
            return [];
        }
        if (! $response->successful()) {
            return [];
        }

        $html = $response->body();
        if (! preg_match('#product-images/([^/\"\'\\\\]+)/#', $html, $folderMatch)) {
            return [];
        }
        $folder = $folderMatch[1];
        if (! preg_match_all('#https://assets\.schwabeindia\.net/[^\"\'\\\\]+product-images/'.preg_quote($folder, '#').'/[^\"\'\\\\]+#', $html, $m)) {
            return [];
        }

        $urls = [];
        foreach ($m[0] as $candidate) {
            $candidate = rtrim($candidate, '\\');
            $candidate = strtok($candidate, '?') ?: $candidate;
            if (preg_match('/\.(?:jpg|jpeg|png|webp)$/i', $candidate)) {
                $urls[] = $candidate;
            }
        }

        return array_values(array_unique($urls));
    }

    /**
     * @param  list<string>  $urls
     */
    private function attachUrls(Product $product, array $urls, MediaUploader $uploader, bool $keepExisting): int
    {
        $existingMediaIds = $keepExisting
            ? $product->images()->pluck('media_asset_id')->map(fn ($id) => (int) $id)->all()
            : [];

        $sort = $keepExisting ? (int) ($product->images()->max('sort_order') ?? -1) + 1 : 0;
        if (! $keepExisting) {
            $product->images()->delete();
            $sort = 0;
        }

        $added = 0;
        $hadNone = $product->images()->count() === 0;

        foreach ($urls as $url) {
            $media = $this->mediaFromUrl($url, $product->name, $uploader);
            if (! $media) {
                continue;
            }
            if (in_array($media->id, $existingMediaIds, true)) {
                continue;
            }

            ProductImage::query()->create([
                'product_id' => $product->id,
                'media_asset_id' => $media->id,
                'sort_order' => $sort,
                'is_primary' => $hadNone && $added === 0,
            ]);
            $existingMediaIds[] = $media->id;
            $sort++;
            $added++;
        }

        if ($product->images()->where('is_primary', true)->doesntExist()) {
            $first = $product->images()->orderBy('sort_order')->first();
            $first?->forceFill(['is_primary' => true])->save();
        }

        return $added;
    }

    /** @return list<string> */
    private function urlsForProductSlug(string $productSlug, string $catalogDir): array
    {
        foreach (['sbl' => 'sbl-catalog.json', 'dr-reckeweg' => 'reckeweg-catalog.json', 'schwabe' => 'schwabe-catalog.json'] as $brandSlug => $file) {
            $path = rtrim($catalogDir, '/').'/'.$file;
            if (! is_file($path)) {
                continue;
            }
            $rows = json_decode((string) file_get_contents($path), true);
            if (! is_array($rows)) {
                continue;
            }
            foreach ($rows as $row) {
                if (! is_array($row)) {
                    continue;
                }
                $sourceSlug = (string) ($row['source_slug'] ?? '');
                $slug = Str::limit(Str::slug($brandSlug.'-'.$sourceSlug), 180, '');
                if ($slug === $productSlug) {
                    return $this->collectImageUrls($row, null, $brandSlug);
                }
            }
        }

        return [];
    }

    private function mediaFromUrl(string $url, string $altText, MediaUploader $uploader): ?MediaAsset
    {
        $hash = sha1($url);
        if (isset($this->mediaByHash[$hash])) {
            return MediaAsset::query()->find($this->mediaByHash[$hash]);
        }

        $existing = MediaAsset::query()
            ->where('original_name', 'import:'.$hash)
            ->first();
        if ($existing) {
            $this->mediaByHash[$hash] = $existing->id;

            return $existing;
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders(['User-Agent' => 'HomeopathyPharmaCatalog/1.0'])
                ->get($url);
        } catch (\Throwable) {
            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $bytes = $response->body();
        if ($bytes === '' || strlen($bytes) > 5_242_880) {
            return null;
        }

        $mime = (string) ($response->header('Content-Type') ?: '');
        $mime = strtolower(trim(explode(';', $mime)[0]));
        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => null,
        };

        if ($ext === null) {
            $pathExt = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION));
            $ext = in_array($pathExt, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)
                ? ($pathExt === 'jpeg' ? 'jpg' : $pathExt)
                : null;
            $mime = match ($ext) {
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                default => null,
            };
        }

        if ($ext === null || $mime === null) {
            return null;
        }

        $filename = $hash.'.'.$ext;
        $path = 'media/imports/'.substr($hash, 0, 2).'/'.$filename;
        Storage::disk('public')->put($path, $bytes);

        $width = null;
        $height = null;
        $full = Storage::disk('public')->path($path);
        $size = @getimagesize($full);
        if (is_array($size)) {
            $width = $size[0] ?? null;
            $height = $size[1] ?? null;
        }

        $uploader->publishToWebRoots($path);

        $asset = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => $path,
            'filename' => $filename,
            'original_name' => 'import:'.$hash,
            'mime_type' => $mime,
            'size_bytes' => strlen($bytes),
            'width' => $width,
            'height' => $height,
            'alt_text' => $altText,
        ]);

        $this->mediaByHash[$hash] = $asset->id;

        return $asset;
    }
}
