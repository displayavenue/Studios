@extends('layouts.admin')
@section('title', 'Edit page')
@section('content')
<div class="admin-top"><h2>Edit page: {{ $page->slug }}</h2></div>
<form method="post" action="{{ route('admin.pages.update', $page) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Title <input name="title" value="{{ old('title', $page->title) }}" required></label>
<label>SEO title <input name="seo_title" value="{{ old('seo_title', $page->seo_title) }}"></label>
<label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $page->seo_description) }}</textarea></label>
<label>Body (HTML allowed)
<textarea name="body" rows="16" style="font-family:ui-monospace,monospace;">{{ old('body', $page->body) }}</textarea>
</label>
<label>Status
<select name="status">
@foreach (['draft','published'] as $s)
<option value="{{ $s }}" @selected(old('status', $page->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<div class="admin-actions">
<button class="btn btn-primary" type="submit">Save page</button>
<a class="btn btn-secondary" href="{{ route('admin.pages.index') }}">Cancel</a>
</div>
</form>
@endsection
