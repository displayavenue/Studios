@extends('layouts.admin')
@section('title', 'A–Z Diseases')
@section('content')
<div class="admin-top">
    <div>
        <h2>A–Z Diseases</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Editable condition pages shown under Conditions → A to Z Diseases. Upload images via Media Library, then attach here.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('admin.conditions.create') }}">Add disease</a>
</div>

<form method="get" class="admin-actions" style="margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
    <input type="search" name="q" value="{{ $q }}" placeholder="Search title / category">
    <select name="status" onchange="this.form.submit()">
        <option value="">All statuses</option>
        @foreach (['draft','published','archived'] as $s)
            <option value="{{ $s }}" @selected($status === $s)>{{ $s }}</option>
        @endforeach
    </select>
    <button class="btn btn-secondary" type="submit">Filter</button>
</form>

<div class="admin-card">
<table class="admin-table">
<thead>
<tr>
    <th></th>
    <th>Title</th>
    <th>Category</th>
    <th>Status</th>
    <th></th>
</tr>
</thead>
<tbody>
@forelse ($conditions as $condition)
<tr>
    <td style="width:3.5rem;">
        <img src="{{ $condition->imageUrl() }}" alt="" width="44" height="44" style="object-fit:cover;border-radius:0.35rem;background:#eee;">
    </td>
    <td><strong>{{ $condition->title }}</strong><div class="admin-muted"><code>{{ $condition->slug }}</code></div></td>
    <td>{{ $condition->category }}</td>
    <td><span class="badge">{{ $condition->status }}</span></td>
    <td style="white-space:nowrap;">
        <a href="{{ route('admin.conditions.edit', $condition) }}">Edit</a>
        · <a href="{{ route('conditions.show', $condition->slug) }}" target="_blank" rel="noopener">View</a>
    </td>
</tr>
@empty
<tr><td colspan="5">No diseases yet. Seed the catalogue or add one.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $conditions->links() }}
@endsection
