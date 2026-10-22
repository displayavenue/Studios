@extends('layouts.app')

@section('title', ($product->seo_title ?: $product->name).' — '.$settings->brandName())
@section('meta_description', $product->seo_description ?: $product->short_description)

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('shop.index') }}">Shop</a> /
            <span>{{ $product->name }}</span>
        </nav>

        <div class="hp-product-detail">
            <div>
                @php($image = $product->primaryImage())
                @if ($image)
                    <img class="hp-product-detail__image" src="{{ $image->publicUrl() }}" alt="{{ $image->alt_text ?: $product->name }}">
                @else
                    <div class="hp-product-card__placeholder" style="min-height:16rem;border-radius:0.75rem;"></div>
                @endif
            </div>
            <div>
                <h1>{{ $product->name }}</h1>
                @if ($product->brand)
                    <p class="hp-muted">Brand: {{ $product->brand->name }}</p>
                @endif
                @if ($product->sku)
                    <p class="hp-muted">SKU: {{ $product->sku }}</p>
                @endif
                <p class="hp-product-card__price" style="font-size:1.35rem;">{{ $product->formattedPrice() }}</p>
                <p>{{ $product->isPurchasable() ? 'In stock' : 'Currently unavailable' }}</p>
                @if ($product->short_description)
                    <p>{{ $product->short_description }}</p>
                @endif
                <p class="hp-muted">Add to cart will be available when checkout is configured (Phase 3).</p>
            </div>
        </div>

        @if ($product->description)
            <h2>Description</h2>
            <div>{!! nl2br(e($product->description)) !!}</div>
        @endif
        @if ($product->ingredients)
            <h2>Composition</h2>
            <div>{!! nl2br(e($product->ingredients)) !!}</div>
        @endif
        @if ($product->directions)
            <h2>Directions</h2>
            <div>{!! nl2br(e($product->directions)) !!}</div>
        @endif
        @if ($product->warnings)
            <h2>Warnings</h2>
            <div>{!! nl2br(e($product->warnings)) !!}</div>
        @endif

        @if ($related->isNotEmpty())
            <h2 style="margin-top:2rem;">Related products</h2>
            @include('partials.product-grid', ['products' => $related])
        @endif
    </div>
</section>
@endsection
