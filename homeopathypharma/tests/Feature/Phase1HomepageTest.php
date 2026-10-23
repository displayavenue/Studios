<?php

namespace Tests\Feature;

use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase1HomepageTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_shows_brand_phone_and_empty_catalogue_states(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('HOMEOPATHY PHARMA', false);
        $response->assertSee('Natural wellness. Expert guidance.', false);
        $response->assertSee('+91 8169 122333', false);
        $response->assertSee('No featured products yet', false);
        $response->assertDontSee('@gmail.com', false);
    }

    public function test_contact_page_shows_verified_address(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->get('/contact');

        $response->assertOk();
        $response->assertSee('Mira Road East', false);
        $response->assertSee('+91 8169 122333', false);
    }

    public function test_doctors_page_does_not_invent_practitioners(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->get('/doctors');

        $response->assertOk();
        $response->assertSee('No practitioner profiles are available', false);
    }
}
