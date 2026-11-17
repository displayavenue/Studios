@extends('layouts.admin')

@section('title', ($disease ? 'Edit' : 'Add').' disease')
@section('content')
@php $isEdit = (bool) $disease; @endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit disease — '.$disease['name'] : 'Add disease' }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form
    method="post"
    action="{{ $isEdit ? route('admin.health-explorer.diseases.update', $disease['slug'] ?? $disease['id']) : route('admin.health-explorer.diseases.store') }}"
    class="admin-form admin-card"
>
    @csrf
    @if ($isEdit) @method('PUT') @endif
    @unless ($isEdit)
        <label>Slug (optional) <input name="slug" value="{{ old('slug') }}"></label>
    @endunless
    <label>Name <input name="name" value="{{ old('name', $disease['name'] ?? '') }}" required></label>
    <label>Summary <textarea name="summary" rows="3">{{ old('summary', $disease['summary'] ?? '') }}</textarea></label>
    <label>Description <textarea name="description" rows="5">{{ old('description', $disease['description'] ?? '') }}</textarea></label>
    <label>Symptoms (one per line)
        <textarea name="symptoms" rows="4">{{ old('symptoms', implode("\n", $disease['symptoms'] ?? [])) }}</textarea>
    </label>
    <label>Related organ ids (comma-separated)
        <input name="organ_ids" value="{{ old('organ_ids', implode(', ', $disease['organ_ids'] ?? [])) }}" placeholder="heart, lungs">
        <small style="color:#68746d;">Available: {{ collect($organs)->pluck('id')->implode(', ') }}</small>
    </label>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $disease['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $disease['seo_description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save' : 'Create' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
