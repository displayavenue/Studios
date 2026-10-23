@extends('layouts.admin')
@section('title', 'Doctors')
@section('content')
<div class="admin-top"><h2>Doctors</h2><a class="btn btn-primary" href="{{ route('admin.doctors.create') }}">Add doctor</a></div>
<p style="color:#68746D;">Only add real, confirmed practitioners. Publishing requires verification status = verified.</p>
<form method="get" class="admin-actions" style="margin-bottom:1rem;">
<select name="status" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
<option value="">All statuses</option>
@foreach (['draft','published','suspended','archived'] as $s)
<option value="{{ $s }}" @selected($status===$s)>{{ $s }}</option>
@endforeach
</select>
<button class="btn btn-secondary" type="submit">Filter</button>
</form>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Name</th><th>Verification</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($doctors as $doctor)
<tr>
<td>{{ $doctor->full_name }}</td>
<td><span class="badge">{{ $doctor->verification_status }}</span></td>
<td><span class="badge">{{ $doctor->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.doctors.edit', $doctor) }}">Edit</a>
<form method="post" action="{{ route('admin.doctors.destroy', $doctor) }}" onsubmit="return confirm('Delete doctor profile?');">@csrf @method('DELETE')
<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="4">No doctor profiles yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $doctors->links() }}
@endsection
