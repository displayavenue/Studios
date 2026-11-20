<?php

namespace Tests\Feature;

use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HeaderHomeNavTest extends TestCase
{
    use RefreshDatabase;

    public function test_primary_nav_includes_home_link_before_shop_by_category(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get('/contact')->assertOk()->getContent();

        $this->assertStringContainsString('aria-label="Primary"', $html);
        $this->assertMatchesRegularExpression(
            '/aria-label="Primary"[\s\S]*?>[\s\S]*?<a class="hp-nav-link" href="[^"]*\/?"[^>]*>Home<\/a>[\s\S]*?Shop by Category/i',
            $html
        );
    }
}
