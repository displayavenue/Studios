<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BrandCatalogImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_import_command_creates_brand_products_from_fixture(): void
    {
        Storage::fake('public');

        $dir = storage_path('framework/testing/brand-catalog-fixtures');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($dir.'/sbl-catalog.json', json_encode([
            [
                'name' => 'Test Arnica 30C',
                'source_slug' => 'test-arnica-30c',
                'image' => null,
                'images' => [],
            ],
        ]));
        file_put_contents($dir.'/reckeweg-catalog.json', json_encode([]));
        file_put_contents($dir.'/schwabe-catalog.json', json_encode([]));

        $this->artisan('catalogue:import-brands', [
            '--brand' => 'sbl',
            '--skip-images' => true,
            '--path' => $dir,
        ])->assertSuccessful();

        $this->assertDatabaseHas('brands', [
            'slug' => 'sbl',
            'status' => 'published',
        ]);
        $this->assertDatabaseHas('products', [
            'slug' => 'sbl-test-arnica-30c',
            'name' => 'Test Arnica 30C',
            'status' => 'published',
        ]);
        $this->assertSame(1, Product::query()->where('brand_id', Brand::query()->where('slug', 'sbl')->value('id'))->count());
    }

    public function test_brands_index_lists_published_brands(): void
    {
        Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'description' => 'Test brand',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $this->get('/brands')
            ->assertOk()
            ->assertSee('Our Brands', false)
            ->assertSee('SBL', false);
    }
}
