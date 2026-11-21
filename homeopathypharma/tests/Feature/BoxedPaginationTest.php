<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoxedPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_shows_thirty_products_per_page_with_boxed_numbers(): void
    {
        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        for ($i = 1; $i <= 35; $i++) {
            Product::query()->create([
                'name' => "Test Product {$i}",
                'slug' => "test-product-{$i}",
                'sku' => "TEST-{$i}",
                'brand_id' => $brand->id,
                'price_paise' => 1000 + $i,
                'stock_qty' => 5,
                'stock_status' => 'in_stock',
                'status' => 'published',
                'published_at' => now()->subMinutes($i),
            ]);
        }

        $response = $this->get('/shop')->assertOk();
        $response->assertSee('35 product(s)', false);
        $response->assertSee('hp-pagination', false);
        $response->assertSee('hp-pagination__box--current', false);
        $response->assertSee('>1<', false);
        $response->assertSee('page=2', false);
        // Old previous/next page chevrons removed
        $response->assertDontSee('&laquo;', false);
        $response->assertDontSee('&raquo;', false);
        $response->assertDontSee('&laquo; Previous', false);
    }

    public function test_shop_pagination_windows_move_in_sets_of_ten(): void
    {
        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        // 30 per page × 12 pages = 360 products → windows 1-10 then 11-12
        for ($i = 1; $i <= 360; $i++) {
            Product::query()->create([
                'name' => "Window Product {$i}",
                'slug' => "window-product-{$i}",
                'sku' => "WIN-{$i}",
                'brand_id' => $brand->id,
                'price_paise' => 1000 + $i,
                'stock_qty' => 5,
                'stock_status' => 'in_stock',
                'status' => 'published',
                'published_at' => now()->subMinutes($i),
            ]);
        }

        $page1 = $this->get('/shop')->assertOk();
        $page1->assertSee('>1<', false);
        $page1->assertSee('>10<', false);
        $page1->assertDontSee('>11<', false);
        $page1->assertSee('Next page numbers', false);
        $page1->assertSee('page=11', false);
        $page1->assertDontSee('Previous page numbers', false);

        $page11 = $this->get('/shop?page=11')->assertOk();
        $page11->assertSee('>11<', false);
        $page11->assertSee('hp-pagination__box--current', false);
        $page11->assertSee('Previous page numbers', false);
        $page11->assertSee('page=1', false);
        $page11->assertDontSee('>10<', false);
    }
}
