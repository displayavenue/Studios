@extends('layouts.admin')
@section('title', $category->exists ? 'Edit category' : 'Add category')
@section('content')
<div class="admin-top"><h2>{{ $category->exists ? 'Edit category' : 'Add category' }}</h2></div>
<form method="post" action="{{ $category->exists ? route('admin.categories.update', $category) : route('admin.categories.store') }}" class="admin-form admin-card">
@csrf
@if($category->exists) @method('PUT') @endif
<label>Name <input name="name" value="{{ old('name', $category->name) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $category->slug) }}"></label>
<label>Description <textarea name="description">{{ old('description', $category->description) }}</textarea></label>
<label>Parent
<select name="parent_id">
<option value="">—</option>
@foreach($parents as $parent)
<option value="{{ $parent->id }}" @selected(old('parent_id', $category->parent_id)==$parent->id)>{{ $parent->name }}</option>
@endforeach
</select>
</label>
<label>Image media
<select name="image_media_id">
<option value="">—</option>
@foreach($media as $item)
<option value="{{ $item->id }}" @selected(old('image_media_id', $category->image_media_id)==$item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
</label>
<label>Status
<select name="status">
@foreach(['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $category->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="show_on_homepage" value="1" @checked(old('show_on_homepage', $category->show_on_homepage))> Show on homepage
</label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $category->sort_order ?? 0) }}"></label>
<label>SEO title <input name="seo_title" value="{{ old('seo_title', $category->seo_title) }}"></label>
<label>SEO description <textarea name="seo_description">{{ old('seo_description', $category->seo_description) }}</textarea></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.categories.index') }}">Cancel</a></div>
</form>
@endsection
