<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ChatController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', 'open');

        $conversations = ChatConversation::query()
            ->withCount('messages')
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate(30)
            ->withQueryString();

        return view('admin.chats.index', [
            'conversations' => $conversations,
            'status' => $status,
            'openCount' => ChatConversation::query()->where('status', 'open')->count(),
        ]);
    }

    public function show(ChatConversation $chat): View
    {
        $chat->load('messages');

        return view('admin.chats.show', ['conversation' => $chat]);
    }

    public function reply(Request $request, ChatConversation $chat): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        ChatMessage::query()->create([
            'chat_conversation_id' => $chat->id,
            'sender' => 'agent',
            'body' => trim($data['body']),
        ]);

        $chat->forceFill([
            'last_message_at' => now(),
            'status' => 'open',
        ])->save();

        return back()->with('status', 'Reply sent to visitor chat.');
    }

    public function update(Request $request, ChatConversation $chat): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:open,closed'],
        ]);

        $chat->update(['status' => $data['status']]);

        return back()->with('status', 'Chat updated.');
    }
}
