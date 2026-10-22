@extends('layouts.admin')
@section('title', 'Article categories')
@section('content')
<div class="admin-top">
    <h2>Article categories</h2>
    <a class="btn btn-primary" href="{{ route('admin.article-categories.create') }}">Add category</a>
</div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Name</th><th>Status</th><th>Sort</th><th></th></tr></thead>
<tbody>
@forelse ($categories as $category)
<tr>
<td>{{ $category->name }}</td>
<td><span class="badge">{{ $category->status }}</span></td>
<td>{{ $category->sort_order }}</td>
<td class="admin-actions">
<a href="{{ route('admin.article-categories.edit', $category) }}">Edit</a>
<form method="post" action="{{ route('admin.article-categories.destroy', $category) }}" onsubmit="return confirm('Delete category?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="4">No categories yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $categories->links() }}
@endsection
