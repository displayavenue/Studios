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

    public function test_image_overrides_attach_to_products_missing_images(): void
    {
        Storage::fake('public');

        $brand = Brand::query()->create([
            'name' => 'Bjain',
            'slug' => 'bjain',
            'status' => 'published',
            'sort_order' => 5,
        ]);

        $product = Product::query()->create([
            'name' => 'Omeo Aloe Vera Gel',
            'slug' => 'bjain-omeo-aloe-vera-gel',
            'sku' => 'BJAIN-OMEO-ALOE',
            'brand_id' => $brand->id,
            'price_paise' => 17100,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $dir = storage_path('framework/testing/gallery-override-fixtures');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // 1x1 jpeg
        $jpeg = base64_decode('/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBAVFRUVFRUVFRUVFRUWFxUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBgAEBQIBB//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z');
        $imgPath = $dir.'/override.jpg';
        file_put_contents($imgPath, $jpeg !== false ? $jpeg : '');

        file_put_contents($dir.'/bjain-catalog.json', json_encode([
            [
                'name' => 'Omeo Aloe Vera Gel',
                'source_slug' => 'omeo-aloe-vera-gel',
                'image' => null,
                'images' => [],
            ],
        ]));
        file_put_contents($dir.'/image-overrides.json', json_encode([
            'bjain-omeo-aloe-vera-gel' => ['file://'.$imgPath],
        ]));

        // file:// is rejected by attachUrls; use a public http mock via Http::fake instead.
        \Illuminate\Support\Facades\Http::fake([
            'https://cdn.example.test/aloe.jpg' => \Illuminate\Support\Facades\Http::response($jpeg, 200, [
                'Content-Type' => 'image/jpeg',
            ]),
        ]);
        file_put_contents($dir.'/image-overrides.json', json_encode([
            'bjain-omeo-aloe-vera-gel' => ['https://cdn.example.test/aloe.jpg'],
        ]));

        $this->artisan('catalogue:sync-product-galleries', [
            '--backfill-all-missing' => true,
            '--path' => $dir,
        ])->assertSuccessful();

        $this->assertTrue($product->fresh()->images()->exists());
    }
}
