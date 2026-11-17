@extends('layouts.admin')

@section('title', ($product ? 'Edit' : 'Add').' product')
@section('content')
@php $isEdit = (bool) $product; @endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit product — '.$product['name'] : 'Add homeopathy product' }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form
    method="post"
    action="{{ $isEdit ? route('admin.health-explorer.products.update', $product['slug'] ?? $product['id']) : route('admin.health-explorer.products.store') }}"
    class="admin-form admin-card"
>
    @csrf
    @if ($isEdit) @method('PUT') @endif
    @unless ($isEdit)
        <label>Slug (optional) <input name="slug" value="{{ old('slug') }}"></label>
    @endunless
    <label>Name <input name="name" value="{{ old('name', $product['name'] ?? '') }}" required></label>
    <label>Ingredients <input name="ingredients" value="{{ old('ingredients', $product['ingredients'] ?? '') }}"></label>
    <label>Potency <input name="potency" value="{{ old('potency', $product['potency'] ?? '') }}"></label>
    <label>Manufacturer <input name="manufacturer" value="{{ old('manufacturer', $product['manufacturer'] ?? '') }}"></label>
    <label>Description <textarea name="description" rows="4">{{ old('description', $product['description'] ?? '') }}</textarea></label>
    <label>Traditional claims <textarea name="traditional_claims" rows="3">{{ old('traditional_claims', $product['traditional_claims'] ?? '') }}</textarea></label>
    <label>Evidence status <textarea name="evidence_status" rows="3">{{ old('evidence_status', $product['evidence_status'] ?? '') }}</textarea></label>
    <label>Safety warnings <textarea name="safety_warnings" rows="3">{{ old('safety_warnings', $product['safety_warnings'] ?? '') }}</textarea></label>
    <label>Contraindications <textarea name="contraindications" rows="3">{{ old('contraindications', $product['contraindications'] ?? '') }}</textarea></label>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $product['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $product['seo_description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save' : 'Create' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
