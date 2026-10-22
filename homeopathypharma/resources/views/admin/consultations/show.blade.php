@extends('layouts.admin')
@section('title', $consultation->number)
@section('content')
<div class="admin-top"><h2>{{ $consultation->number }}</h2></div>
<div class="admin-card" style="margin-bottom:1rem;">
<p><strong>Doctor:</strong> {{ $consultation->doctor?->full_name }}</p>
<p><strong>Patient:</strong> {{ $consultation->patient_name }} · {{ $consultation->patient_phone }} · {{ $consultation->patient_email }}</p>
<p><strong>Preferred window:</strong> {{ $consultation->preferred_window ?: '—' }}</p>
<p><strong>Concern:</strong> {{ $consultation->concern ?: '—' }}</p>
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
</form>
@endsection
