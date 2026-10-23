@extends('layouts.admin')
@section('title', 'Edit '.$page->title)
@section('content')
<div class="admin-top"><h2>Edit {{ $page->title }}</h2></div>
<form method="post" action="{{ route('admin.policies.update', $page) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Title <input name="title" value="{{ old('title', $page->title) }}" required></label>
<label>Slug <input value="{{ $page->slug }}" disabled></label>
<label>Body <textarea name="body" rows="14">{{ old('body', $page->body) }}</textarea></label>
<label>Status
<select name="status">
@foreach(['draft','published'] as $s)
<option value="{{ $s }}" @selected(old('status', $page->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>SEO title <input name="seo_title" value="{{ old('seo_title', $page->seo_title) }}"></label>
<label>SEO description <textarea name="seo_description">{{ old('seo_description', $page->seo_description) }}</textarea></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.policies.index') }}">Cancel</a></div>
</form>
@endsection
