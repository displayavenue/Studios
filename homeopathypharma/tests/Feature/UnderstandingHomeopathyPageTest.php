<?php

namespace Tests\Feature;

use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnderstandingHomeopathyPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_understanding_homeopathy_page_lists_five_faqs(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $response = $this->get(route('understanding-homeopathy'))->assertOk();
        $response->assertSee('Understanding Homeopathy', false);
        $response->assertSee('Knowledge Centre', false);
        $response->assertSee('What is homeopathy and how does it work?', false);
        $response->assertSee('What are homeopathic medicines made from, and how are they prepared?', false);
        $response->assertSee('Are homeopathic medicines safe, and do they have side effects?', false);
        $response->assertSee('Can homeopathy be used alongside conventional medical treatments?', false);
        $response->assertSee('When should you consult a homeopathic doctor, and what happens during a consultation?', false);
        $response->assertSee('law of similars', false);
        $response->assertSee('CCRH', false);
        $response->assertSee('Educational information only', false);
    }

    public function test_knowledge_centre_nav_links_to_understanding_homeopathy(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $html = $this->get(route('home'))->assertOk()->getContent();

        $this->assertMatchesRegularExpression(
            '/Knowledge Centre[\s\S]*?Understanding Homeopathy[\s\S]*?Myths vs Facts/i',
            $html
        );
        $this->assertStringContainsString(route('understanding-homeopathy'), $html);
    }
}
