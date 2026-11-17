@extends('layouts.admin')

@section('title', ($item ? 'Edit' : 'Add').' mental topic')
@section('content')
@php $isEdit = (bool) $item; @endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit topic — '.$item['name'] : 'Add mental health topic' }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form
    method="post"
    action="{{ $isEdit ? route('admin.health-explorer.mental.update', $item['slug'] ?? $item['id']) : route('admin.health-explorer.mental.store') }}"
    class="admin-form admin-card"
>
    @csrf
    @if ($isEdit) @method('PUT') @endif
    @unless ($isEdit)
        <label>Slug (optional) <input name="slug" value="{{ old('slug') }}"></label>
    @endunless
    <label>Name <input name="name" value="{{ old('name', $item['name'] ?? '') }}" required></label>
    <label>Summary <textarea name="summary" rows="3">{{ old('summary', $item['summary'] ?? '') }}</textarea></label>
    <label>Description <textarea name="description" rows="5">{{ old('description', $item['description'] ?? '') }}</textarea></label>
    <label>Symptoms (one per line)
        <textarea name="symptoms" rows="4">{{ old('symptoms', implode("\n", $item['symptoms'] ?? [])) }}</textarea>
    </label>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $item['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $item['seo_description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save' : 'Create' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
