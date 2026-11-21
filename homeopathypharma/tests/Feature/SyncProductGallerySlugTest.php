<?php

namespace Tests\Feature;

use App\Console\Commands\SyncProductGalleryCommand;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use ReflectionMethod;
use Tests\TestCase;

class SyncProductGallerySlugTest extends TestCase
{
    use RefreshDatabase;

    public function test_gallery_sync_resolves_source_slugs_that_already_include_brand_prefix(): void
    {
        Storage::fake('public');

        $brand = Brand::query()->create([
            'name' => 'Bakson',
            'slug' => 'bakson',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        Product::query()->create([
            'name' => 'Hair Reviver',
            'slug' => 'bakson-hair-reviver-hair-care-regrowth-treatment-100ml',
            'sku' => 'BAKSON-HAIR-1',
            'brand_id' => $brand->id,
            'price_paise' => 19900,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $dir = storage_path('framework/testing/gallery-slug-fixtures');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($dir.'/bakson-catalog.json', json_encode([
            [
                'name' => 'Hair Reviver',
                'source_slug' => 'bakson-hair-reviver-hair-care-regrowth-treatment-100ml',
                'image' => null,
                'images' => [],
            ],
        ]));

        $command = app(SyncProductGalleryCommand::class);
        $method = new ReflectionMethod($command, 'productSlugForCatalog');
        $method->setAccessible(true);

        $this->assertSame(
            'bakson-hair-reviver-hair-care-regrowth-treatment-100ml',
            $method->invoke($command, 'bakson', 'bakson-hair-reviver-hair-care-regrowth-treatment-100ml')
        );

        $this->artisan('catalogue:sync-product-galleries', [
            '--brand' => 'bakson',
            '--skip-scrape' => true,
            '--missing-only' => true,
            '--path' => $dir,
        ])->assertSuccessful();
    }
}
