<?php

namespace Tests\Feature;

use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MythsAndFactsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_myths_vs_fact_page_lists_at_least_twenty_unique_pairs(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->get(route('myths-vs-fact'));

        $response->assertOk()
            ->assertSee('Myths vs Fact', false)
            ->assertSee('A to Z Diseases', false)
            ->assertSee('Area of Consultation', false)
            ->assertSee('01 / The Myth', false)
            ->assertSee('01 / The Fact', false)
            ->assertSee('hp-myths-panel--myth', false)
            ->assertSee('hp-myths-panel--fact', false);

        preg_match_all('/class="hp-myths-pair"/', $response->getContent(), $matches);
        $this->assertGreaterThanOrEqual(20, count($matches[0]));

        preg_match_all('/hp-myths-panel--myth[\s\S]*?hp-myths-panel__title">(.*?)<\/h2>/', $response->getContent(), $myths);
        $mythTexts = array_map(static fn (string $text): string => trim(html_entity_decode(strip_tags($text))), $myths[1] ?? []);
        $this->assertSame(count($mythTexts), count(array_unique($mythTexts)));

        preg_match_all('/hp-myths-panel--fact[\s\S]*?hp-myths-panel__title">(.*?)<\/h2>/', $response->getContent(), $facts);
        $factTexts = array_map(static fn (string $text): string => trim(html_entity_decode(strip_tags($text))), $facts[1] ?? []);
        $this->assertSame(count($factTexts), count(array_unique($factTexts)));
    }

    public function test_conditions_nav_orders_myths_before_area_of_consultation(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get(route('home'))->assertOk()->getContent();

        $mythsPos = strpos($html, 'Myths vs Fact');
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
}
