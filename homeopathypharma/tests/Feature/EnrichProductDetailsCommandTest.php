<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrichProductDetailsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_enrich_command_applies_scraped_details_and_dosage(): void
    {
        $brand = Brand::query()->create([
            'name' => 'Schwabe',
            'slug' => 'schwabe',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        $product = Product::query()->create([
            'name' => 'Abelmoschus CH',
            'slug' => 'schwabe-abelmoschus',
            'brand_id' => $brand->id,
            'description' => 'Old description',
            'price_paise' => 12000,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $dir = storage_path('framework/testing/product-details');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $path = $dir.'/product-details.json';
        file_put_contents($path, json_encode([
            [
                'brand' => 'schwabe',
                'source_slug' => 'abelmoschus',
                'product_slug' => 'schwabe-abelmoschus',
                'description' => 'Fresh description from brand site.',
                'benefits' => 'Useful for nervous debility.',
                'dosage' => 'As prescribed by the doctor.',
                'safety' => 'Keep out of reach of children.',
            ],
        ]));

        $this->artisan('catalogue:enrich-product-details', [
            '--path' => $path,
            '--brand' => 'schwabe',
        ])->assertSuccessful();

        $product->refresh();
        $this->assertSame('Fresh description from brand site.', $product->description);
        $this->assertSame('Useful for nervous debility.', $product->benefits);
        $this->assertSame('As prescribed by the doctor.', $product->directions);
        $this->assertSame('Keep out of reach of children.', $product->warnings);
    }
}
