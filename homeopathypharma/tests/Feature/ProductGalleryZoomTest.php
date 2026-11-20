<?php

namespace Tests\Feature;

use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductGalleryZoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_shows_gallery_zoom_controls(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        Storage::fake('public');

        $product = Product::query()->create([
            'name' => 'Zoomable Remedy',
            'slug' => 'zoomable-remedy',
            'price_paise' => 19900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $one = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => 'media/one.jpg',
            'filename' => 'one.jpg',
            'original_name' => 'one.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 10,
            'alt_text' => 'One',
        ]);
        $two = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => 'media/two.jpg',
            'filename' => 'two.jpg',
            'original_name' => 'two.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 10,
            'alt_text' => 'Two',
        ]);

        ProductImage::query()->create([
            'product_id' => $product->id,
            'media_asset_id' => $one->id,
            'sort_order' => 0,
            'is_primary' => true,
        ]);
        ProductImage::query()->create([
            'product_id' => $product->id,
            'media_asset_id' => $two->id,
            'sort_order' => 1,
            'is_primary' => false,
        ]);

        $this->get(route('product.show', $product->slug))
            ->assertOk()
            ->assertSee('data-hp-product-gallery', false)
            ->assertSee('data-hp-zoom-main', false)
            ->assertSee('data-hp-zoom-stage', false)
            ->assertSee('product-image-zoom.js', false)
            ->assertSee('move your cursor over the image to zoom', false)
            ->assertSee('data-hp-zoom-thumb', false)
            ->assertDontSee('Zoom image', false);
    }

    public function test_admin_can_delete_one_product_image_and_keep_others(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::query()->create([
            'name' => 'Gallery Product',
            'slug' => 'gallery-product',
            'price_paise' => 15000,
            'stock_qty' => 3,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $keep = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => 'media/keep.jpg',
            'filename' => 'keep.jpg',
            'original_name' => 'keep.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 10,
        ]);
        $drop = MediaAsset::query()->create([
            'disk' => 'public',
            'path' => 'media/drop.jpg',
            'filename' => 'drop.jpg',
            'original_name' => 'drop.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 10,
        ]);

        $keepImage = ProductImage::query()->create([
            'product_id' => $product->id,
            'media_asset_id' => $keep->id,
            'sort_order' => 0,
            'is_primary' => true,
        ]);
        $dropImage = ProductImage::query()->create([
            'product_id' => $product->id,
            'media_asset_id' => $drop->id,
            'sort_order' => 1,
            'is_primary' => false,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.products.images.destroy', [$product, $dropImage]))
            ->assertRedirect();

        $this->assertDatabaseMissing('product_images', ['id' => $dropImage->id]);
        $this->assertDatabaseHas('product_images', ['id' => $keepImage->id, 'is_primary' => 1]);
        $this->assertSame(1, $product->images()->count());
    }
}
