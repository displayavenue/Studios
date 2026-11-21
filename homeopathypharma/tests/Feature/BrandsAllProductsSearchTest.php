<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandsAllProductsSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_brands_page_lists_products_from_every_brand_and_supports_search(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $sbl = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);
        $reckeweg = Brand::query()->create([
            'name' => 'Dr. Reckeweg',
            'slug' => 'dr-reckeweg',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        Product::query()->create([
            'brand_id' => $sbl->id,
            'name' => 'SBL Arnica Montana',
            'slug' => 'sbl-arnica-montana',
            'sku' => 'SBL-ARN-30',
            'price_paise' => 12000,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);
        Product::query()->create([
            'brand_id' => $reckeweg->id,
            'name' => 'Dr. Reckeweg R1',
            'slug' => 'dr-reckeweg-r1',
            'sku' => 'R1-22ML',
            'price_paise' => 25000,
            'stock_qty' => 8,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/brands')
            ->assertOk()
            ->assertSee('All Brands', false)
            ->assertSee('Search any product', false)
            ->assertSee('brands-product-search', false)
            ->assertSee('SBL Arnica Montana', false)
            ->assertSee('Dr. Reckeweg R1', false)
            ->assertSee('2 products', false);

        $this->get('/brands?q=Arnica')
            ->assertOk()
            ->assertSee('SBL Arnica Montana', false)
            ->assertDontSee('Dr. Reckeweg R1', false)
            ->assertSee('1 product', false);

        $this->get('/brands?brand=dr-reckeweg')
            ->assertOk()
            ->assertSee('Dr. Reckeweg R1', false)
            ->assertDontSee('SBL Arnica Montana', false);
    }
}
