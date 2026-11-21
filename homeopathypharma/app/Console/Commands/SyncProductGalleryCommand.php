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
        {--brand= : Limit to one brand slug (sbl, dr-reckeweg, schwabe, bakson, bjain, wheezal)}
        {--limit=0 : Limit products processed (0 = all)}
        {--skip-scrape : Only use catalogue JSON images; do not scrape product pages}
        {--missing-only : Only attach images to products that currently have none}
        {--homepage-only : Only backfill Popular / Super Saving products that are missing images}
        {--backfill-all-missing : After sync, attach overrides/donors for any published product still missing images}
        {--repair-broken-files : Re-download catalogue images when media rows exist but files are missing on disk}
        {--path= : Catalogue directory (defaults to storage/app/imports)}';

    protected $description = 'Attach catalogue/source gallery images to products and backfill Popular/Super Saving images';

    /** @var array<string, int> */
    private array $mediaByHash = [];

    /** @var array<string, list<string>>|null */
    private ?array $imageOverrides = null;

    public function handle(MediaUploader $uploader): int
    {
        $catalogDir = (string) $this->option('path');
        if ($catalogDir === '') {
            $catalogDir = storage_path('app/imports');
        }

        if ($this->option('homepage-only')) {
            return $this->backfillHomepageImages($uploader, $catalogDir);
        }

        if ($this->option('backfill-all-missing') && ! $this->option('brand') && ! $this->option('missing-only') && ! $this->option('repair-broken-files')) {
            // Allow running overrides/donor pass alone.
            $this->applyImageOverrides($uploader, $catalogDir);
            $this->backfillMissingImages($uploader, $catalogDir, homepageOnly: false);

            return self::SUCCESS;
        }

        $only = (string) $this->option('brand');
        $limit = (int) $this->option('limit');
        $skipScrape = (bool) $this->option('skip-scrape');
        $missingOnly = (bool) $this->option('missing-only');
        $repairBroken = (bool) $this->option('repair-broken-files');
        $files = [
            'sbl' => 'sbl-catalog.json',
            'dr-reckeweg' => 'reckeweg-catalog.json',
            'schwabe' => 'schwabe-catalog.json',
            'bakson' => 'bakson-catalog.json',
            'bjain' => 'bjain-catalog.json',
            'wheezal' => 'wheezal-catalog.json',
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

                $productSlug = $this->productSlugForCatalog($brandSlug, $sourceSlug);
                $product = Product::query()->where('slug', $productSlug)->first();
                if (! $product) {
                    $bar->advance();

                    continue;
                }

                if ($missingOnly && $product->images()->exists() && ! $repairBroken) {
                    $bar->advance();

                    continue;
                }

                if ($repairBroken && $product->images()->exists() && $this->productHasUsableImage($product)) {
                    $bar->advance();

                    continue;
                }

                if ($repairBroken && $product->images()->exists() && ! $this->productHasUsableImage($product)) {
                    // Drop broken links so attachUrls can recreate them against restored files.
                    $product->images()->delete();
                }

                $pageUrl = $skipScrape ? null : (string) ($row['url'] ?? '');
                $urls = $this->collectImageUrls($row, $pageUrl !== '' ? $pageUrl : null, $brandSlug);
                $overrideUrls = $this->overrideUrlsForSlug($product->slug, $catalogDir);
                if ($overrideUrls !== []) {
                    $urls = array_values(array_unique([...$overrideUrls, ...$urls]));
                }
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
        $this->applyImageOverrides($uploader, $catalogDir);
        $this->backfillHomepageImages($uploader, $catalogDir);

        if ($this->option('backfill-all-missing') || $missingOnly || $repairBroken) {
            $this->backfillMissingImages($uploader, $catalogDir, homepageOnly: false);
        }

        return self::SUCCESS;
    }

    private function backfillHomepageImages(MediaUploader $uploader, string $catalogDir): int
    {
        return $this->backfillMissingImages($uploader, $catalogDir, homepageOnly: true);
    }

    private function backfillMissingImages(MediaUploader $uploader, string $catalogDir, bool $homepageOnly): int
    {
        $query = Product::query()
            ->published()
            ->with(['images', 'brand']);

        if ($homepageOnly) {
            $query->where(function ($q) {
                $q->where('is_featured', true)->orWhere('is_super_saving', true);
            });
        }

        $targets = $query->get()
            ->filter(fn (Product $p) => ! $this->productHasUsableImage($p))
            ->values();

        $label = $homepageOnly ? 'homepage' : 'all';
        $this->info("Backfilling {$label} products missing images: ".$targets->count());

        $matched = 0;
        foreach ($targets as $product) {
            $overrideUrls = $this->overrideUrlsForSlug($product->slug, $catalogDir);
            if ($overrideUrls !== []) {
                $added = $this->attachUrls($product, $overrideUrls, $uploader, keepExisting: true);
                if ($added > 0 || $product->images()->exists()) {
                    $matched++;
                    $this->line('  override '.$product->slug.' (+'.$added.')');

                    continue;
                }
            }

            // Prefer attaching directly from this product's catalogue row.
            $directUrls = $this->urlsForProductSlug($product->slug, $catalogDir);
            if ($directUrls !== []) {
                $added = $this->attachUrls($product, $directUrls, $uploader, keepExisting: true);
                if ($added > 0 || $product->images()->exists()) {
                    $matched++;
                    $this->line('  catalog '.$product->slug.' (+'.$added.')');

                    continue;
                }
            }

            $donor = $this->findCatalogDonor($product);
            if (! $donor) {
                $this->line('  no match for '.$product->slug);

                continue;
            }

            $donor->loadMissing('images.media');
            if (! $this->productHasUsableImage($donor)) {
                $urls = $this->urlsForProductSlug($donor->slug, $catalogDir);
                if ($urls !== []) {
                    $this->attachUrls($donor, $urls, $uploader, keepExisting: true);
                    $donor->load('images.media');
                }
            }

            if (! $this->productHasUsableImage($donor)) {
                $this->line('  no usable donor for '.$product->slug);

                continue;
            }

            $product->images()->delete();
            $sort = 0;
            foreach ($donor->images as $image) {
                if (! $image->media_asset_id || ! $image->media) {
                    continue;
                }
                if (! $this->mediaFileIsUsable((string) $image->media->path)) {
                    continue;
                }
                ProductImage::query()->create([
                    'product_id' => $product->id,
                    'media_asset_id' => $image->media_asset_id,
                    'sort_order' => $sort,
                    'is_primary' => $sort === 0,
                ]);
                $sort++;
            }

            if ($this->productHasUsableImage($product->fresh(['images.media']))) {
                $matched++;
                $this->line('  linked '.$product->slug.' ← '.$donor->slug);
            }
        }

        $this->info("{$label}_image_matches={$matched}");

        return self::SUCCESS;
    }

    private function applyImageOverrides(MediaUploader $uploader, string $catalogDir): void
    {
        $overrides = $this->loadImageOverrides($catalogDir);
        if ($overrides === []) {
            return;
        }

        $this->info('Applying image overrides: '.count($overrides));
        foreach ($overrides as $slug => $urls) {
            $product = Product::query()->where('slug', $slug)->first();
            if (! $product) {
                continue;
            }
            if ($this->productHasUsableImage($product)) {
                continue;
            }
            if ($product->images()->exists()) {
                $product->images()->delete();
            }
            $added = $this->attachUrls($product, $urls, $uploader, keepExisting: true);
            if ($added > 0) {
                $this->line("  override {$slug} (+{$added})");
            }
        }
    }

    /**
     * @return array<string, list<string>>
     */
    private function loadImageOverrides(string $catalogDir): array
    {
        if ($this->imageOverrides !== null) {
            return $this->imageOverrides;
        }

        $path = rtrim($catalogDir, '/').'/image-overrides.json';
        if (! is_file($path)) {
            $this->imageOverrides = [];

            return $this->imageOverrides;
        }

        $rows = json_decode((string) file_get_contents($path), true);
        if (! is_array($rows)) {
            $this->imageOverrides = [];

            return $this->imageOverrides;
        }

        $map = [];
        foreach ($rows as $slug => $urls) {
            $slug = trim((string) $slug);
            if ($slug === '') {
                continue;
            }
            $list = [];
            foreach ((array) $urls as $url) {
                $url = trim((string) $url);
                if (Str::startsWith($url, ['http://', 'https://'])) {
                    $list[] = $url;
                }
            }
            if ($list !== []) {
                $map[$slug] = array_values(array_unique($list));
            }
        }

        $this->imageOverrides = $map;

        return $this->imageOverrides;
    }

    /**
     * @return list<string>
     */
    private function overrideUrlsForSlug(string $productSlug, string $catalogDir): array
    {
        return $this->loadImageOverrides($catalogDir)[$productSlug] ?? [];
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
            ->with('images.media')
            ->get()
            ->filter(fn (Product $candidate) => $this->productHasUsableImage($candidate));

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
        $name = preg_replace('/\b(dr\.?\s*)?(reckeweg|sbl|schwabe|bakson|bjain|wheezal|test)\b/u', '', $name) ?? $name;
        $name = preg_replace('/\b(\d+\s?[xXcC]|cm|lm|ch|mt|q|mother\s*tincture)\b/u', '', $name) ?? $name;
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

        $baseA = $this->slugBaseName($slugA);
        $baseB = $this->slugBaseName($slugB);
        if ($baseA !== '' && $baseA === $baseB) {
            $score += 25;
        }

        $tail = Str::after($slugA, '-');
        if ($tail !== '' && Str::contains($slugB, $tail)) {
            $score += 10;
        }

        return min(100, $score);
    }

    private function slugBaseName(string $slug): string
    {
        $slug = Str::lower($slug);
        $slug = preg_replace('/^(sbl|dr-reckeweg|schwabe|bakson|bjain|wheezal)-/', '', $slug) ?? $slug;
        $slug = preg_replace('/-(?:\d+x|\d+c|cm|lm|ch|mt|q|\d+m|\d+)$/', '', $slug) ?? $slug;

        return trim($slug, '-');
    }

    private function bmpToJpeg(string $bytes): ?string
    {
        if (! function_exists('imagecreatefromstring') || ! function_exists('imagejpeg')) {
            return null;
        }

        $image = @imagecreatefromstring($bytes);
        if ($image === false && function_exists('imagecreatefrombmp')) {
            $tmp = tempnam(sys_get_temp_dir(), 'hpbmp');
            if ($tmp === false) {
                return null;
            }
            file_put_contents($tmp, $bytes);
            $image = @imagecreatefrombmp($tmp);
            @unlink($tmp);
        }
        if ($image === false) {
            return null;
        }

        ob_start();
        $ok = imagejpeg($image, null, 90);
        imagedestroy($image);
        $jpeg = ob_get_clean();

        return ($ok && is_string($jpeg) && $jpeg !== '') ? $jpeg : null;
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
        foreach ([
            'sbl' => 'sbl-catalog.json',
            'dr-reckeweg' => 'reckeweg-catalog.json',
            'schwabe' => 'schwabe-catalog.json',
            'bakson' => 'bakson-catalog.json',
            'bjain' => 'bjain-catalog.json',
            'wheezal' => 'wheezal-catalog.json',
        ] as $brandSlug => $file) {
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
                $slug = $this->productSlugForCatalog($brandSlug, $sourceSlug);
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
        if ($existing && $this->mediaFileIsUsable($existing->path)) {
            $this->mediaByHash[$hash] = $existing->id;

            return $existing;
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders(['User-Agent' => 'HomeopathyPharmaCatalog/1.0'])
                ->get($url);
        } catch (\Throwable) {
            return $existing;
        }

        if (! $response->successful()) {
            return $existing;
        }

        $bytes = $response->body();
        if ($bytes === '' || strlen($bytes) > 5_242_880) {
            return $existing;
        }

        $mime = (string) ($response->header('Content-Type') ?: '');
        $mime = strtolower(trim(explode(';', $mime)[0]));
        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/bmp', 'image/x-ms-bmp', 'image/x-bmp' => 'bmp',
            default => null,
        };

        if ($ext === null) {
            $pathExt = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION));
            $ext = in_array($pathExt, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'], true)
                ? ($pathExt === 'jpeg' ? 'jpg' : $pathExt)
                : null;
            $mime = match ($ext) {
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                'bmp' => 'image/bmp',
                default => null,
            };
        }

        if ($ext === null || $mime === null) {
            return null;
        }

        // Store BMP sources as JPEG so the storefront can display them everywhere.
        if ($ext === 'bmp') {
            $converted = $this->bmpToJpeg($bytes);
            if ($converted === null) {
                return null;
            }
            $bytes = $converted;
            $ext = 'jpg';
            $mime = 'image/jpeg';
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

        if ($existing) {
            $existing->forceFill([
                'disk' => 'public',
                'path' => $path,
                'filename' => $filename,
                'mime_type' => $mime,
                'size_bytes' => strlen($bytes),
                'width' => $width,
                'height' => $height,
                'alt_text' => $altText !== '' ? $altText : $existing->alt_text,
            ])->save();
            $this->mediaByHash[$hash] = $existing->id;

            return $existing;
        }

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

    private function productHasUsableImage(Product $product): bool
    {
        $product->loadMissing('images.media');
        foreach ($product->images as $image) {
            $path = $image->media?->path;
            if (is_string($path) && $path !== '' && $this->mediaFileIsUsable($path)) {
                return true;
            }
        }

        return false;
    }

    private function mediaFileIsUsable(string $path): bool
    {
        if ($path === '' || ! Storage::disk('public')->exists($path)) {
            return false;
        }

        try {
            return (int) Storage::disk('public')->size($path) > 50;
        } catch (\Throwable) {
            return false;
        }
    }
    /**
     * Match ImportBrandCatalogCommand slug rules so catalogue rows resolve
     * even when the source handle already includes the brand prefix.
     */
    private function productSlugForCatalog(string $brandSlug, string $sourceSlug): string
    {
        $normalized = Str::slug($sourceSlug);
        $prefix = Str::slug($brandSlug).'-';
        if ($normalized !== '' && str_starts_with($normalized, $prefix)) {
            $normalized = substr($normalized, strlen($prefix));
        }

        $base = Str::slug($brandSlug.($normalized !== '' ? '-'.$normalized : ''));
        if ($base === '') {
            $base = $brandSlug.'-item';
        }

        return Str::limit($base, 180, '');
    }
}
