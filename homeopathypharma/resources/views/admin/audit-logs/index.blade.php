@extends('layouts.admin')
@section('title', 'Audit log')
@section('content')
<div class="admin-top"><h2>Audit log</h2></div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>When</th><th>User</th><th>Action</th><th>Subject</th><th>IP</th></tr></thead>
<tbody>
@forelse ($logs as $log)
<tr>
<td>{{ $log->created_at?->timezone('Asia/Kolkata')->format('Y-m-d H:i') }}</td>
<td>{{ $log->user?->email ?: '—' }}</td>
<td>{{ $log->action }}</td>
<td>
@if ($log->subject_type)
{{ class_basename($log->subject_type) }} #{{ $log->subject_id }}
@else
—
@endif
</td>
<td>{{ $log->ip_address ?: '—' }}</td>
</tr>
@empty
<tr><td colspan="5">No audit events yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $logs->links() }}
@endsection
