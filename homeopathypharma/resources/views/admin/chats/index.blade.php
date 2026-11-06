@extends('layouts.admin')
@section('title', 'Chats')
@section('content')
<div class="admin-top">
    <div>
        <h2>Chats</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Full chat history for every visitor. {{ $openCount }} open.</p>
    </div>
</div>

<form method="get" class="admin-actions" style="margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
    <select name="status" onchange="this.form.submit()">
        @foreach (['open' => 'Open', 'closed' => 'Closed', 'all' => 'All'] as $value => $label)
            <option value="{{ $value }}" @selected($status === $value)>{{ $label }}</option>
        @endforeach
    </select>
</form>

<div class="admin-card">
<table class="admin-table">
<thead>
<tr>
    <th>Started</th>
    <th>Visitor</th>
    <th>Phone</th>
    <th>Messages</th>
    <th>Last activity</th>
    <th>Status</th>
    <th></th>
</tr>
</thead>
<tbody>
@forelse ($conversations as $conversation)
<tr>
    <td>{{ $conversation->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }}</td>
    <td><strong>{{ $conversation->displayName() }}</strong></td>
    <td>
        @if ($conversation->visitor_phone)
            <a href="tel:{{ preg_replace('/\s+/', '', $conversation->visitor_phone) }}">{{ $conversation->visitor_phone }}</a>
        @else
            <span class="admin-muted">—</span>
        @endif
    </td>
    <td>{{ $conversation->messages_count }}</td>
    <td>{{ $conversation->last_message_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') ?: '—' }}</td>
    <td><span class="badge">{{ $conversation->status }}</span></td>
    <td><a href="{{ route('admin.chats.show', $conversation) }}">Open history</a></td>
</tr>
@empty
<tr><td colspan="7">No chats yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $conversations->links() }}
@endsection
