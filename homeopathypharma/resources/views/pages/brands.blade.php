@extends('layouts.app')

@section('title', 'All Brands — '.$settings->brandName())
@section('meta_description', 'Browse every homeopathic product across all brands — SBL, Dr. Reckeweg, Schwabe, and more. Search any product at HOMEOPATHY PHARMA.')

@php
    $filterQuery = array_filter([
        'q' => $q !== '' ? $q : null,
        'category' => $categorySlug !== '' ? $categorySlug : null,
        'brand' => $brandSlug !== '' ? $brandSlug : null,
    ]);
@endphp

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>All Brands</h1>
        <p class="hp-section__lead">A shared catalogue of products from every brand. Search any medicine, filter by category, or jump to a brand below.</p>

        <form method="get" class="hp-filters hp-filters--brands" action="{{ route('brands.index') }}" role="search">
            <label class="hp-sr-only" for="brands-product-search">Search products</label>
            <input
                id="brands-product-search"
                class="hp-input"
                type="search"
                name="q"
                value="{{ $q }}"
                placeholder="Search any product by name, SKU, or brand…"
                autocomplete="off"
            >

            <label class="hp-sr-only" for="brands-category-filter">Category</label>
            <select id="brands-category-filter" class="hp-input hp-input--select" name="category">
                <option value="">All categories</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->slug }}" @selected($categorySlug === $category->slug)>{{ $category->name }}</option>
                @endforeach
            </select>

            @if ($brandSlug !== '')
                <input type="hidden" name="brand" value="{{ $brandSlug }}">
            @endif

            <button class="hp-btn hp-btn--primary" type="submit">Search</button>
            @if ($q !== '' || $brandSlug !== '' || $categorySlug !== '')
                <a class="hp-btn hp-btn--secondary" href="{{ route('brands.index') }}">Clear</a>
            @endif
        </form>

        @if ($brands->isNotEmpty())
            <div class="hp-brand-chips" aria-label="Filter by brand">
                <a
                    class="hp-brand-chip{{ $brandSlug === '' ? ' is-active' : '' }}"
                    href="{{ route('brands.index', array_filter(['q' => $q !== '' ? $q : null, 'category' => $categorySlug !== '' ? $categorySlug : null])) }}"
                >All brands</a>
                @foreach ($brands as $brand)
                    <a
                        class="hp-brand-chip{{ $brandSlug === $brand->slug ? ' is-active' : '' }}"
                        href="{{ route('brands.index', array_filter(['brand' => $brand->slug, 'q' => $q !== '' ? $q : null, 'category' => $categorySlug !== '' ? $categorySlug : null])) }}"
                    >{{ $brand->name }} <span>{{ $brand->products_count }}</span></a>
                @endforeach
            </div>
        @endif

        <p class="hp-muted" style="margin:1rem 0 0;">
            {{ $products->total() }} product{{ $products->total() === 1 ? '' : 's' }}
            @if ($categorySlug !== '')
                @php $activeCategory = $categories->firstWhere('slug', $categorySlug); @endphp
                @if ($activeCategory)
                    in {{ $activeCategory->name }}
                @endif
            @endif
            @if ($brandSlug !== '')
                @php $activeBrand = $brands->firstWhere('slug', $brandSlug); @endphp
                @if ($activeBrand)
                    from {{ $activeBrand->name }}
                @endif
            @endif
            @if ($q !== '')
                matching “{{ $q }}”
            @endif
        </p>

        @if ($products->isEmpty())
            <div class="hp-empty" style="margin-top:1rem;">
                @if ($q !== '' || $brandSlug !== '' || $categorySlug !== '')
                    No products match these filters. Try another category, term, or clear filters.
                @else
                    Products appear once published and linked to brands in admin.
                @endif
            </div>
        @else
            <div style="margin-top:1.25rem;">
                @include('partials.product-grid', ['products' => $products])
            </div>
            <div style="margin-top:1.5rem;">{{ $products->links() }}</div>
        @endif
    </div>
</section>
@endsection
