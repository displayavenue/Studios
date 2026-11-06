<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Services\LeadAlertService;
use App\Services\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatApiController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $uuid = (string) $request->input('uuid', '');
        $conversation = null;

        if ($uuid !== '' && Str::isUuid($uuid)) {
            $conversation = ChatConversation::query()->where('uuid', $uuid)->first();
        }

        if (! $conversation) {
            $conversation = ChatConversation::query()->create([
                'uuid' => (string) Str::uuid(),
                'status' => 'open',
                'ip_address' => $request->ip(),
                'last_message_at' => now(),
            ]);

            $this->addMessage($conversation, 'system', 'Have a question? We are here to help.');
            $this->addMessage($conversation, 'system', 'Please share your name so we can assist you.');
        }

        return response()->json($this->payload($conversation->fresh('messages')));
    }

    public function show(string $uuid): JsonResponse
    {
        $conversation = ChatConversation::query()->where('uuid', $uuid)->with('messages')->firstOrFail();

        return response()->json($this->payload($conversation));
    }

    public function messages(Request $request, string $uuid): JsonResponse
    {
        $conversation = ChatConversation::query()->where('uuid', $uuid)->firstOrFail();
        $afterId = (int) $request->query('after_id', 0);

        $messages = ChatMessage::query()
            ->where('chat_conversation_id', $conversation->id)
            ->when($afterId > 0, fn ($q) => $q->where('id', '>', $afterId))
            ->orderBy('id')
            ->get();

        return response()->json([
            'conversation' => $this->conversationMeta($conversation),
            'messages' => $messages->map(fn (ChatMessage $m) => $this->messagePayload($m))->values(),
        ]);
    }

    public function send(Request $request, string $uuid, SiteSettings $settings, LeadAlertService $alerts): JsonResponse
    {
        $conversation = ChatConversation::query()->where('uuid', $uuid)->firstOrFail();

        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $body = trim($data['body']);
        if ($body === '') {
            return response()->json(['message' => 'Message required.'], 422);
        }

        $visitorMessage = $this->addMessage($conversation, 'visitor', $body);
        $autoReplies = [];

        // Guided intake, then open chat — every line stays in history.
        if (! filled($conversation->visitor_name)) {
            $conversation->visitor_name = Str::limit($body, 120, '');
            $conversation->save();
            $autoReplies[] = $this->addMessage(
                $conversation,
                'system',
                'Thanks, '.$conversation->visitor_name.'. Please share your mobile number.'
            );
        } elseif (! filled($conversation->visitor_phone)) {
            $digits = preg_replace('/\D+/', '', $body) ?: '';
            if (strlen($digits) < 10) {
                $autoReplies[] = $this->addMessage(
                    $conversation,
                    'system',
                    'Please enter a valid mobile number with at least 10 digits.'
                );
            } else {
                $conversation->visitor_phone = Str::limit($body, 190, '');
                $conversation->save();
                $autoReplies[] = $this->addMessage(
                    $conversation,
                    'system',
                    'Thank you. How can we help you today?'
                );
            }
        } else {
            $autoReplies[] = $this->addMessage(
                $conversation,
                'system',
                'Thank you. Our team has received your message and will reply here shortly.'
            );

            if (! $conversation->lead_notified) {
                try {
                    $lead = \App\Models\ContactMessage::query()->create([
                        'name' => $conversation->visitor_name ?: 'Chat visitor',
                        'contact' => $conversation->visitor_phone ?: 'n/a',
                        'message' => '[Chat '.$conversation->uuid.'] '.$body,
                        'consent' => true,
                        'status' => 'new',
                        'source' => 'chat',
                        'ip_address' => $request->ip(),
                    ]);
                    $alerts->alert($lead);
                    $conversation->forceFill(['lead_notified' => true])->save();
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        $conversation->refresh()->load('messages');

        return response()->json([
            'conversation' => $this->conversationMeta($conversation),
            'message' => $this->messagePayload($visitorMessage),
            'auto_replies' => collect($autoReplies)->map(fn (ChatMessage $m) => $this->messagePayload($m))->values(),
            'whatsapp_url' => $settings->whatsappUrl('Hi HOMEOPATHY PHARMA, I have a question.'),
        ]);
    }

    private function addMessage(ChatConversation $conversation, string $sender, string $body): ChatMessage
    {
        $message = ChatMessage::query()->create([
            'chat_conversation_id' => $conversation->id,
            'sender' => $sender,
            'body' => $body,
        ]);

        $conversation->forceFill(['last_message_at' => now()])->save();

        return $message;
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(ChatConversation $conversation): array
    {
        return [
            'conversation' => $this->conversationMeta($conversation),
            'messages' => $conversation->messages
                ->map(fn (ChatMessage $m) => $this->messagePayload($m))
                ->values(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function conversationMeta(ChatConversation $conversation): array
    {
        return [
            'uuid' => $conversation->uuid,
            'visitor_name' => $conversation->visitor_name,
            'visitor_phone' => $conversation->visitor_phone,
            'status' => $conversation->status,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function messagePayload(ChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'sender' => $message->sender,
            'body' => $message->body,
            'created_at' => $message->created_at?->timezone('Asia/Kolkata')->format('h:i A'),
            'created_at_iso' => $message->created_at?->toIso8601String(),
        ];
    }
}
