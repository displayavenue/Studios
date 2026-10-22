@extends('layouts.admin')
@section('title', 'Edit section')
@section('content')
<div class="admin-top"><h2>Edit section: {{ $section->key }}</h2></div>
<form method="post" action="{{ route('admin.homepage.update', $section) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Title <input name="title" value="{{ old('title', $section->title) }}"></label>
<label>Subtitle <textarea name="subtitle">{{ old('subtitle', $section->subtitle) }}</textarea></label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $section->sort_order) }}"></label>
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="is_enabled" value="1" @checked(old('is_enabled', $section->is_enabled))> Enabled
</label>
<label>Status
<select name="status">
@foreach(['draft','published'] as $s)
<option value="{{ $s }}" @selected(old('status', $section->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Payload JSON
<textarea name="payload_json" style="min-height:12rem;font-family:ui-monospace,monospace;">{{ old('payload_json', json_encode($section->payload ?? [], JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES)) }}</textarea>
</label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.homepage.index') }}">Cancel</a></div>
</form>
@endsection
