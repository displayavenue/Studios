@extends('layouts.admin')
@section('title', $product->exists ? 'Edit product' : 'Add product')
@section('content')
<div class="admin-top"><h2>{{ $product->exists ? 'Edit product' : 'Add product' }}</h2></div>
<form method="post" action="{{ $product->exists ? route('admin.products.update', $product) : route('admin.products.store') }}" class="admin-form admin-card">
    @csrf
    @if ($product->exists) @method('PUT') @endif
    <label>Name <input name="name" value="{{ old('name', $product->name) }}" required></label>
    <label>Slug <input name="slug" value="{{ old('slug', $product->slug) }}" placeholder="auto from name"></label>
    <label>SKU <input name="sku" value="{{ old('sku', $product->sku) }}"></label>
    <label>Brand
        <select name="brand_id">
            <option value="">—</option>
            @foreach ($brands as $brand)
                <option value="{{ $brand->id }}" @selected(old('brand_id', $product->brand_id) == $brand->id)>{{ $brand->name }}</option>
            @endforeach
        </select>
    </label>
    <label>Short description <input name="short_description" value="{{ old('short_description', $product->short_description) }}"></label>
    <label>Description <textarea name="description">{{ old('description', $product->description) }}</textarea></label>
    <label>Regular price (INR) <input type="number" step="0.01" min="0" name="price_inr" value="{{ old('price_inr', $product->exists ? number_format($product->price_paise/100, 2, '.', '') : '') }}" required></label>
    <label>Sale price (INR, optional) <input type="number" step="0.01" min="0" name="sale_price_inr" value="{{ old('sale_price_inr', $product->sale_price_paise ? number_format($product->sale_price_paise/100, 2, '.', '') : '') }}"></label>
    <label>Stock qty <input type="number" min="0" name="stock_qty" value="{{ old('stock_qty', $product->stock_qty ?? 0) }}" required></label>
    <label>Stock status
        <select name="stock_status">
            @foreach (['in_stock','out_of_stock','backorder'] as $s)
                <option value="{{ $s }}" @selected(old('stock_status', $product->stock_status) === $s)>{{ $s }}</option>
            @endforeach
        </select>
    </label>
    <label>Package size <input name="package_size" value="{{ old('package_size', $product->package_size) }}"></label>
    <label>Ingredients <textarea name="ingredients">{{ old('ingredients', $product->ingredients) }}</textarea></label>
    <label>Directions <textarea name="directions">{{ old('directions', $product->directions) }}</textarea></label>
    <label>Warnings <textarea name="warnings">{{ old('warnings', $product->warnings) }}</textarea></label>
    <label>Manufacturer <input name="manufacturer" value="{{ old('manufacturer', $product->manufacturer) }}"></label>
    <label>Status
        <select name="status">
            @foreach (['draft','published','archived'] as $s)
                <option value="{{ $s }}" @selected(old('status', $product->status) === $s)>{{ $s }}</option>
            @endforeach
        </select>
    </label>
    <label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
        <input type="checkbox" name="is_featured" value="1" @checked(old('is_featured', $product->is_featured))> Featured on homepage
    </label>
    <fieldset>
        <legend>Categories</legend>
        @foreach ($categories as $category)
            <label style="display:flex;gap:0.45rem;align-items:center;font-weight:500;">
                <input type="checkbox" name="category_ids[]" value="{{ $category->id }}"
                    @checked(collect(old('category_ids', $product->categories->pluck('id')->all() ?? []))->contains($category->id))>
                {{ $category->name }}
            </label>
        @endforeach
    </fieldset>
    <fieldset>
        <legend>Images (from media library, first = primary)</legend>
        @forelse ($media as $item)
            <label style="display:flex;gap:0.45rem;align-items:center;font-weight:500;">
                <input type="checkbox" name="media_ids[]" value="{{ $item->id }}"
                    @checked(collect(old('media_ids', $product->images->pluck('media_asset_id')->all() ?? []))->contains($item->id))>
                #{{ $item->id }} {{ $item->original_name }}
            </label>
        @empty
            <p>Upload images in Media Library first.</p>
        @endforelse
    </fieldset>
    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $product->seo_title) }}"></label>
    <label>SEO description <textarea name="seo_description">{{ old('seo_description', $product->seo_description) }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save</button>
        <a class="btn btn-secondary" href="{{ route('admin.products.index') }}">Cancel</a>
    </div>
</form>
@endsection
