@extends('layouts.admin')

@section('title', 'Edit homeopathy product')
@section('content')

<div class="admin-top">
    <h2>Edit product — {{ $product['name'] }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form method="post" action="{{ route('admin.health-explorer.products.update', $product['slug'] ?? $product['id']) }}" class="admin-form admin-card">
    @csrf
    @method('PUT')
    <label>Name <input name="name" value="{{ old('name', $product['name']) }}" required></label>
    <label>Ingredients <input name="ingredients" value="{{ old('ingredients', $product['ingredients'] ?? '') }}"></label>
    <label>Potency <input name="potency" value="{{ old('potency', $product['potency'] ?? '') }}"></label>
    <label>Manufacturer <input name="manufacturer" value="{{ old('manufacturer', $product['manufacturer'] ?? '') }}"></label>
    <label>Description <textarea name="description" rows="3">{{ old('description', $product['description'] ?? '') }}</textarea></label>
    <label>Traditional claims <textarea name="traditional_claims" rows="3">{{ old('traditional_claims', $product['traditional_claims'] ?? '') }}</textarea></label>
    <label>Evidence status <textarea name="evidence_status" rows="3">{{ old('evidence_status', $product['evidence_status'] ?? '') }}</textarea></label>
    <label>Safety warnings <textarea name="safety_warnings" rows="3">{{ old('safety_warnings', $product['safety_warnings'] ?? '') }}</textarea></label>
    <label>Contraindications <textarea name="contraindications" rows="3">{{ old('contraindications', $product['contraindications'] ?? '') }}</textarea></label>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $product['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $product['seo_description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
