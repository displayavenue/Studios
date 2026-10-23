@extends('layouts.admin')
@section('title', 'Consultation requests')
@section('content')
<div class="admin-top"><h2>Consultation requests</h2></div>
<div class="admin-card"><table class="admin-table">
<thead><tr><th>Number</th><th>Doctor</th><th>Patient</th><th>Fee</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse($requests as $req)
<tr>
<td>{{ $req->number }}</td>
<td>{{ $req->doctor?->full_name }}</td>
<td>{{ $req->patient_name }} · {{ $req->patient_phone }}</td>
<td>{{ $req->formattedFee() }}</td>
<td><span class="badge">{{ $req->status }}</span></td>
<td><a href="{{ route('admin.consultations.show', $req) }}">Open</a></td>
</tr>
@empty<tr><td colspan="6">No requests yet.</td></tr>@endforelse
</tbody></table></div>
{{ $requests->links() }}
@endsection
