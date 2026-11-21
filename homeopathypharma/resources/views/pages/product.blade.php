@extends('layouts.app')

@section('title', ($product->seo_title ?: $product->name).' — '.$settings->brandName())
@section('meta_description', $product->seo_description ?: $product->short_description)

@section('content')
@php
    $gallery = $product->images->filter(fn ($row) => $row->media)->values();
    $primary = $product->primaryImage();
@endphp
<section class="hp-page">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('shop.index') }}">Shop</a> /
            <span>{{ $product->name }}</span>
        </nav>

        <div class="hp-product-detail">
            <div class="hp-product-gallery" data-hp-product-gallery>
                @if ($primary)
                    <div class="hp-product-gallery__stage" data-hp-zoom-stage>
                        <img
                            class="hp-product-detail__image"
                            data-hp-zoom-main
                            data-full="{{ $primary->publicUrl() }}"
                            src="{{ $primary->publicUrl() }}"
                            alt="{{ $primary->alt_text ?: $product->name }}"
                            draggable="false"
                        >
                    </div>
                    @if ($gallery->count() > 1)
                        <div class="hp-product-gallery__thumbs" role="list">
                            @foreach ($gallery as $row)
                                @php
                                    $media = $row->media;
                                @endphp
                                <button
                                    type="button"
                                    class="hp-product-gallery__thumb {{ $loop->first ? 'is-active' : '' }}"
                                    data-hp-zoom-thumb
                                    data-full="{{ $media->publicUrl() }}"
                                    aria-pressed="{{ $loop->first ? 'true' : 'false' }}"
                                    aria-label="Show image {{ $loop->iteration }}"
                                >
                                    <img src="{{ $media->publicUrl() }}" alt="{{ $media->alt_text ?: $product->name }}">
                                </button>
                            @endforeach
                        </div>
                    @endif
                    <p class="hp-muted hp-product-gallery__hint">On desktop, move your cursor over the image to zoom that spot. Move away to reset.</p>
                @else
                    <div class="hp-product-card__placeholder" style="min-height:16rem;border-radius:0.75rem;"></div>
                @endif
            </div>
            <div>
                <h1>{{ $product->name }}</h1>
                <p class="hp-product-packaging">{{ $product->packagingLabel() }}</p>
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
                @if ($product->isPurchasable())
                    <form method="post" action="{{ route('cart.add', $product) }}" class="hp-btn-row" style="margin-top:1rem;">
                        @csrf
                        <label class="hp-label" style="margin:0;">
                            Qty
                            <input class="hp-input" type="number" name="quantity" value="1" min="1" max="{{ $product->stock_qty }}" style="width:5rem;">
                        </label>
                        <button class="hp-btn hp-btn--primary" type="submit">Add to Cart</button>
                    </form>
                @else
                    <p class="hp-muted">This product cannot be purchased right now.</p>
                @endif
            </div>
        </div>

        <div class="hp-product-info">
            @if ($product->description)
                <section class="hp-product-info__block">
                    <h2>Description</h2>
                    <div class="hp-product-info__body">{!! nl2br(e($product->description)) !!}</div>
                </section>
            @endif
            @if ($product->benefits && trim($product->benefits) !== trim((string) $product->description))
                <section class="hp-product-info__block">
                    <h2>Benefits</h2>
                    <div class="hp-product-info__body">{!! nl2br(e($product->benefits)) !!}</div>
                </section>
            @endif
            <section class="hp-product-info__block">
                <h2>Dosage</h2>
                <div class="hp-product-info__body">{{ $product->directions ?: 'As prescribed by the doctor.' }}</div>
            </section>
            @if ($product->warnings)
                <section class="hp-product-info__block">
                    <h2>Safety information</h2>
                    <div class="hp-product-info__body">{!! nl2br(e($product->warnings)) !!}</div>
                </section>
            @endif
            @if ($product->ingredients)
                <section class="hp-product-info__block">
                    <h2>Ingredients</h2>
                    <div class="hp-product-info__body">{!! nl2br(e($product->ingredients)) !!}</div>
                </section>
            @endif
        </div>

        @if ($related->isNotEmpty())
            <h2 style="margin-top:2rem;">Related products</h2>
            @include('partials.product-grid', ['products' => $related])
        @endif
    </div>
</section>
@endsection

@push('scripts')
@php
    $hpZoomJs = public_path('js/product-image-zoom.js');
    $hpZoomV = is_file($hpZoomJs) ? filemtime($hpZoomJs) : time();
@endphp
<script src="{{ asset('js/product-image-zoom.js') }}?v={{ $hpZoomV }}" defer></script>
@endpush
