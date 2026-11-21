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
            'ingredients' => 'Arnica montana.',
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
            ->assertSee('Keep out of reach of children.', false)
            ->assertSee('Ingredients', false)
            ->assertSee('Arnica montana.', false);
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

    public function test_product_page_hides_benefits_when_same_as_description(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Schwabe',
            'slug' => 'schwabe',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        $product = Product::query()->create([
            'name' => 'Abelmoschus MT',
            'slug' => 'schwabe-abelmoschus-mt-dup',
            'brand_id' => $brand->id,
            'description' => 'Same copy for both.',
            'benefits' => 'Same copy for both.',
            'package_size' => '30 ml',
            'price_paise' => 12000,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('Description', false)
            ->assertDontSee('<h2>Benefits</h2>', false)
            ->assertSee('30 ml', false)
            ->assertSee('Pack of 1', false);
    }

    public function test_product_page_shows_pack_and_offer_under_name(): void
    {
        $brand = Brand::query()->create([
            'name' => 'SBL',
            'slug' => 'sbl',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $product = Product::query()->create([
            'name' => 'Bio-Combination 21 (Pack of 3 Combo)',
            'slug' => 'sbl-bio-combination-21-pack',
            'brand_id' => $brand->id,
            'package_size' => '25 g',
            'description' => 'Combo pack.',
            'price_paise' => 29900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('25 g', false)
            ->assertSee('Pack of 3', false);
    }

    public function test_product_page_defaults_to_pack_of_one(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Dr. Reckeweg',
            'slug' => 'dr-reckeweg',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        $product = Product::query()->create([
            'name' => 'R1 Inflammation Drops',
            'slug' => 'dr-reckeweg-r1-pack-one',
            'brand_id' => $brand->id,
            'package_size' => '22ml',
            'description' => 'Inflammation drops.',
            'price_paise' => 14900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->assertSame('22ml · Pack of 1', $product->packagingLabel());

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('22ml', false)
            ->assertSee('Pack of 1', false);
    }

    public function test_combo_products_prefer_pack_of_two_over_secondary_variant(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Schwabe',
            'slug' => 'schwabe',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        $product = Product::query()->create([
            'name' => 'Shampoo Oil Combo',
            'slug' => 'schwabe-shampoo-oil-combo-test',
            'brand_id' => $brand->id,
            // Stale scraped secondary variant should not win.
            'package_size' => 'Pack of 4',
            'description' => 'Shampoo Oil Combo is a powerful combination of two homoeopathic products: B&T Arnica Shampoo and B&T Hair Growth Oil.',
            'price_paise' => 27000,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->assertSame(2, $product->resolvePackCount());
        $this->assertSame('Pack of 2', $product->packagingLabel());

        $this->get('/product/'.$product->slug)
            ->assertOk()
            ->assertSee('Pack of 2', false)
            ->assertDontSee('Pack of 4', false);
    }
}
