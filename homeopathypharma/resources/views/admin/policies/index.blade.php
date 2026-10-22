@extends('layouts.admin')
@section('title', 'Policies')
@section('content')
<div class="admin-top"><h2>Policy pages</h2></div>
<p style="color:#68746D;margin-bottom:1rem;">Draft policies stay private until published. Seeded pages are templates for legal review — not legal advice.</p>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Title</th><th>Key</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($pages as $page)
<tr>
<td>{{ $page->title }}</td>
<td>{{ $page->key }}</td>
<td><span class="badge">{{ $page->status }}</span></td>
<td class="admin-actions"><a href="{{ route('admin.policies.edit', $page) }}">Edit</a></td>
</tr>
@empty
<tr><td colspan="4">No policy pages. Run seeders.</td></tr>
@endforelse
</tbody>
</table>
</div>
@endsection
