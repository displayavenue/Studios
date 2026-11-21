<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductDetailsSectionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_shows_benefits_dosage_and_safety(): void
    {
        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'description' => 'Test brand',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $product = Product::query()->create([
            'name' => 'Arnica Montana 30C',
            'slug' => 'sbl-arnica-montana-30c-test',
            'sku' => 'SBL-ARNICA-TEST',
            'brand_id' => $brand->id,
            'short_description' => 'Short copy',
            'description' => 'Full product description from brand site.',
            'benefits' => 'Helps with bruises and soft-tissue injury.',
            'directions' => 'As prescribed by the doctor.',
            'warnings' => 'Keep out of reach of children.',
            'price_paise' => 14900,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('Description', false)
            ->assertSee('Full product description from brand site.', false)
            ->assertSee('Benefits', false)
            ->assertSee('Helps with bruises and soft-tissue injury.', false)
            ->assertSee('Dosage', false)
            ->assertSee('As prescribed by the doctor.', false)
            ->assertSee('Safety information', false)
            ->assertSee('Keep out of reach of children.', false);
    }

    public function test_product_page_always_shows_dosage_fallback(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Schwabe',
            'slug' => 'schwabe',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        $product = Product::query()->create([
            'name' => 'Test Dilution',
            'slug' => 'schwabe-test-dilution',
            'brand_id' => $brand->id,
            'description' => 'A test description.',
            'directions' => null,
            'price_paise' => 9900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('Dosage', false)
            ->assertSee('As prescribed by the doctor.', false);
    }
}
