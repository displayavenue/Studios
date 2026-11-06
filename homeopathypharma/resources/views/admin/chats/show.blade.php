@extends('layouts.admin')
@section('title', 'Chat — '.$conversation->displayName())
@section('content')
<div class="admin-top">
    <div>
        <h2>Chat with {{ $conversation->displayName() }}</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">
            Phone:
            @if ($conversation->visitor_phone)
                <a href="tel:{{ preg_replace('/\s+/', '', $conversation->visitor_phone) }}">{{ $conversation->visitor_phone }}</a>
                · <a href="https://wa.me/{{ preg_replace('/\D+/', '', $conversation->visitor_phone) }}" target="_blank" rel="noopener">WhatsApp</a>
            @else
                not shared yet
            @endif
            · Status: {{ $conversation->status }}
        </p>
    </div>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <div style="display:grid;gap:0.65rem;max-height:28rem;overflow:auto;padding:0.25rem;">
        @foreach ($conversation->messages as $message)
            @php
                $isVisitor = $message->sender === 'visitor';
                $isAgent = $message->sender === 'agent';
            @endphp
            <div style="display:flex;justify-content:{{ $isVisitor ? 'flex-end' : 'flex-start' }};">
                <div style="max-width:min(100%,28rem);padding:0.65rem 0.8rem;border-radius:0.65rem;background:{{ $isVisitor ? '#0b5143' : ($isAgent ? '#146b55' : '#d7ebe1') }};color:{{ $isVisitor || $isAgent ? '#f7faf8' : '#1c2a24' }};">
                    <div style="font-size:0.72rem;opacity:0.8;margin-bottom:0.2rem;">
                        {{ $isVisitor ? 'Visitor' : ($isAgent ? 'Team' : 'System') }}
                        · {{ $message->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }}
                    </div>
                    <div style="white-space:pre-wrap;">{{ $message->body }}</div>
                </div>
            </div>
        @endforeach
    </div>
</div>

<div class="admin-card admin-form">
    <h3 style="margin-top:0;">Reply in chat</h3>
    <form method="post" action="{{ route('admin.chats.reply', $conversation) }}">
        @csrf
        <label>Message
            <textarea name="body" rows="4" required maxlength="5000" placeholder="Type your reply to the visitor…"></textarea>
        </label>
        <div class="admin-actions">
            <button class="btn btn-primary" type="submit">Send reply</button>
            <a class="btn btn-secondary" href="{{ route('admin.chats.index') }}">Back to chats</a>
        </div>
    </form>

    <form method="post" action="{{ route('admin.chats.update', $conversation) }}" style="margin-top:1rem;">
        @csrf @method('PUT')
        <label>Status
            <select name="status">
                @foreach (['open','closed'] as $s)
                    <option value="{{ $s }}" @selected($conversation->status === $s)>{{ $s }}</option>
                @endforeach
            </select>
        </label>
        <button class="btn btn-secondary" type="submit">Update status</button>
    </form>
</div>
@endsection
