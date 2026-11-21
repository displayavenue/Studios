<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SyncProductCategoriesCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_sync_command_assigns_categories_from_name_keywords(): void
    {
        Category::query()->create([
            'name' => 'Head & Hair',
            'slug' => 'head-hair',
            'status' => 'published',
            'sort_order' => 1,
        ]);
        Category::query()->create([
            'name' => 'General Wellness',
            'slug' => 'general-wellness',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        $product = Product::query()->create([
            'name' => 'Zauberöl Premium Hair Growth Oil',
            'slug' => 'zauberol-premium-hair-growth-oil',
            'sku' => 'HZ-HAIR-1',
            'price_paise' => 19900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->artisan('catalogue:sync-product-categories')->assertSuccessful();

        $this->assertTrue(
            $product->fresh()->categories()->where('slug', 'head-hair')->exists()
        );
    }
}
