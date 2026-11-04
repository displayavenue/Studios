@extends('layouts.admin')

@section('title', 'Edit organ')
@section('content')

<div class="admin-top">
    <h2>Edit organ — {{ $organ['name'] }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form method="post" action="{{ route('admin.health-explorer.organs.update', $organ['slug'] ?? $organ['id']) }}" class="admin-form admin-card">
    @csrf
    @method('PUT')
    <label>Name <input name="name" value="{{ old('name', $organ['name']) }}" required></label>
    <label>Summary <textarea name="summary" rows="3">{{ old('summary', $organ['summary'] ?? '') }}</textarea></label>
    <label>Function <textarea name="function" rows="3">{{ old('function', $organ['function'] ?? '') }}</textarea></label>
    <label>Description <textarea name="description" rows="5">{{ old('description', $organ['description'] ?? '') }}</textarea></label>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $organ['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $organ['seo_description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
