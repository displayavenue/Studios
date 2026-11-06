@extends('layouts.admin')
@section('title', $source === 'chat' ? 'Chats' : 'Leads')
@section('content')
@php
    $isChatInbox = $source === 'chat';
    $sourceLabel = static function (?string $value): string {
        return match ($value) {
            'doctor' => 'Talk to a Doctor',
            'chat' => 'Homepage chat',
            'contact' => 'Contact page',
            default => $value ?: 'contact',
        };
    };
@endphp
<div class="admin-top">
    <div>
        <h2>{{ $isChatInbox ? 'Chats' : 'Leads' }}</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">
            @if ($isChatInbox)
                Messages from the homepage chat icon appear here. See who asked what and follow up by phone or WhatsApp. {{ $newCount }} new leads overall.
            @else
                Talk to a Doctor, homepage chat, and contact page submissions appear here instantly. Book a Consultation goes to Consult requests. {{ $newCount }} new.
            @endif
        </p>
    </div>
</div>

<form method="get" class="admin-actions" style="margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
    <select name="status" onchange="this.form.submit()">
        @foreach (['new' => 'New', 'reviewed' => 'Reviewed', 'archived' => 'Archived', 'all' => 'All'] as $value => $label)
            <option value="{{ $value }}" @selected($status === $value)>{{ $label }}</option>
        @endforeach
    </select>
    <select name="source" onchange="this.form.submit()">
        <option value="">All sources</option>
        <option value="doctor" @selected($source === 'doctor')>Talk to a Doctor</option>
        <option value="chat" @selected($source === 'chat')>Homepage chat</option>
        <option value="contact" @selected($source === 'contact')>Contact page</option>
    </select>
</form>

<div class="admin-card">
<table class="admin-table">
<thead>
<tr>
    <th>When</th>
    <th>Name</th>
    <th>Contact</th>
    <th>Asked about</th>
    <th>Source</th>
    <th>Status</th>
    <th></th>
</tr>
</thead>
<tbody>
@forelse ($leads as $lead)
@php
    $preview = trim(preg_replace('/^\\[[^\\]]+\\]\\s*/', '', (string) $lead->message));
    $preview = \Illuminate\Support\Str::limit($preview, 90);
@endphp
<tr>
    <td>{{ $lead->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }}</td>
    <td><strong>{{ $lead->name }}</strong></td>
    <td><a href="tel:{{ preg_replace('/\s+/', '', $lead->contact) }}">{{ $lead->contact }}</a></td>
    <td style="max-width:18rem;">{{ $preview }}</td>
    <td>{{ $sourceLabel($lead->source) }}</td>
    <td><span class="badge">{{ $lead->status }}</span></td>
    <td><a href="{{ route('admin.leads.show', $lead) }}">Open</a></td>
</tr>
@empty
<tr><td colspan="7">{{ $isChatInbox ? 'No chat messages yet.' : 'No leads yet. Submissions from the homepage form will show here.' }}</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $leads->links() }}
@endsection
