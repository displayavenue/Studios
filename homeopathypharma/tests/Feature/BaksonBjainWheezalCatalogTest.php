<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BaksonBjainWheezalCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_import_supports_bakson_bjain_and_wheezal_catalogs(): void
    {
        Storage::fake('public');

        $dir = storage_path('framework/testing/new-brand-catalog-fixtures');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($dir.'/bakson-catalog.json', json_encode([
            [
                'name' => 'Bakson Arnica Hair Oil 100 ml',
                'source_slug' => 'arnica-hair-oil-100-ml',
                'package_size' => '100 ml',
                'price_paise' => 24900,
                'image' => null,
                'images' => [],
            ],
        ]));
        file_put_contents($dir.'/bjain-catalog.json', json_encode([
            [
                'name' => 'Bjain Alfalfa Tonic',
                'source_slug' => 'bjain-alfalfa-tonic',
                'package_size' => '100 ml · Pack of 1',
                'price_paise' => 19900,
                'sale_price_paise' => 16900,
                'image' => null,
                'images' => [],
            ],
        ]));
        file_put_contents($dir.'/wheezal-catalog.json', json_encode([
            [
                'name' => 'Wheezal WL-12 Enuresis Drops',
                'source_slug' => '29191643-wheezal-wl-12-enuresis-drops-30ml',
                'package_size' => '30ML',
                'price_paise' => 14500,
                'image' => null,
                'images' => [],
            ],
        ]));

        foreach (['bakson', 'bjain', 'wheezal'] as $brand) {
            $this->artisan('catalogue:import-brands', [
                '--brand' => $brand,
                '--skip-images' => true,
                '--path' => $dir,
            ])->assertSuccessful();
        }

        $this->assertDatabaseHas('brands', ['slug' => 'bakson', 'status' => 'published']);
        $this->assertDatabaseHas('brands', ['slug' => 'bjain', 'status' => 'published']);
        $this->assertDatabaseHas('brands', ['slug' => 'wheezal', 'status' => 'published']);

        $bakson = Product::query()->where('slug', 'bakson-arnica-hair-oil-100-ml')->first();
        $this->assertNotNull($bakson);
        $this->assertSame('100 ml', $bakson->package_size);
        $this->assertSame(24900, (int) $bakson->price_paise);
        $this->assertSame('100 ml · Pack of 1', $bakson->packagingLabel());

        $bjain = Product::query()->where('slug', 'bjain-alfalfa-tonic')->first();
        $this->assertNotNull($bjain);
        $this->assertSame(16900, (int) $bjain->sale_price_paise);

        $wheezal = Product::query()->where('slug', 'wheezal-29191643-wheezal-wl-12-enuresis-drops-30ml')->first();
        $this->assertNotNull($wheezal);
        $this->assertSame('30ML', $wheezal->package_size);
    }

    public function test_mark_brand_highlights_sets_popular_and_super_saving(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Bakson',
            'slug' => 'bakson',
            'description' => 'Test',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        foreach (range(1, 8) as $i) {
            Product::query()->create([
                'name' => "Bakson Speciality Syrup {$i}",
                'slug' => "bakson-speciality-syrup-{$i}",
                'sku' => "BAKSON-SYRUP-{$i}",
                'brand_id' => $brand->id,
                'short_description' => 'Test',
                'description' => 'Test',
                'price_paise' => 20000 + ($i * 100),
                'sale_price_paise' => $i <= 3 ? 15000 : null,
                'stock_qty' => 20,
                'stock_status' => 'in_stock',
                'package_size' => '100 ml',
                'status' => 'published',
                'is_featured' => false,
                'is_super_saving' => false,
                'published_at' => now(),
            ]);
        }

        $this->artisan('catalogue:mark-brand-highlights', [
            '--brand' => 'bakson',
            '--popular' => 3,
            '--deals' => 3,
        ])->assertSuccessful();

        $this->assertSame(3, Product::query()->where('brand_id', $brand->id)->where('is_featured', true)->count());
        $this->assertSame(3, Product::query()->where('brand_id', $brand->id)->where('is_super_saving', true)->count());
    }

    public function test_admin_can_toggle_new_brand_popular_and_super_saving(): void
    {
        $admin = \App\Models\User::factory()->create([
            'is_admin' => true,
            'email' => 'admin-new-brands@example.com',
        ]);

        $brand = Brand::query()->create([
            'name' => 'Wheezal',
            'slug' => 'wheezal',
            'status' => 'published',
            'sort_order' => 6,
        ]);

        $product = Product::query()->create([
            'name' => 'Wheezal Test Drops',
            'slug' => 'wheezal-test-drops',
            'sku' => 'WHEEZAL-TEST',
            'brand_id' => $brand->id,
            'short_description' => 'Test',
            'description' => 'Test',
            'price_paise' => 18000,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'package_size' => '30 ml',
            'status' => 'published',
            'is_featured' => false,
            'is_super_saving' => false,
            'published_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post(route('admin.products.toggle-popular', $product))
            ->assertRedirect();
        $this->assertTrue($product->fresh()->is_featured);

        $this->actingAs($admin)
            ->post(route('admin.products.toggle-super-saving', $product))
            ->assertRedirect();
        $this->assertTrue($product->fresh()->is_super_saving);
    }
}
