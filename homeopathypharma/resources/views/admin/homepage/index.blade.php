@extends('layouts.admin')
@section('title', 'Homepage sections')
@section('content')
<div class="admin-top">
    <div>
        <h2>Homepage sections</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;max-width:48rem;">
            Every storefront homepage block is listed here. Edit copy, CTAs, images, and form labels —
            the live site reads from these records. Lists (products, doctors, testimonials) are still
            managed in their own admin menus via “show on homepage”.
        </p>
    </div>
</div>
<div class="admin-card">
<table class="admin-table">
<thead>
<tr>
    <th>Section</th>
    <th>Key</th>
    <th>Title</th>
    <th>Order</th>
    <th>Enabled</th>
    <th>Status</th>
    <th></th>
</tr>
</thead>
<tbody>
@foreach ($sections as $section)
<tr>
    <td><strong>{{ $catalog[$section->key]['label'] ?? $section->key }}</strong></td>
    <td><code>{{ $section->key }}</code></td>
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
