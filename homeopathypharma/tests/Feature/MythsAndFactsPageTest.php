<?php

namespace Tests\Feature;

use App\Models\MythVsFact;
use App\Models\User;
use Database\Seeders\MythVsFactSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MythsAndFactsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_myths_vs_facts_page_lists_published_entries_in_reveal_format(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(MythVsFactSeeder::class);

        $response = $this->get(route('myths-vs-fact'));

        $response->assertOk()
            ->assertSee('Myths vs Facts', false)
            ->assertSee('A to Z Diseases', false)
            ->assertSee('Area of Consultation', false)
            ->assertSee('Myth 01', false)
            ->assertSee('Show fact', false)
            ->assertSee('hp-mvf__timeline', false)
            ->assertSee('hp-mvf-card', false)
            ->assertSee('hp-mvf-fact', false)
            ->assertDontSee('min(72vh', false);

        preg_match_all('/data-mvf-card/', $response->getContent(), $matches);
        $this->assertGreaterThanOrEqual(20, count($matches[0]));
    }

    public function test_draft_entries_are_hidden_on_public_page(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        MythVsFact::query()->create([
            'myth_title' => 'Published myth for public page',
            'fact_title' => 'Published fact',
            'fact_body' => 'Visible body',
            'sort_order' => 1,
            'status' => 'published',
            'published_at' => now(),
        ]);
        MythVsFact::query()->create([
            'myth_title' => 'Hidden draft myth should not appear',
            'fact_title' => 'Hidden fact',
            'fact_body' => 'Hidden body',
            'sort_order' => 2,
            'status' => 'draft',
        ]);

        $this->get(route('myths-vs-fact'))
            ->assertOk()
            ->assertSee('Published myth for public page', false)
            ->assertDontSee('Hidden draft myth should not appear', false);
    }

    public function test_conditions_nav_orders_myths_before_area_of_consultation(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get(route('home'))->assertOk()->getContent();

        $mythsPos = strpos($html, 'Myths vs Facts');
        $areaPos = strpos($html, 'Area of Consultation');
        $azPos = strpos($html, 'A to Z Diseases');

        $this->assertNotFalse($azPos);
        $this->assertNotFalse($mythsPos);
        $this->assertNotFalse($areaPos);
        $this->assertLessThan($mythsPos, $azPos);
        $this->assertLessThan($areaPos, $mythsPos);
    }

    public function test_sitemap_includes_myths_vs_fact(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee(route('myths-vs-fact'), false);
    }

    public function test_old_myths_and_facts_url_redirects(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/myths-and-facts')
            ->assertRedirect('/myths-vs-fact');
    }

    public function test_admin_can_create_update_and_delete_myth_vs_fact_entries(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get(route('admin.myth-vs-facts.index'))
            ->assertOk()
            ->assertSee('Myths vs Facts', false);

        $this->actingAs($admin)
            ->post(route('admin.myth-vs-facts.store'), [
                'myth_title' => 'Homeopathy is just another name for herbal medicine.',
                'fact_title' => 'Homeopathy and herbal medicine are different systems.',
                'fact_body' => 'Homeopathic preparations follow specific dilution and shaking processes, whereas herbal medicines use plant-based ingredients.',
                'sort_order' => 1,
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.myth-vs-facts.index'));

        $entry = MythVsFact::query()->firstOrFail();
        $this->assertSame('published', $entry->status);

        $this->get(route('myths-vs-fact'))
            ->assertOk()
            ->assertSee('Homeopathy is just another name for herbal medicine.', false)
            ->assertSee('Homeopathy and herbal medicine are different systems.', false);

        $this->actingAs($admin)
            ->put(route('admin.myth-vs-facts.update', $entry), [
                'myth_title' => 'Updated myth title for admin control',
                'fact_title' => $entry->fact_title,
                'fact_body' => $entry->fact_body,
                'sort_order' => 2,
                'status' => 'published',
            ])
            ->assertRedirect(route('admin.myth-vs-facts.index'));

        $this->get(route('myths-vs-fact'))
            ->assertOk()
            ->assertSee('Updated myth title for admin control', false);

        $this->actingAs($admin)
            ->delete(route('admin.myth-vs-facts.destroy', $entry))
            ->assertRedirect(route('admin.myth-vs-facts.index'));

        $this->assertDatabaseCount('myth_vs_facts', 0);
    }
}
