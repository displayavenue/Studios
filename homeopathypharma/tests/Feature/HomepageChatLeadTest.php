<?php

namespace Tests\Feature;

use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageChatLeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_shows_chat_icon_linking_to_chat_page(): void
    {
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $this->get('/')
            ->assertOk()
            ->assertSee('hp-chat-fab', false)
            ->assertSee('href="'.url('/chat').'"', false);

        $this->get('/shop')
            ->assertOk()
            ->assertDontSee('hp-chat-fab', false);
    }
}
