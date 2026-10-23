@extends('layouts.admin')
@section('title', 'Categories')
@section('content')
<div class="admin-top"><h2>Categories</h2><a class="btn btn-primary" href="{{ route('admin.categories.create') }}">Add category</a></div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Name</th><th>Parent</th><th>Homepage</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($categories as $category)
<tr>
<td>{{ $category->name }}</td>
<td>{{ $category->parent?->name ?: '—' }}</td>
<td>{{ $category->show_on_homepage ? 'Yes' : 'No' }}</td>
<td><span class="badge">{{ $category->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.categories.edit', $category) }}">Edit</a>
<form method="post" action="{{ route('admin.categories.destroy', $category) }}" onsubmit="return confirm('Delete category?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="5">No categories yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $categories->links() }}
@endsection
