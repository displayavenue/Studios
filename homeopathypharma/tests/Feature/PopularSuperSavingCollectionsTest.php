<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Product;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PopularSuperSavingCollectionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_collection_filters_show_all_brands_popular_and_super_saving(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $bakson = Brand::query()->create(['name' => 'Bakson', 'slug' => 'bakson', 'status' => 'published', 'sort_order' => 1]);
        $bjain = Brand::query()->create(['name' => 'Bjain', 'slug' => 'bjain', 'status' => 'published', 'sort_order' => 2]);
        $sbl = Brand::query()->create(['name' => 'SBL', 'slug' => 'sbl', 'status' => 'published', 'sort_order' => 3]);

        $this->makeProduct($bakson, 'Bakson Popular', 'bakson-popular', featured: true);
        $this->makeProduct($bjain, 'Bjain Popular', 'bjain-popular', featured: true);
        $this->makeProduct($sbl, 'SBL Popular', 'sbl-popular', featured: true);
        $this->makeProduct($bakson, 'Bakson Deal', 'bakson-deal', deal: true, sale: 12000);
        $this->makeProduct($bjain, 'Bjain Deal', 'bjain-deal', deal: true, sale: 11000);
        $this->makeProduct($sbl, 'SBL Regular', 'sbl-regular');

        $popular = $this->get('/shop?collection=popular')->assertOk();
        $popular->assertSee('Popular Homeopathic Medicines', false);
        $popular->assertSee('Bakson Popular', false);
        $popular->assertSee('Bjain Popular', false);
        $popular->assertSee('SBL Popular', false);
        $popular->assertDontSee('SBL Regular', false);
        $popular->assertSee('3 product(s)', false);

        $deals = $this->get('/shop?collection=super-saving')->assertOk();
        $deals->assertSee('Super Saving Deals', false);
        $deals->assertSee('Bakson Deal', false);
        $deals->assertSee('Bjain Deal', false);
        $deals->assertDontSee('SBL Regular', false);
        $deals->assertSee('2 product(s)', false);
    }

    public function test_homepage_view_all_links_go_to_collection_pages_and_mix_brands(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $bakson = Brand::query()->create(['name' => 'Bakson', 'slug' => 'bakson', 'status' => 'published', 'sort_order' => 1]);
        $bjain = Brand::query()->create(['name' => 'Bjain', 'slug' => 'bjain', 'status' => 'published', 'sort_order' => 2]);
        $wheezal = Brand::query()->create(['name' => 'Wheezal', 'slug' => 'wheezal', 'status' => 'published', 'sort_order' => 3]);

        $this->makeProduct($bakson, 'Bakson Pop A', 'bakson-pop-a', featured: true);
        $this->makeProduct($bjain, 'Bjain Pop A', 'bjain-pop-a', featured: true);
        $this->makeProduct($wheezal, 'Wheezal Pop A', 'wheezal-pop-a', featured: true);
        $this->makeProduct($bakson, 'Bakson Deal A', 'bakson-deal-a', deal: true, sale: 9000);
        $this->makeProduct($bjain, 'Bjain Deal A', 'bjain-deal-a', deal: true, sale: 8000);

        $home = $this->get('/')->assertOk();
        $home->assertSee(route('shop.index', ['collection' => 'popular']), false);
        $home->assertSee(route('shop.index', ['collection' => 'super-saving']), false);
        $home->assertSee('Bakson Pop A', false);
        $home->assertSee('Bjain Pop A', false);
        $home->assertSee('Wheezal Pop A', false);
        $home->assertSee('Bakson Deal A', false);
        $home->assertSee('Bjain Deal A', false);
    }

    public function test_mark_brand_highlights_covers_all_published_brands(): void
    {
        $sbl = Brand::query()->create(['name' => 'SBL', 'slug' => 'sbl', 'status' => 'published', 'sort_order' => 1]);
        $bakson = Brand::query()->create(['name' => 'Bakson', 'slug' => 'bakson', 'status' => 'published', 'sort_order' => 2]);

        foreach ([$sbl, $bakson] as $brand) {
            foreach (range(1, 6) as $i) {
                $this->makeProduct(
                    $brand,
                    "{$brand->name} Syrup {$i}",
                    $brand->slug."-syrup-{$i}",
                    price: 20000 + ($i * 100),
                    sale: $i <= 2 ? 15000 : null,
                );
            }
        }

        $this->artisan('catalogue:mark-brand-highlights', [
            '--popular' => 3,
            '--deals' => 2,
        ])->assertSuccessful();

        $this->assertSame(3, Product::query()->where('brand_id', $sbl->id)->where('is_featured', true)->count());
        $this->assertSame(2, Product::query()->where('brand_id', $sbl->id)->where('is_super_saving', true)->count());
        $this->assertSame(3, Product::query()->where('brand_id', $bakson->id)->where('is_featured', true)->count());
        $this->assertSame(2, Product::query()->where('brand_id', $bakson->id)->where('is_super_saving', true)->count());
    }

    private function makeProduct(
        Brand $brand,
        string $name,
        string $slug,
        bool $featured = false,
        bool $deal = false,
        int $price = 15000,
        ?int $sale = null,
    ): Product {
        return Product::query()->create([
            'name' => $name,
            'slug' => $slug,
            'sku' => strtoupper($slug),
            'brand_id' => $brand->id,
            'short_description' => $name,
            'description' => $name,
            'price_paise' => $price,
            'sale_price_paise' => $sale,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'package_size' => '30 ml',
            'status' => 'published',
            'is_featured' => $featured,
            'is_super_saving' => $deal,
            'published_at' => now(),
        ]);
    }
}
