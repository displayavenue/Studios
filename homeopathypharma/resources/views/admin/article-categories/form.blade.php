@extends('layouts.admin')
@section('title', $category->exists ? 'Edit article category' : 'Add article category')
@section('content')
<div class="admin-top"><h2>{{ $category->exists ? 'Edit article category' : 'Add article category' }}</h2></div>
<form method="post" action="{{ $category->exists ? route('admin.article-categories.update', $category) : route('admin.article-categories.store') }}" class="admin-form admin-card">
@csrf
@if($category->exists) @method('PUT') @endif
<label>Name <input name="name" value="{{ old('name', $category->name) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $category->slug) }}"></label>
<label>Description <textarea name="description">{{ old('description', $category->description) }}</textarea></label>
<label>Status
<select name="status">
@foreach(['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $category->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $category->sort_order ?? 0) }}"></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.article-categories.index') }}">Cancel</a></div>
</form>
@endsection
