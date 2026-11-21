<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandsAllProductsSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_brands_page_lists_products_and_filters_by_search_and_category(): void
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

        $headHair = Category::query()->create([
            'name' => 'Head & Hair',
            'slug' => 'head-hair',
            'status' => 'published',
            'sort_order' => 1,
        ]);
        $digestive = Category::query()->create([
            'name' => 'Digestive Health',
            'slug' => 'digestive-health',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        $arnicaHair = Product::query()->create([
            'brand_id' => $sbl->id,
            'name' => 'SBL Arnica Hair Oil',
            'slug' => 'sbl-arnica-hair-oil',
            'sku' => 'SBL-HAIR-1',
            'price_paise' => 12000,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $arnicaHair->categories()->sync([$headHair->id]);

        $r1 = Product::query()->create([
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
        $r1->categories()->sync([$digestive->id]);

        $this->get('/brands')
            ->assertOk()
            ->assertSee('All Brands', false)
            ->assertSee('brands-product-search', false)
            ->assertSee('brands-category-filter', false)
            ->assertSee('All categories', false)
            ->assertSee('head-hair', false)
            ->assertSee('SBL Arnica Hair Oil', false)
            ->assertSee('Dr. Reckeweg R1', false);

        $this->get('/brands?q=Arnica')
            ->assertOk()
            ->assertSee('SBL Arnica Hair Oil', false)
            ->assertDontSee('Dr. Reckeweg R1', false);

        $this->get('/brands?category=head-hair')
            ->assertOk()
            ->assertSee('SBL Arnica Hair Oil', false)
            ->assertDontSee('Dr. Reckeweg R1', false)
            ->assertSee('in Head', false);
    }
}
