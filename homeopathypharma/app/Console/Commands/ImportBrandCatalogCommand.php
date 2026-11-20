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
        {--brand= : Only import one brand slug (sbl, dr-reckeweg, schwabe)}
        {--limit=0 : Limit products per brand (0 = all)}
        {--skip-images : Create products without downloading images}';

    protected $description = 'Import SBL, Dr. Reckeweg, and Schwabe product catalogues with images';

    /** @var array<string, int> */
    private array $mediaByHash = [];

    public function handle(MediaUploader $uploader): int
    {
        $only = (string) $this->option('brand');
        $limit = (int) $this->option('limit');
        $skipImages = (bool) $this->option('skip-images');

        $catalogs = [
            'sbl' => [
                'name' => 'SBL',
                'description' => 'Trusted Indian homeopathic brand for everyday remedies.',
                'file' => 'imports/sbl-catalog.json',
                'sort' => 1,
                'price_paise' => 14900,
                'manufacturer' => 'SBL Pvt. Ltd.',
            ],
            'dr-reckeweg' => [
                'name' => 'Dr. Reckeweg',
                'description' => 'German quality. Global trust.',
                'file' => 'imports/reckeweg-catalog.json',
                'sort' => 2,
                'price_paise' => 29900,
                'manufacturer' => 'Dr. Reckeweg & Co. GmbH',
            ],
            'schwabe' => [
                'name' => 'Schwabe',
                'description' => 'Classic homeopathic formulations for family care.',
                'file' => 'imports/schwabe-catalog.json',
                'sort' => 3,
                'price_paise' => 19900,
                'manufacturer' => 'Schwabe India',
            ],
        ];

        if ($only !== '') {
            if (! isset($catalogs[$only])) {
                $this->error("Unknown brand slug [{$only}]. Use sbl, dr-reckeweg, or schwabe.");

                return self::FAILURE;
            }
            $catalogs = [$only => $catalogs[$only]];
        }

        foreach ($catalogs as $brandSlug => $meta) {
            $path = storage_path('app/'.$meta['file']);
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

                $productSlug = $this->uniqueProductSlug($brandSlug, $sourceSlug);
                $sku = strtoupper($brandSlug).'-'.Str::upper(Str::limit($sourceSlug, 40, ''));

                $product = Product::query()->updateOrCreate(
                    ['slug' => $productSlug],
                    [
                        'name' => $name,
                        'sku' => $sku,
                        'brand_id' => $brand->id,
                        'short_description' => $meta['name'].' — '.$name,
                        'description' => $meta['name'].' product: '.$name.'.',
                        'price_paise' => $meta['price_paise'],
                        'sale_price_paise' => null,
                        'stock_qty' => 50,
                        'stock_status' => 'in_stock',
                        'manufacturer' => $meta['manufacturer'],
                        'status' => 'published',
                        'is_featured' => false,
                        'seo_title' => $name.' | '.$meta['name'].' | HOMEOPATHY PHARMA',
                        'seo_description' => 'Buy '.$name.' from '.$meta['name'].' at HOMEOPATHY PHARMA.',
                        'published_at' => now(),
                    ]
                );

                $product->wasRecentlyCreated ? $created++ : $updated++;

                $imageUrl = trim((string) ($row['image'] ?? ''));
                if (! $skipImages && $imageUrl !== '' && Str::startsWith($imageUrl, ['http://', 'https://'])) {
                    $media = $this->mediaFromUrl($imageUrl, $name, $uploader);
                    if ($media) {
                        ProductImage::query()->updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'media_asset_id' => $media->id,
                            ],
                            [
                                'sort_order' => 0,
                                'is_primary' => true,
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

    private function uniqueProductSlug(string $brandSlug, string $sourceSlug): string
    {
        $base = Str::slug($brandSlug.'-'.$sourceSlug);
        if ($base === '') {
            $base = $brandSlug.'-'.Str::random(8);
        }

        return Str::limit($base, 180, '');
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
