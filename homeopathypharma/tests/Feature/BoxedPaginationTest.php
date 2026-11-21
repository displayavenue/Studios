<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoxedPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_pagination_renders_boxed_page_numbers(): void
    {
        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        for ($i = 1; $i <= 30; $i++) {
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
        $response->assertSee('hp-pagination', false);
        $response->assertSee('hp-pagination__box', false);
        $response->assertSee('hp-pagination__box--current', false);
        $response->assertSee('>1<', false);
        $response->assertSee('page=2', false);
        $response->assertDontSee('&laquo; Previous', false);
    }
}
