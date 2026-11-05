@extends('layouts.admin')
@section('title', 'Content pages')
@section('content')
<div class="admin-top">
    <div>
        <h2>Content pages</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Edit About, Consult, Contact, and other static page copy shown on the storefront.</p>
    </div>
</div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Title</th><th>Slug</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($pages as $page)
<tr>
    <td>{{ $page->title }}</td>
    <td><code>{{ $page->slug }}</code></td>
    <td><span class="badge">{{ $page->status }}</span></td>
    <td><a href="{{ route('admin.pages.edit', $page) }}">Edit</a></td>
</tr>
@empty
<tr><td colspan="4">No content pages yet. Run <code>php artisan db:seed --class=ContentPageSeeder</code>.</td></tr>
@endforelse
</tbody>
</table>
</div>
@endsection
