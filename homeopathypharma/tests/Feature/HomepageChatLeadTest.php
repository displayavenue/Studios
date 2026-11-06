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

    public function test_chat_page_renders_requested_copy(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/chat')
            ->assertOk()
            ->assertSee('Have a question? We are here to help.', false)
            ->assertSee('Prefer WhatsApp? Chat now', false)
            ->assertDontSee('Doubts, concerns, or information', false)
            ->assertDontSee('Hi — tell us which product', false)
            ->assertSee('Your name', false)
            ->assertSee('Mobile number', false);
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

    public function test_chat_form_creates_chat_lead_for_admin(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);
        $this->seed(HomepageSectionSeeder::class);

        $response = $this->from('/chat')->post('/contact', [
            'name' => 'Asha Verma',
            'contact' => '9876501234',
            'message' => 'Is Arnica available in 30C? Also shipping to Pune?',
            'consent' => '1',
            'context' => 'Homepage chat',
            'lead_form' => 'homepage_chat',
        ]);

        $response->assertRedirect(route('chat.show'));
        $response->assertSessionHas('lead_success', true);
        $response->assertSessionHas('lead_form', 'homepage_chat');

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
