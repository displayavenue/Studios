@extends('layouts.admin')
@section('title', $product->exists ? 'Edit product' : 'Add product')
@section('content')
@php
    $selectedIds = collect(old('media_ids', $product->images->pluck('media_asset_id')->all() ?? []))->map(fn ($id) => (int) $id)->values();
    $primaryMedia = null;
    if ($selectedIds->isNotEmpty()) {
        $firstId = $selectedIds->first();
        $primaryMedia = $attachedMedia->get($firstId) ?: $libraryMedia->firstWhere('id', $firstId);
    }
    $marketInr = old('price_inr', $product->exists ? number_format($product->price_paise / 100, 2, '.', '') : '');
    $saleInr = old('sale_price_inr', $product->sale_price_paise ? number_format($product->sale_price_paise / 100, 2, '.', '') : '');
    $brandName = optional($brands->firstWhere('id', old('brand_id', $product->brand_id)))->name ?? ($product->brand->name ?? 'Brand');
@endphp
<div class="admin-top">
    <h2>{{ $product->exists ? 'Edit product' : 'Add product' }}</h2>
    <div class="admin-actions">
        @if ($product->exists && $product->status === 'published')
            <a class="btn btn-secondary" href="{{ route('product.show', $product->slug) }}" target="_blank" rel="noopener">View on site</a>
        @endif
        <a class="btn btn-secondary" href="{{ route('admin.products.index') }}">All products</a>
    </div>
</div>

@if (session('status'))
    <div class="admin-card" style="margin-bottom:1rem;border-color:#b7d7c4;background:#f3faf5;">{{ session('status') }}</div>
@endif

