@extends('layouts.admin')
@section('title', 'Consultation requests')
@section('content')
<div class="admin-top">
    <div>
        <h2>Consultation requests</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Book a Consultation form submissions and doctor-page requests appear here.</p>
    </div>
</div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
    <select name="status" onchange="this.form.submit()">
        <option value="" @selected($status === '')>All statuses</option>
        @foreach (['pending','contacted','scheduled','completed','cancelled'] as $s)
            <option value="{{ $s }}" @selected($status === $s)>{{ $s }}</option>
        @endforeach
    </select>
</form>
<div class="admin-card"><table class="admin-table">
<thead><tr><th>When</th><th>Number</th><th>Doctor</th><th>Patient</th><th>Source</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse($requests as $req)
<tr>
<td>{{ $req->created_at?->timezone('Asia/Kolkata')->format('d M Y, h:i A') }}</td>
<td>{{ $req->number }}</td>
<td>{{ $req->doctor?->full_name ?: 'Unassigned' }}</td>
<td>{{ $req->patient_name }} · {{ $req->patient_phone }}</td>
<td><code>{{ $req->source === 'homepage_banner' ? 'Homepage banner' : ($req->source === 'doctor_page' ? 'Doctor page' : ($req->source ?: '—')) }}</code></td>
<td><span class="badge">{{ $req->status }}</span></td>
<td><a href="{{ route('admin.consultations.show', $req) }}">Open</a></td>
</tr>
@empty<tr><td colspan="7">No requests yet. Homepage “Book Now” submissions will show here.</td></tr>@endforelse
</tbody></table></div>
{{ $requests->links() }}
@endsection
