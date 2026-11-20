<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductBackendTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'is_admin' => true,
        ]);
    }

    public function test_admin_can_update_market_and_sale_pricing(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $product = Product::query()->create([
            'name' => 'Arnica 30C',
            'slug' => 'arnica-30c',
            'brand_id' => $brand->id,
            'price_paise' => 20000,
            'sale_price_paise' => null,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->actingAs($this->admin())
            ->put(route('admin.products.update', $product), [
                'name' => 'Arnica 30C',
                'slug' => 'arnica-30c',
                'brand_id' => $brand->id,
                'price_inr' => '250.00',
                'sale_price_inr' => '199.00',
                'sale_starts_at_input' => now()->subDay()->format('Y-m-d\TH:i'),
                'sale_ends_at_input' => now()->addDays(7)->format('Y-m-d\TH:i'),
                'stock_qty' => 10,
                'stock_status' => 'in_stock',
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.products.edit', $product));

        $product->refresh();
        $this->assertSame(25000, (int) $product->price_paise);
        $this->assertSame(19900, (int) $product->sale_price_paise);
        $this->assertTrue($product->hasActiveSale());
        $this->assertSame(20, $product->discountPercent());
    }

    public function test_admin_product_edit_shows_pricing_and_preview(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $product = Product::query()->create([
            'name' => 'Nux Vomica 30C',
            'slug' => 'nux-vomica-30c',
            'price_paise' => 14900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->actingAs($this->admin())
            ->get(route('admin.products.edit', $product))
            ->assertOk()
            ->assertSee('Market / MRP', false)
            ->assertSee('Sale price', false)
            ->assertSee('Frontend card preview', false)
            ->assertSee('Adjust primary image', false)
            ->assertSee('data-hp-product-form', false);
    }
}
