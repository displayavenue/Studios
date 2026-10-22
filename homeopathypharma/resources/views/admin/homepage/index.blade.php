@extends('layouts.admin')
@section('title', 'Homepage sections')
@section('content')
<div class="admin-top"><h2>Homepage sections</h2></div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Key</th><th>Title</th><th>Order</th><th>Enabled</th><th>Status</th><th></th></tr></thead>
<tbody>
@foreach ($sections as $section)
<tr>
<td>{{ $section->key }}</td>
<td>{{ $section->title }}</td>
<td>{{ $section->sort_order }}</td>
<td>{{ $section->is_enabled ? 'Yes' : 'No' }}</td>
<td><span class="badge">{{ $section->status }}</span></td>
<td><a href="{{ route('admin.homepage.edit', $section) }}">Edit</a></td>
</tr>
@endforeach
</tbody>
</table>
</div>
@endsection
