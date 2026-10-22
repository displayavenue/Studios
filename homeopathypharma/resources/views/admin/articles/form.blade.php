@extends('layouts.admin')
@section('title', $article->exists ? 'Edit article' : 'Add article')
@section('content')
<div class="admin-top"><h2>{{ $article->exists ? 'Edit article' : 'Add article' }}</h2></div>
<form method="post" action="{{ $article->exists ? route('admin.articles.update', $article) : route('admin.articles.store') }}" class="admin-form admin-card">
@csrf
@if($article->exists) @method('PUT') @endif
<label>Title <input name="title" value="{{ old('title', $article->title) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $article->slug) }}" placeholder="auto from title"></label>
<label>Category
<select name="article_category_id">
<option value="">—</option>
@foreach($categories as $category)
<option value="{{ $category->id }}" @selected(old('article_category_id', $article->article_category_id)==$category->id)>{{ $category->name }}</option>
@endforeach
</select>
</label>
<label>Excerpt <textarea name="excerpt">{{ old('excerpt', $article->excerpt) }}</textarea></label>
<label>Body <textarea name="body" rows="12">{{ old('body', $article->body) }}</textarea></label>
<label>Cover media
<select name="cover_media_id">
<option value="">—</option>
@foreach($media as $item)
<option value="{{ $item->id }}" @selected(old('cover_media_id', $article->cover_media_id)==$item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
</label>
<label>Author name (only if confirmed) <input name="author_name" value="{{ old('author_name', $article->author_name) }}"></label>
<label>Status
<select name="status">
@foreach(['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $article->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="is_featured" value="1" @checked(old('is_featured', $article->is_featured))> Featured
</label>
<label>SEO title <input name="seo_title" value="{{ old('seo_title', $article->seo_title) }}"></label>
<label>SEO description <textarea name="seo_description">{{ old('seo_description', $article->seo_description) }}</textarea></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.articles.index') }}">Cancel</a></div>
</form>
@endsection
