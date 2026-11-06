@extends('layouts.admin')
@section('title', $consultation->number)
@section('content')
<div class="admin-top"><h2>{{ $consultation->number }}</h2></div>
<div class="admin-card" style="margin-bottom:1rem;">
<p><strong>Submitted:</strong> {{ $consultation->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }} (Asia/Kolkata)</p>
<p><strong>Source:</strong> <code>{{ $consultation->source === 'homepage_banner' ? 'Homepage Book a Consultation' : ($consultation->source === 'doctor_page' ? 'Doctor page request' : ($consultation->source ?: '—')) }}</code></p>
<p><strong>Doctor:</strong> {{ $consultation->doctor?->full_name ?: 'Unassigned — assign a doctor when you contact the patient' }}</p>
<p><strong>Patient:</strong> {{ $consultation->patient_name }}
    · <a href="tel:{{ preg_replace('/\s+/', '', $consultation->patient_phone) }}">{{ $consultation->patient_phone }}</a>
    @if ($consultation->patient_email)
        · <a href="mailto:{{ $consultation->patient_email }}">{{ $consultation->patient_email }}</a>
    @endif
    · <a href="https://wa.me/{{ preg_replace('/\D+/', '', $consultation->patient_phone) }}" target="_blank" rel="noopener">WhatsApp</a>
</p>
<p><strong>Preferred window:</strong> {{ $consultation->preferred_window ?: '—' }}</p>
<p><strong>Concern:</strong></p>
<pre style="white-space:pre-wrap;background:#f6f3ec;padding:0.85rem;border-radius:0.5rem;">{{ $consultation->concern ?: '—' }}</pre>
@if ($consultation->admin_notes)
<p><strong>Submission notes:</strong></p>
<pre style="white-space:pre-wrap;background:#f6f3ec;padding:0.85rem;border-radius:0.5rem;">{{ $consultation->admin_notes }}</pre>
@endif
<p><strong>Fee:</strong> {{ $consultation->formattedFee() }}</p>
</div>
<form method="post" action="{{ route('admin.consultations.update', $consultation) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Status
<select name="status">
@foreach(['pending','contacted','scheduled','completed','cancelled'] as $s)
<option value="{{ $s }}" @selected($consultation->status===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Google Meet URL <input name="meeting_url" value="{{ old('meeting_url', $consultation->meeting_url) }}" placeholder="https://meet.google.com/..."></label>
<label>Scheduled at <input type="datetime-local" name="scheduled_at" value="{{ old('scheduled_at', optional($consultation->scheduled_at)->format('Y-m-d\TH:i')) }}"></label>
<label>Admin notes <textarea name="admin_notes">{{ old('admin_notes', $consultation->admin_notes) }}</textarea></label>
<button class="btn btn-primary" type="submit">Save</button>
<a class="btn btn-secondary" href="{{ route('admin.consultations.index') }}">Back</a>
</form>
@endsection
