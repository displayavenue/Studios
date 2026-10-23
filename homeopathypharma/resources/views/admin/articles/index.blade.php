@extends('layouts.admin')
@section('title', 'Articles')
@section('content')
<div class="admin-top">
    <h2>Health Library Articles</h2>
    <div class="admin-actions">
        <a class="btn btn-secondary" href="{{ route('admin.article-categories.index') }}">Categories</a>
        <a class="btn btn-primary" href="{{ route('admin.articles.create') }}">Add article</a>
    </div>
</div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Featured</th><th></th></tr></thead>
<tbody>
@forelse ($articles as $article)
<tr>
<td>{{ $article->title }}</td>
<td>{{ $article->category?->name ?: '—' }}</td>
<td><span class="badge">{{ $article->status }}</span></td>
<td>{{ $article->is_featured ? 'Yes' : 'No' }}</td>
<td class="admin-actions">
<a href="{{ route('admin.articles.edit', $article) }}">Edit</a>
<form method="post" action="{{ route('admin.articles.destroy', $article) }}" onsubmit="return confirm('Delete article?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="5">No articles yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $articles->links() }}
@endsection
