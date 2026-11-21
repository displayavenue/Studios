<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\MediaUploader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportBrandCatalogCommand extends Command
{
    protected $signature = 'catalogue:import-brands
        {--brand= : Only import one brand slug (sbl, dr-reckeweg, schwabe, bakson, bjain, wheezal)}
        {--limit=0 : Limit products per brand (0 = all)}
        {--skip-images : Create products without downloading images}
        {--path= : Catalogue directory (defaults to storage/app/imports)}';

    protected $description = 'Import SBL, Reckeweg, Schwabe, Bakson, Bjain, and Wheezal product catalogues with images';

    /** @var array<string, int> */
    private array $mediaByHash = [];

    /** @var array<string, true> */
    private array $usedSkus = [];

    public function handle(MediaUploader $uploader): int
    {
        $only = (string) $this->option('brand');
        $limit = (int) $this->option('limit');
        $skipImages = (bool) $this->option('skip-images');
        $catalogDir = (string) $this->option('path');
        if ($catalogDir === '') {
            $catalogDir = storage_path('app/imports');
        }

        $catalogs = [
            'sbl' => [
                'name' => 'SBL',
                'description' => 'Trusted Indian homeopathic brand for everyday remedies.',
                'file' => 'sbl-catalog.json',
                'sort' => 1,
                'price_paise' => 14900,
                'manufacturer' => 'SBL Pvt. Ltd.',
            ],
            'dr-reckeweg' => [
                'name' => 'Dr. Reckeweg',
                'description' => 'German quality. Global trust.',
                'file' => 'reckeweg-catalog.json',
                'sort' => 2,
                'price_paise' => 29900,
                'manufacturer' => 'Dr. Reckeweg & Co. GmbH',
            ],
            'schwabe' => [
                'name' => 'Schwabe',
                'description' => 'Classic homeopathic formulations for family care.',
                'file' => 'schwabe-catalog.json',
                'sort' => 3,
                'price_paise' => 19900,
                'manufacturer' => 'Schwabe India',
            ],
            'bakson' => [
                'name' => 'Bakson',
                'description' => 'Bakson’s homeopathic specialities, dilutions, and personal care.',
                'file' => 'bakson-catalog.json',
                'sort' => 4,
                'price_paise' => 17900,
                'manufacturer' => 'Bakson Drugs & Pharmaceuticals Pvt. Ltd.',
            ],
            'bjain' => [
                'name' => 'Bjain',
                'description' => 'Bjain Pharma dilutions, tonics, and classical remedies.',
                'file' => 'bjain-catalog.json',
                'sort' => 5,
                'price_paise' => 15900,
                'manufacturer' => 'B. Jain Pharmaceuticals Pvt. Ltd.',
            ],
            'wheezal' => [
                'name' => 'Wheezal',
                'description' => 'Wheezal specialities, dilutions, and wellness formulations.',
                'file' => 'wheezal-catalog.json',
                'sort' => 6,
                'price_paise' => 16900,
                'manufacturer' => 'Wheezal Labs',
            ],
        ];

        if ($only !== '') {
            if (! isset($catalogs[$only])) {
                $this->error('Unknown brand slug ['.$only.']. Use sbl, dr-reckeweg, schwabe, bakson, bjain, or wheezal.');

                return self::FAILURE;
            }
            $catalogs = [$only => $catalogs[$only]];
        }

        foreach ($catalogs as $brandSlug => $meta) {
            $path = rtrim($catalogDir, '/').'/'.$meta['file'];
            if (! is_file($path)) {
                $this->error("Missing catalogue file: {$path}");

                return self::FAILURE;
            }

            $rows = json_decode((string) file_get_contents($path), true);
            if (! is_array($rows)) {
                $this->error("Invalid JSON in {$path}");

                return self::FAILURE;
            }

            if ($limit > 0) {
                $rows = array_slice($rows, 0, $limit);
            }

            $brand = Brand::query()->updateOrCreate(
                ['slug' => $brandSlug],
                [
                    'name' => $meta['name'],
                    'description' => $meta['description'],
                    'status' => 'published',
                    'sort_order' => $meta['sort'],
                ]
            );

            $this->info("Importing {$meta['name']} (".count($rows).' products)…');
            $bar = $this->output->createProgressBar(count($rows));
            $bar->start();

            $created = 0;
            $updated = 0;
            $images = 0;

            foreach ($rows as $row) {
                $sourceSlug = (string) ($row['source_slug'] ?? $row['slug'] ?? '');
                $name = trim((string) ($row['name'] ?? ''));
                if ($sourceSlug === '' || $name === '') {
                    $bar->advance();

                    continue;
                }

                $normalizedSource = $this->normalizedSourceSlug($brandSlug, $sourceSlug);
                $productSlug = $this->uniqueProductSlug($brandSlug, $sourceSlug);
                $product = Product::query()->firstOrNew(['slug' => $productSlug]);
                $isNew = ! $product->exists;
                $sku = $this->uniqueSku(
                    $brandSlug,
                    $normalizedSource !== '' ? $normalizedSource : $sourceSlug,
                    $row['source_id'] ?? null,
                    $product->exists ? (string) $product->sku : null,
                    $productSlug
                );

                $catalogPrice = $this->positiveInt($row['price_paise'] ?? null) ?? $this->positiveInt($row['mrp_paise'] ?? null);
                $catalogSale = $this->positiveInt($row['sale_price_paise'] ?? null);
                if ($catalogSale !== null && $catalogPrice !== null && $catalogSale >= $catalogPrice) {
                    $catalogSale = null;
                }
                $packageSize = trim((string) ($row['package_size'] ?? ''));
                $description = trim((string) ($row['description'] ?? ''));
                $shortDescription = trim((string) ($row['short_description'] ?? ''));

                $product->fill([
                    'name' => $name,
                    'sku' => $sku,
                    'brand_id' => $brand->id,
                    'short_description' => $product->short_description
                        ?: ($shortDescription !== '' ? Str::limit($shortDescription, 220, '…') : ($meta['name'].' — '.$name)),
                    'description' => $product->description
                        ?: ($description !== '' ? $description : ($meta['name'].' product: '.$name.'.')),
                    'directions' => $product->directions ?: 'As prescribed by the doctor.',
                    'package_size' => $packageSize !== '' ? $packageSize : $product->package_size,
                    'price_paise' => $product->price_paise ?: ($catalogPrice ?: $meta['price_paise']),
                    'stock_qty' => $product->stock_qty ?: 50,
                    'stock_status' => 'in_stock',
                    'manufacturer' => $meta['manufacturer'],
                    'status' => 'published',
                    'seo_title' => $name.' | '.$meta['name'].' | HOMEOPATHY PHARMA',
                    'seo_description' => 'Buy '.$name.' from '.$meta['name'].' at HOMEOPATHY PHARMA.',
                    'published_at' => $product->published_at ?: now(),
                ]);
                if ($isNew) {
                    $product->is_featured = false;
                    $product->is_super_saving = false;
                    $product->sale_price_paise = $catalogSale;
                } elseif ($product->sale_price_paise === null && $catalogSale !== null) {
                    $product->sale_price_paise = $catalogSale;
                }
                if ($packageSize !== '' && blank($product->package_size)) {
                    $product->package_size = $packageSize;
                }
                $product->save();

                $isNew ? $created++ : $updated++;

                if (! $skipImages) {
                    $imageUrls = [];
                    $primary = trim((string) ($row['image'] ?? ''));
                    if ($primary !== '') {
                        $imageUrls[] = $primary;
                    }
                    if (! empty($row['images']) && is_array($row['images'])) {
                        foreach ($row['images'] as $extra) {
                            $extra = trim((string) $extra);
                            if ($extra !== '') {
                                $imageUrls[] = $extra;
                            }
                        }
                    }
                    $imageUrls = array_values(array_unique($imageUrls));

                    foreach ($imageUrls as $index => $imageUrl) {
                        if (! Str::startsWith($imageUrl, ['http://', 'https://'])) {
                            continue;
                        }
                        $media = $this->mediaFromUrl($imageUrl, $name, $uploader);
                        if (! $media) {
                            continue;
                        }
                        ProductImage::query()->updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'media_asset_id' => $media->id,
                            ],
                            [
                                'sort_order' => $index,
                                'is_primary' => $index === 0,
                            ]
                        );
                        $images++;
                    }
                }

                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->line("  created={$created} updated={$updated} image_links={$images}");
        }

        $this->info('Done. Brands: '.Brand::query()->count().' Products: '.Product::query()->published()->count());

        return self::SUCCESS;
    }

    private function normalizedSourceSlug(string $brandSlug, string $sourceSlug): string
    {
        $normalized = Str::slug($sourceSlug);
        $prefix = Str::slug($brandSlug).'-';
        if ($normalized !== '' && str_starts_with($normalized, $prefix)) {
            $normalized = substr($normalized, strlen($prefix));
        }

        return $normalized;
    }

    private function uniqueProductSlug(string $brandSlug, string $sourceSlug): string
    {
        $normalized = $this->normalizedSourceSlug($brandSlug, $sourceSlug);
        $base = Str::slug($brandSlug.($normalized !== '' ? '-'.$normalized : ''));
        if ($base === '') {
            $base = $brandSlug.'-'.Str::random(8);
        }

        return Str::limit($base, 180, '');
    }

    private function uniqueSku(
        string $brandSlug,
        string $sourceSlug,
        mixed $sourceId = null,
        ?string $existingSku = null,
        ?string $productSlug = null
    ): string {
        $prefix = Str::upper($brandSlug);
        $body = Str::upper(Str::slug($sourceSlug, '-'));
        if ($body === '') {
            $body = 'ITEM';
        }

        $candidate = $prefix.'-'.Str::limit($body, 40, '');
        if ($existingSku && $existingSku === $candidate) {
            $this->usedSkus[$candidate] = true;

            return $candidate;
        }

        if (! $this->skuTaken($candidate, $productSlug)) {
            $this->usedSkus[$candidate] = true;

            return $candidate;
        }

        $suffix = ($sourceId !== null && $sourceId !== '')
            ? preg_replace('/[^A-Za-z0-9]/', '', (string) $sourceId)
            : Str::upper(substr(sha1($brandSlug.'|'.$sourceSlug), 0, 8));
        $candidate = $prefix.'-'.Str::limit($body, 28, '').'-'.$suffix;
        $n = 1;
        while ($this->skuTaken($candidate, $productSlug)) {
            $candidate = $prefix.'-'.Str::limit($body, 24, '').'-'.$suffix.'-'.$n;
            $n++;
        }
        $this->usedSkus[$candidate] = true;

        return $candidate;
    }

    private function skuTaken(string $sku, ?string $productSlug = null): bool
    {
        if (isset($this->usedSkus[$sku])) {
            return true;
        }

        $query = Product::query()->where('sku', $sku);
        if ($productSlug) {
            $query->where('slug', '!=', $productSlug);
        }

        return $query->exists();
    }

    private function positiveInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (! is_numeric($value)) {
            return null;
        }
        $int = (int) round((float) $value);

        return $int > 0 ? $int : null;
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
