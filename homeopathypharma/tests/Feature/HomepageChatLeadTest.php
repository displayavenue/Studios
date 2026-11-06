<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\NotificationLog;
use Database\Seeders\HomepageSectionSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class HomepageChatLeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_chat_page_renders_whatsapp_style_shell(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/chat')
            ->assertOk()
            ->assertSee('Have a question? We are here to help.', false)
            ->assertSee('Prefer WhatsApp?', false)
            ->assertSee('Type a message', false)
            ->assertSee('data-hp-wa', false)
            ->assertSee('hp-wa__composer', false)
            ->assertDontSee('Doubts, concerns, or information', false);
    }

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

    public function test_chat_json_creates_chat_lead_for_admin(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->postJson('/contact', [
            'name' => 'Asha Verma',
            'contact' => '9876501234',
            'message' => 'Is Arnica available in 30C? Also shipping to Pune?',
            'consent' => '1',
            'context' => 'Homepage chat',
            'lead_form' => 'homepage_chat',
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('lead_form', 'homepage_chat');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Asha Verma',
            'contact' => '9876501234',
            'source' => 'chat',
            'status' => 'new',
        ]);

        $lead = ContactMessage::query()->latest('id')->first();
        $this->assertNotNull($lead);
        $this->assertStringContainsString('Arnica', (string) $lead->message);

        $this->assertTrue(
            NotificationLog::query()
                ->where('event', 'lead.received')
                ->where('channel', 'admin_inbox')
                ->exists()
        );
    }
}
