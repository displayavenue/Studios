<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase2CatalogueTest extends TestCase
{
    use RefreshDatabase;

    public function test_draft_products_are_hidden_from_shop(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        Product::query()->create([
            'name' => 'Draft Remedy',
            'slug' => 'draft-remedy',
            'price_paise' => 19900,
            'stock_qty' => 10,
            'stock_status' => 'in_stock',
            'status' => 'draft',
        ]);

        Product::query()->create([
            'name' => 'Published Remedy',
            'slug' => 'published-remedy',
            'price_paise' => 29900,
            'stock_qty' => 5,
            'stock_status' => 'in_stock',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/shop');
        $response->assertOk();
        $response->assertSee('Published Remedy', false);
        $response->assertDontSee('Draft Remedy', false);
    }

    public function test_admin_dashboard_requires_admin_user(): void
    {
        $this->seed(AdminUserSeeder::class);

        $this->get('/admin')->assertRedirect(route('admin.login'));

        $user = User::query()->where('email', 'admin@localhost.invalid')->firstOrFail();
        $this->actingAs($user)->get('/admin')->assertOk();
    }

    public function test_non_admin_cannot_access_admin(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_homepage_still_loads_after_phase_2(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $this->get('/')->assertOk()->assertSee('HOMEOPATHY PHARMA', false);
    }
}