<form method="post" action="{{ $product->exists ? route('admin.products.update', $product) : route('admin.products.store') }}" class="admin-form admin-product-form" data-hp-product-form>
    @csrf
    @if ($product->exists) @method('PUT') @endif

    <div class="admin-product-layout">
        <div class="admin-product-main">
            <section class="admin-card admin-product-section">
                <h3>Basics</h3>
                <label>Name <input name="name" value="{{ old('name', $product->name) }}" required data-hp-product-name></label>
                <label>Slug <input name="slug" value="{{ old('slug', $product->slug) }}" placeholder="auto from name"></label>
                <label>SKU <input name="sku" value="{{ old('sku', $product->sku) }}"></label>
                <label>Brand
                    <select name="brand_id" data-hp-product-brand>
                        <option value="">—</option>
                        @foreach ($brands as $brand)
                            <option value="{{ $brand->id }}" @selected(old('brand_id', $product->brand_id) == $brand->id)>{{ $brand->name }}</option>
                        @endforeach
                    </select>
                </label>
                <label>Short description <input name="short_description" value="{{ old('short_description', $product->short_description) }}"></label>
                <label>Description <textarea name="description" rows="4">{{ old('description', $product->description) }}</textarea></label>
                <label>Package size <input name="package_size" value="{{ old('package_size', $product->package_size) }}" data-hp-product-package placeholder="e.g. 30 ml"></label>
                <label>Manufacturer <input name="manufacturer" value="{{ old('manufacturer', $product->manufacturer) }}"></label>
            </section>

            <section class="admin-card admin-product-section">
                <h3>Pricing</h3>
                <p class="admin-muted" style="margin-top:0;">Market / MRP is the crossed-out price. Sale price is what customers pay when a sale is active.</p>
                <div class="admin-product-price-grid">
                    <label>Market / MRP (INR)
                        <input type="number" step="0.01" min="0" name="price_inr" value="{{ $marketInr }}" required data-hp-product-mrp>
                    </label>
                    <label>Sale price (INR, optional)
                        <input type="number" step="0.01" min="0" name="sale_price_inr" value="{{ $saleInr }}" data-hp-product-sale>
                    </label>
                    <div class="admin-product-discount" data-hp-product-discount>
                        <span class="admin-product-discount__label">Discount</span>
                        <strong data-hp-product-discount-value>—</strong>
                    </div>
                </div>
                <div class="admin-product-price-grid">
                    <label>Sale starts
                        <input type="datetime-local" name="sale_starts_at_input" value="{{ old('sale_starts_at_input', optional($product->sale_starts_at)->format('Y-m-d\TH:i')) }}">
                    </label>
                    <label>Sale ends
                        <input type="datetime-local" name="sale_ends_at_input" value="{{ old('sale_ends_at_input', optional($product->sale_ends_at)->format('Y-m-d\TH:i')) }}">
                    </label>
                </div>
                <p class="admin-muted">Leave sale dates empty for an open-ended sale while a sale price is set.</p>
            </section>

            <section class="admin-card admin-product-section">
                <h3>Inventory &amp; status</h3>
                <div class="admin-product-price-grid">
                    <label>Stock qty <input type="number" min="0" name="stock_qty" value="{{ old('stock_qty', $product->stock_qty ?? 0) }}" required></label>
                    <label>Stock status
                        <select name="stock_status">
                            @foreach (['in_stock','out_of_stock','backorder'] as $s)
                                <option value="{{ $s }}" @selected(old('stock_status', $product->stock_status) === $s)>{{ str_replace('_', ' ', $s) }}</option>
                            @endforeach
                        </select>
                    </label>
                    <label>Status
                        <select name="status">
                            @foreach (['draft','published','archived'] as $s)
                                <option value="{{ $s }}" @selected(old('status', $product->status) === $s)>{{ $s }}</option>
                            @endforeach
                        </select>
                    </label>
                </div>
                <div class="admin-product-flags">
                    <label class="admin-product-flag">
                        <input type="checkbox" name="is_featured" value="1" @checked(old('is_featured', $product->is_featured))>
                        <span>
                            <strong>Popular medicines</strong>
                            <small>Show in Popular Homeopathic Medicines on the homepage</small>
                        </span>
                    </label>
                    <label class="admin-product-flag">
                        <input type="checkbox" name="is_super_saving" value="1" @checked(old('is_super_saving', $product->is_super_saving))>
                        <span>
                            <strong>Super Saving Deals</strong>
                            <small>Show in Super Saving Deals just under Popular on the homepage</small>
                        </span>
                    </label>
                </div>
            </section>

            <section class="admin-card admin-product-section">
                <h3>Details</h3>
                <label>Ingredients <textarea name="ingredients" rows="3">{{ old('ingredients', $product->ingredients) }}</textarea></label>
                <label>Directions <textarea name="directions" rows="3">{{ old('directions', $product->directions) }}</textarea></label>
                <label>Warnings <textarea name="warnings" rows="2">{{ old('warnings', $product->warnings) }}</textarea></label>
                <fieldset>
                    <legend>Categories</legend>
                    <div class="admin-product-check-grid">
                        @foreach ($categories as $category)
                            <label style="display:flex;gap:0.45rem;align-items:center;font-weight:500;">
                                <input type="checkbox" name="category_ids[]" value="{{ $category->id }}"
                                    @checked(collect(old('category_ids', $product->categories->pluck('id')->all() ?? []))->contains($category->id))>
                                {{ $category->name }}
                            </label>
                        @endforeach
                    </div>
                </fieldset>
                <label>SEO title <input name="seo_title" value="{{ old('seo_title', $product->seo_title) }}"></label>
                <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $product->seo_description) }}</textarea></label>
            </section>
        </div>

        <aside class="admin-product-side">
            <section class="admin-card admin-product-section">
                <h3>Frontend card preview</h3>
                <p class="admin-muted" style="margin-top:0;">Same layout as the shop product card. Adjust the primary image to see the crop fill this box.</p>
                <div class="hp-admin-site-card hp-admin-site-card--product" data-hp-product-site-card>
                    <article class="hp-prod-card hp-prod-card--preview">
                        <span class="hp-prod-card__badge" data-hp-product-preview-badge hidden>0% OFF</span>
                        <div class="hp-prod-card__media" data-hp-product-preview-media>
                            <img
                                data-hp-product-preview-img
                                src="{{ $primaryMedia?->publicUrl() ?: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' }}"
                                alt=""
                            >
                        </div>
                        <div class="hp-prod-card__body">
                            <p class="hp-prod-card__brand" data-hp-product-preview-brand>{{ $brandName }}</p>
                            <h3 data-hp-product-preview-title>{{ old('name', $product->name) ?: 'Product name' }}</h3>
                            <p class="admin-muted" data-hp-product-preview-package>{{ old('package_size', $product->package_size) }}</p>
                            <p class="hp-prod-card__price">
                                <span class="hp-prod-card__now" data-hp-product-preview-now>₹0.00</span>
                                <span class="hp-prod-card__was" data-hp-product-preview-was hidden></span>
                            </p>
                        </div>
                    </article>
                    <button type="button" class="btn btn-secondary" data-hp-product-preview-adjust style="margin-top:0.65rem;width:100%;">Adjust primary image</button>
                </div>
            </section>

            <section class="admin-card admin-product-section">
                <h3>Product images</h3>
                <p class="admin-muted" style="margin-top:0;">First selected image is primary (shown on shop cards). Use Adjust to crop/zoom while watching the preview.</p>
                <p class="admin-muted">Upload new files in the <a href="{{ route('admin.media.index') }}">Media Library</a>, then attach them here.</p>

                <div class="admin-product-images" data-hp-product-images>
                    @forelse ($selectedIds as $index => $mediaId)
                        @php($item = $attachedMedia->get($mediaId) ?: $libraryMedia->firstWhere('id', $mediaId))
                        @if ($item)
                            <label class="admin-product-image-card" data-hp-product-image-card>
                                <input type="checkbox" name="media_ids[]" value="{{ $item->id }}" checked>
                                <img src="{{ $item->publicUrl() }}" alt="">
                                <span class="admin-product-image-card__meta">
                                    <strong>{{ $index === 0 ? 'Primary' : 'Gallery' }}</strong>
                                    <small>#{{ $item->id }}</small>
                                </span>
                                <button type="button" class="btn btn-secondary" data-hp-product-image-adjust data-media-id="{{ $item->id }}">Adjust</button>
                            </label>
                        @endif
                    @empty
                        <p class="admin-muted" data-hp-product-images-empty>No images attached yet. Pick from the library below.</p>
                    @endforelse
                </div>

                <details class="admin-product-library" open>
                    <summary>Add images from Media Library</summary>
                    <div class="admin-product-library-grid">
                        @forelse ($libraryMedia as $item)
                            <label class="admin-product-image-card admin-product-image-card--library">
                                <input type="checkbox" name="media_ids[]" value="{{ $item->id }}"
                                    @checked($selectedIds->contains($item->id))
                                    data-hp-library-media>
                                <img src="{{ $item->publicUrl() }}" alt="">
                                <span class="admin-product-image-card__meta">
                                    <small>#{{ $item->id }}</small>
                                </span>
                                <button type="button" class="btn btn-secondary" data-hp-product-image-adjust data-media-id="{{ $item->id }}">Adjust</button>
                            </label>
                        @empty
                            <p class="admin-muted">No other media yet. Upload in Media Library first.</p>
                        @endforelse
                    </div>
                </details>
            </section>
        </aside>
    </div>

    <div class="admin-actions" style="margin-top:1rem;">
        <button class="btn btn-primary" type="submit">Save product</button>
        <a class="btn btn-secondary" href="{{ route('admin.products.index') }}">Cancel</a>
    </div>
</form>
@endsection
