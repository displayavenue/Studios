<?php

namespace Tests\Feature;

use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HeaderNavOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_primary_nav_follows_requested_order_and_dropdowns(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get(route('home'))->assertOk()->getContent();

        preg_match('/<nav id="site-nav"[^>]*>([\s\S]*?)<\/nav>/i', $html, $navMatch);
        $this->assertNotEmpty($navMatch[1] ?? null);
        $nav = $navMatch[1];

        $this->assertMatchesRegularExpression(
            '/>Home<\/a>[\s\S]*?Shop by Category[\s\S]*?Brands[\s\S]*?Conditions[\s\S]*?Health Explorer[\s\S]*?Consult a Doctor[\s\S]*?Knowledge Centre[\s\S]*?>\s*More\s*</i',
            $nav
        );

        $this->assertMatchesRegularExpression(
            '/Conditions[\s\S]*?A to Z Diseases[\s\S]*?Area of Consultation/i',
            $nav
        );
        $this->assertMatchesRegularExpression(
            '/Knowledge Centre[\s\S]*?Understanding Homeopathy[\s\S]*?Myths vs Facts/i',
            $nav
        );
        $this->assertMatchesRegularExpression(
            '/>\s*More\s*<[\s\S]*?About Us[\s\S]*?Contact Us[\s\S]*?Track Order[\s\S]*?Need Help\?/i',
            $nav
        );

        $this->assertStringNotContainsString('Health Library', $nav);
        $this->assertStringNotContainsString('hp-nav-link--pill', $html);
        $this->assertDoesNotMatchRegularExpression(
            '/Conditions[\s\S]*?Myths vs Facts[\s\S]*?Area of Consultation/i',
            $nav
        );
    }
}
