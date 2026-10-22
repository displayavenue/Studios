@extends('layouts.admin')
@section('title', 'Appointment '.$appointment->reference)
@section('content')
<div class="admin-top"><h2>{{ $appointment->reference }}</h2></div>
<div class="admin-card" style="margin-bottom:1rem;">
<p><strong>Doctor:</strong> {{ $appointment->doctor?->full_name }}</p>
<p><strong>Patient:</strong> {{ $appointment->patient_name }} · {{ $appointment->patient_phone }}</p>
<p><strong>When:</strong> {{ $appointment->starts_at->timezone('Asia/Kolkata')->format('d M Y H:i') }} – {{ $appointment->ends_at->timezone('Asia/Kolkata')->format('H:i') }}</p>
<p><strong>Mode:</strong> {{ $appointment->consultation_mode }}</p>
<p><strong>Status:</strong> {{ $appointment->status }}</p>
@if ($appointment->meeting_provider)
<p><strong>Meeting provider:</strong> {{ $appointment->meeting_provider }}</p>
@endif
</div>
<form method="post" action="{{ route('admin.appointments.update', $appointment) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Status
<select name="status">
@foreach (['pending','confirmed','cancelled','completed','rescheduled'] as $s)
<option value="{{ $s }}" @selected($appointment->status===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Cancellation reason <input name="cancellation_reason" value="{{ old('cancellation_reason', $appointment->cancellation_reason) }}"></label>
<button class="btn btn-primary" type="submit">Update</button>
</form>
@endsection
