<?php

namespace Tests\Feature;

use App\Models\Faq;
use App\Models\User;
use Database\Seeders\FaqSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_faqs_page_groups_questions_under_category_headings(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(FaqSeeder::class);

        $response = $this->get(route('faqs'))->assertOk();
        $response->assertSee("FAQ's");
        $response->assertSee('Knowledge Centre');
        $response->assertSee('Orders & Shopping');
        $response->assertSee('Payments & Delivery');
        $response->assertSee('Medicines & Products');
        $response->assertSee('Consultation');
        $response->assertSee('Returns & Customer Support');
        $response->assertSee('Pricing & Payments');
        $response->assertSee('Product Selection & Availability');
        $response->assertSee('Orders & Account');
        $response->assertSee('Delivery & Convenience');
        $response->assertSee('How can I place an order on Homeopathy Pharma?');
        $response->assertSee('A simple guide to shopping with Homeopathy Pharma.');
        $response->assertSee('Explore Products');
        $response->assertSee('View Product Details');
        $response->assertSee('Add to Cart');
        $response->assertSee('Review Your Cart');
        $response->assertSee('Enter Delivery Details');
        $response->assertSee('Complete Payment');
        $response->assertSee('Proceed to checkout');
        $response->assertSee('What should I do if my payment is deducted but my order is not confirmed?');
        $response->assertSee('Can I view my previous order history?');
        $response->assertSee('Can I place an order as a guest without registering?');
        $response->assertSee('Can I request a delivery to a different person as a gift?');
        $response->assertSee('Will I receive a GST invoice with my order?');
        $response->assertSee('<ol class="hp-faq__guide">', false);
        $response->assertSee('Is Cash on Delivery available?');
        $response->assertDontSee('Cash on Delivery is not available');
        $response->assertSee('<details class="hp-faq__item">', false);
        $response->assertSee('hp-faq__icon', false);
    }

    public function test_knowledge_centre_nav_lists_faqs_third(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get(route('home'))->assertOk()->getContent();
        preg_match('/<nav id="site-nav"[^>]*>([\s\S]*?)<\/nav>/i', $html, $navMatch);
        $nav = $navMatch[1] ?? '';

        $this->assertMatchesRegularExpression(
            '/Knowledge Centre[\s\S]*?Understanding Homeopathy[\s\S]*?Myths vs Facts[\s\S]*?FAQ\'s/i',
            $nav
        );
        $this->assertStringContainsString(route('faqs'), $html);
    }

    public function test_sitemap_includes_faqs(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee(route('faqs'), false);
    }

    public function test_admin_can_create_update_and_delete_faqs(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get(route('admin.faqs.index'))
            ->assertOk()
            ->assertSee("FAQ's", false);

        $this->actingAs($admin)
            ->post(route('admin.faqs.store'), [
                'category' => 'Orders & Shopping',
                'question' => 'Can I save items for later?',
                'answer' => 'Use your cart while browsing; sign in to keep order history.',
                'sort_order' => 99,
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.faqs.index'));

        $entry = Faq::query()->firstOrFail();
        $this->assertSame('published', $entry->status);

        $this->get(route('faqs'))
            ->assertOk()
            ->assertSee('Can I save items for later?', false)
            ->assertSee('Use your cart while browsing', false);

        $this->actingAs($admin)
            ->put(route('admin.faqs.update', $entry), [
                'category' => $entry->category,
                'question' => 'Updated FAQ question for admin control',
                'answer' => '',
                'sort_order' => 100,
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.faqs.index'));

        $entry->refresh();
        $this->assertNull($entry->answer);

        $this->get(route('faqs'))
            ->assertOk()
            ->assertSee('Updated FAQ question for admin control', false);

        $this->actingAs($admin)
            ->delete(route('admin.faqs.destroy', $entry))
            ->assertRedirect(route('admin.faqs.index'));

        $this->assertDatabaseCount('faqs', 0);
    }
}
