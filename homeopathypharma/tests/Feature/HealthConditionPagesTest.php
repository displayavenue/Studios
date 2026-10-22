<?php

namespace Tests\Feature;

use App\Models\HealthCondition;
use Database\Seeders\HealthConditionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthConditionPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_conditions_index_and_show_are_public_and_indexable(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HealthConditionSeeder::class);

        $count = HealthCondition::query()->published()->count();
        $this->assertGreaterThanOrEqual(200, $count);

        $sample = HealthCondition::query()->published()->where('slug', 'migraine')->first();
        $this->assertNotNull($sample);
        $this->assertCount(10, $sample->reviews);
        $this->assertGreaterThanOrEqual(5, count($sample->faqs));

        $this->get(route('conditions.index'))
            ->assertOk()
            ->assertSee('Health conditions', false)
            ->assertSee('Migraine', false);

        $this->get(route('conditions.show', 'migraine'))
            ->assertOk()
            ->assertSee('WhatsApp', false)
            ->assertSee('FAQs about Migraine', false)
            ->assertSee('application/ld+json', false)
            ->assertSee('wa.me/', false);

        $this->get('/llms.txt')
            ->assertOk()
            ->assertSee('Migraine', false)
            ->assertSee('/conditions/migraine', false);

        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertOk();
        $sitemap->assertSee(route('conditions.index'), false);
        $sitemap->assertSee(route('conditions.show', 'migraine'), false);

        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Allow: /conditions', false)
            ->assertSee('Allow: /llms.txt', false)
            ->assertSee('GPTBot', false);
    }

    public function test_draft_conditions_are_not_public(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        HealthCondition::query()->create([
            'slug' => 'hidden-condition',
            'title' => 'Hidden Condition',
            'category' => 'Test',
            'image_url' => 'https://picsum.photos/seed/x/1200/700',
            'image_alt' => 'Hidden',
            'snippet' => 'Hidden snippet',
            'short_description' => 'Short',
            'long_description' => 'Long',
            'faqs' => [],
            'reviews' => [],
            'review_count' => 0,
            'rating_average' => 0,
            'seo_title' => 'Hidden',
            'seo_description' => 'Hidden',
            'is_indexed' => true,
            'status' => 'draft',
            'published_at' => null,
            'sort_order' => 0,
        ]);

        $this->get(route('conditions.show', 'hidden-condition'))->assertNotFound();
        $this->get('/sitemap.xml')->assertDontSee('hidden-condition', false);
    }
}
