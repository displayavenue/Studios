@extends('layouts.app')

@section('title', 'Shop — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Shop</h1>
        <p class="hp-section__lead">Published products from the catalogue.</p>

        <form method="get" class="hp-filters" action="{{ route('shop.index') }}">
            <input class="hp-input" type="search" name="q" value="{{ $q }}" placeholder="Search name or SKU">
            <select class="hp-input" name="category">
                <option value="">All categories</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->slug }}" @selected($categorySlug === $category->slug)>{{ $category->name }}</option>
                @endforeach
            </select>
            <select class="hp-input" name="brand">
                <option value="">All brands</option>
                @foreach ($brands as $brand)
                    <option value="{{ $brand->slug }}" @selected($brandSlug === $brand->slug)>{{ $brand->name }}</option>
                @endforeach
            </select>
            <select class="hp-input" name="sort">
                <option value="newest" @selected($sort === 'newest')>Newest</option>
                <option value="name" @selected($sort === 'name')>Name</option>
                <option value="price_asc" @selected($sort === 'price_asc')>Price: low to high</option>
                <option value="price_desc" @selected($sort === 'price_desc')>Price: high to low</option>
            </select>
            <button class="hp-btn hp-btn--primary" type="submit">Apply</button>
            <a class="hp-btn hp-btn--secondary" href="{{ route('shop.index') }}">Clear</a>
        </form>

        <p style="color:var(--hp-muted);">{{ $products->total() }} product(s)</p>

        @if ($products->isEmpty())
            <div class="hp-empty">No published products match these filters.</div>
        @else
            @include('partials.product-grid', ['products' => $products])
            <div style="margin-top:1.5rem;">{{ $products->links() }}</div>
        @endif
    </div>
</section>
@endsection
