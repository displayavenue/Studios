<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\AuditLog;
use App\Models\ContactMessage;
use App\Models\NotificationLog;
use App\Models\Order;
use App\Models\PolicyPage;
use App\Models\Shipment;
use App\Models\User;
use App\Services\Shipping\ShippingManager;
use Database\Seeders\PolicyPageSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase5ContentOpsTest extends TestCase
{
    use RefreshDatabase;

    public function test_draft_articles_and_policies_are_not_public(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        Article::query()->create([
            'title' => 'Draft Only',
            'slug' => 'draft-only',
            'body' => 'Secret draft body',
            'status' => 'draft',
        ]);

        Article::query()->create([
            'title' => 'Published Guide',
            'slug' => 'published-guide',
            'excerpt' => 'Safe excerpt',
            'body' => 'Published body',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->seed(PolicyPageSeeder::class);

        $this->get('/health-library')
            ->assertOk()
            ->assertSee('Published Guide', false)
            ->assertDontSee('Draft Only', false)
            ->assertDontSee('Secret draft body', false);

        $this->get('/health-library/draft-only')->assertNotFound();
        $this->get('/health-library/published-guide')
            ->assertOk()
            ->assertSee('Published body', false);

        $draft = PolicyPage::query()->where('key', 'privacy')->firstOrFail();
        $this->get('/policies/'.$draft->slug)->assertNotFound();

        $draft->update(['status' => 'published', 'published_at' => now()]);
        $this->get('/policies/'.$draft->slug)
            ->assertOk()
            ->assertSee('Privacy Policy', false);
    }

    public function test_admin_can_manage_articles_and_audit_is_written(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $category = ArticleCategory::query()->create([
            'name' => 'Wellness',
            'slug' => 'wellness',
            'status' => 'published',
        ]);

        $this->actingAs($admin)->post(route('admin.articles.store'), [
            'title' => 'Cold Care Basics',
            'content_type' => 'article',
            'article_category_id' => $category->id,
            'excerpt' => 'General tips',
            'body' => 'Educational content',
            'status' => 'published',
            'is_featured' => '1',
        ])->assertRedirect(route('admin.articles.index'));

        $this->assertDatabaseHas('articles', [
            'title' => 'Cold Care Basics',
            'status' => 'published',
            'is_featured' => 1,
        ]);

        $this->assertTrue(
            AuditLog::query()->where('action', 'article.created')->exists()
        );

        $this->get('/health-library')->assertSee('Cold Care Basics', false);
    }

    public function test_contact_persists_message_and_logs_notification_without_claiming_delivery(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->post('/contact', [
            'name' => 'Visitor',
            'contact' => 'visitor@example.test',
            'message' => 'Please call back about stock.',
            'consent' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Visitor',
            'contact' => 'visitor@example.test',
        ]);

        $log = NotificationLog::query()->where('event', 'contact.received')->first();
        $this->assertNotNull($log);
        $this->assertSame('skipped', $log->status);
        $this->assertSame('log', $log->channel);
    }

    public function test_shipping_manager_creates_manual_shipment_when_shiprocket_unconfigured(): void
    {
        $order = Order::query()->create([
            'number' => 'HP-TEST-1',
            'customer_name' => 'Buyer',
            'customer_phone' => '9999999999',
            'shipping_line1' => 'Line 1',
            'shipping_city' => 'Mumbai',
            'shipping_state' => 'MH',
            'shipping_postal_code' => '400001',
            'shipping_country' => 'IN',
            'currency' => 'INR',
            'subtotal_paise' => 10000,
            'shipping_paise' => 5000,
            'tax_paise' => 0,
            'total_paise' => 15000,
            'payment_status' => 'paid',
            'fulfilment_status' => 'processing',
            'idempotency_key' => 'phase5-ship-1',
            'paid_at' => now(),
        ]);

        $shipment = app(ShippingManager::class)->createForOrder($order);

        $this->assertInstanceOf(Shipment::class, $shipment);
        $this->assertSame('manual', $shipment->provider);
        $this->assertSame('pending', $shipment->status);
        $this->assertTrue(
            AuditLog::query()->where('action', 'shipment.created')->exists()
        );
    }

    public function test_robots_and_sitemap_expose_only_public_urls(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        Article::query()->create([
            'title' => 'Public Article',
            'slug' => 'public-article',
            'status' => 'published',
            'published_at' => now(),
        ]);
        Article::query()->create([
            'title' => 'Hidden Article',
            'slug' => 'hidden-article',
            'status' => 'draft',
        ]);

        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Disallow: /admin', false)
            ->assertSee('Sitemap:', false);

        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertOk();
        $sitemap->assertSee(route('health-library.show', 'public-article'), false);
        $sitemap->assertDontSee('hidden-article', false);
        $sitemap->assertDontSee('/admin', false);
    }

    public function test_seeded_policies_remain_draft_until_admin_publishes(): void
    {
        $this->seed(PolicyPageSeeder::class);

        $this->assertSame(
            8,
            PolicyPage::query()->where('status', 'draft')->count()
        );

        $this->get('/')->assertDontSee('Privacy Policy', false);
    }
}
