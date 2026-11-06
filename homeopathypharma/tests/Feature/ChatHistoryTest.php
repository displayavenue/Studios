<?php

namespace Tests\Feature;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\ContactMessage;
use App\Models\User;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ChatHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_chat_page_is_professional_not_whatsapp_clone(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $this->get('/chat')
            ->assertOk()
            ->assertSee('Homeopathy Pharma', false)
            ->assertSee('Have a question? We are here to help.', false)
            ->assertSee('Prefer WhatsApp?', false)
            ->assertSee('hp-prochat', false)
            ->assertDontSee('hp-wa__composer', false)
            ->assertDontSee('online', false);
    }

    public function test_conversation_history_is_recorded_for_each_message(): void
    {
        Mail::fake();
        $this->seed(SiteSettingsSeeder::class);

        $start = $this->postJson('/chat/api/start', [])->assertOk();
        $uuid = $start->json('conversation.uuid');
        $this->assertNotEmpty($uuid);
        $this->assertGreaterThanOrEqual(2, count($start->json('messages')));

        $this->postJson('/chat/api/'.$uuid.'/messages', ['body' => 'Neha Kapoor'])
            ->assertOk()
            ->assertJsonPath('conversation.visitor_name', 'Neha Kapoor');

        $this->postJson('/chat/api/'.$uuid.'/messages', ['body' => '9876543210'])
            ->assertOk()
            ->assertJsonPath('conversation.visitor_phone', '9876543210');

        $this->postJson('/chat/api/'.$uuid.'/messages', ['body' => 'Do you stock Arnica 30C?'])
            ->assertOk();

        $conversation = ChatConversation::query()->where('uuid', $uuid)->first();
        $this->assertNotNull($conversation);
        $this->assertTrue($conversation->lead_notified);
        $this->assertGreaterThanOrEqual(6, $conversation->messages()->count());
        $this->assertTrue(
            ChatMessage::query()
                ->where('chat_conversation_id', $conversation->id)
                ->where('sender', 'visitor')
                ->where('body', 'Do you stock Arnica 30C?')
                ->exists()
        );

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Neha Kapoor',
            'contact' => '9876543210',
            'source' => 'chat',
        ]);
    }

    public function test_admin_can_view_and_reply_to_chat_history(): void
    {
        $this->seed(SiteSettingsSeeder::class);

        $conversation = ChatConversation::query()->create([
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'visitor_name' => 'Admin Test',
            'visitor_phone' => '9000011111',
            'status' => 'open',
            'last_message_at' => now(),
        ]);
        ChatMessage::query()->create([
            'chat_conversation_id' => $conversation->id,
            'sender' => 'visitor',
            'body' => 'Need shipping info',
        ]);

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get(route('admin.chats.index'))
            ->assertOk()
            ->assertSee('Admin Test', false);

        $this->actingAs($admin)
            ->get(route('admin.chats.show', $conversation))
            ->assertOk()
            ->assertSee('Need shipping info', false);

        $this->actingAs($admin)
            ->post(route('admin.chats.reply', $conversation), [
                'body' => 'We ship across India in 3-5 days.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('chat_messages', [
            'chat_conversation_id' => $conversation->id,
            'sender' => 'agent',
            'body' => 'We ship across India in 3-5 days.',
        ]);
    }
}
