@extends('layouts.admin')
@section('title', $condition->exists ? 'Edit disease' : 'Add disease')
@section('content')
<div class="admin-top"><h2>{{ $condition->exists ? 'Edit disease' : 'Add disease' }}</h2></div>
<form method="post" action="{{ $condition->exists ? route('admin.conditions.update', $condition) : route('admin.conditions.store') }}" class="admin-form admin-card">
@csrf
@if ($condition->exists) @method('PUT') @endif

<label>Title <input name="title" value="{{ old('title', $condition->title) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $condition->slug) }}" placeholder="auto from title"></label>
<label>Category
<input list="condition-categories" name="category" value="{{ old('category', $condition->category) }}" required>
<datalist id="condition-categories">
@foreach ($categories as $cat)
<option value="{{ $cat }}">
@endforeach
</datalist>
</label>

<label>Image (Media Library)
<select name="media_asset_id">
<option value="">— use fallback URL below —</option>
@foreach ($media as $item)
<option value="{{ $item->id }}" @selected((string) old('media_asset_id', $condition->media_asset_id) === (string) $item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
<span class="admin-muted" style="display:block;margin-top:0.35rem;font-size:0.85rem;">Upload in <a href="{{ route('admin.media.index') }}">Media Library</a> first, then select here.</span>
</label>
<label>Fallback image URL <input name="image_url" value="{{ old('image_url', $condition->image_url) }}"></label>
<label>Image alt text <input name="image_alt" value="{{ old('image_alt', $condition->image_alt) }}"></label>

<label>Snippet (card / SEO) <textarea name="snippet" rows="2" required>{{ old('snippet', $condition->snippet) }}</textarea></label>
<label>Short description <textarea name="short_description" rows="3" required>{{ old('short_description', $condition->short_description) }}</textarea></label>
<label>Long description <textarea name="long_description" rows="10" required>{{ old('long_description', $condition->long_description) }}</textarea></label>

<label>SEO title <input name="seo_title" value="{{ old('seo_title', $condition->seo_title) }}"></label>
<label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $condition->seo_description) }}</textarea></label>

<label>Status
<select name="status">
@foreach (['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $condition->status) === $s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Published at <input type="datetime-local" name="published_at" value="{{ old('published_at', optional($condition->published_at)->format('Y-m-d\TH:i')) }}"></label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $condition->sort_order ?? 0) }}"></label>
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="is_indexed" value="1" @checked(old('is_indexed', $condition->is_indexed ?? true))>
Index in search / sitemap
</label>

<div class="admin-actions">
<button class="btn btn-primary" type="submit">Save</button>
<a class="btn btn-secondary" href="{{ route('admin.conditions.index') }}">Back</a>
@if ($condition->exists)
<button class="btn btn-secondary" form="delete-condition" type="submit" onclick="return confirm('Delete this disease page?')">Delete</button>
@endif
</div>
</form>

@if ($condition->exists)
<form id="delete-condition" method="post" action="{{ route('admin.conditions.destroy', $condition) }}">
@csrf @method('DELETE')
</form>
@endif
@endsection
