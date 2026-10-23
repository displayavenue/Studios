@extends('layouts.admin')
@section('title', 'Appointments')
@section('content')
<div class="admin-top"><h2>Appointments</h2></div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;">
<select name="status" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
<option value="">All</option>
@foreach (['pending','confirmed','cancelled','completed','rescheduled'] as $s)
<option value="{{ $s }}" @selected($status===$s)>{{ $s }}</option>
@endforeach
</select>
<button class="btn btn-secondary" type="submit">Filter</button>
</form>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Ref</th><th>Doctor</th><th>Patient</th><th>When</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($appointments as $appointment)
<tr>
<td>{{ $appointment->reference }}</td>
<td>{{ $appointment->doctor?->full_name }}</td>
<td>{{ $appointment->patient_name }}</td>
<td>{{ $appointment->starts_at->timezone('Asia/Kolkata')->format('d M Y H:i') }}</td>
<td><span class="badge">{{ $appointment->status }}</span></td>
<td><a href="{{ route('admin.appointments.show', $appointment) }}">View</a></td>
</tr>
@empty
<tr><td colspan="6">No appointments yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $appointments->links() }}
@endsection
