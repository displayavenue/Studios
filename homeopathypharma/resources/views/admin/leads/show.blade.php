@extends('layouts.admin')
@php
    $isChat = $lead->source === 'chat';
    $sourceLabel = match ($lead->source) {
        'doctor' => 'Talk to a Doctor',
        'chat' => 'Homepage chat',
        'contact' => 'Contact page',
        default => $lead->source ?: 'contact',
    };
@endphp
@section('title', ($isChat ? 'Chat' : 'Lead').' #'.$lead->id)
@section('content')
<div class="admin-top">
    <h2>{{ $isChat ? 'Chat enquiry' : 'Lead' }} — {{ $lead->name }}</h2>
</div>
<div class="admin-card admin-form">
    <p><strong>Submitted:</strong> {{ $lead->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }} (Asia/Kolkata)</p>
    <p><strong>Source:</strong> {{ $sourceLabel }}</p>
    <p><strong>Name:</strong> {{ $lead->name }}</p>
    <p><strong>Mobile / contact:</strong> <a href="tel:{{ preg_replace('/\s+/', '', $lead->contact) }}">{{ $lead->contact }}</a>
        · <a href="https://wa.me/{{ preg_replace('/\D+/', '', $lead->contact) }}" target="_blank" rel="noopener">WhatsApp customer</a>
    </p>
    <p><strong>{{ $isChat ? 'What they asked' : 'Message / concern' }}:</strong></p>
    <pre style="white-space:pre-wrap;background:#f6f3ec;padding:0.85rem;border-radius:0.5rem;">{{ $lead->message }}</pre>

    <form method="post" action="{{ route('admin.leads.update', $lead) }}" class="admin-form" style="margin-top:1rem;">
        @csrf @method('PUT')
        <label>Status
            <select name="status">
                @foreach (['new','reviewed','archived'] as $s)
                    <option value="{{ $s }}" @selected($lead->status === $s)>{{ $s }}</option>
                @endforeach
            </select>
        </label>
        <div class="admin-actions">
            <button class="btn btn-primary" type="submit">Save</button>
            <a class="btn btn-secondary" href="{{ route('admin.leads.index', $isChat ? ['source' => 'chat', 'status' => 'all'] : []) }}">
                {{ $isChat ? 'Back to chats' : 'Back to leads' }}
            </a>
        </div>
    </form>
</div>
@endsection
