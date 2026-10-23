@extends('layouts.admin')
@section('title', 'Founders & Team')
@section('content')
<div class="admin-top"><h2>Founders &amp; Team</h2><a class="btn btn-primary" href="{{ route('admin.team.create') }}">Add profile</a></div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Name</th><th>Designation</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($members as $member)
<tr>
<td>{{ $member->name }}</td>
<td>{{ $member->designation }}</td>
<td><span class="badge">{{ $member->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.team.edit', $member) }}">Edit</a>
<form method="post" action="{{ route('admin.team.destroy', $member) }}" onsubmit="return confirm('Delete profile?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="4">No team profiles yet. Do not invent people — add only confirmed profiles.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $members->links() }}
@endsection
