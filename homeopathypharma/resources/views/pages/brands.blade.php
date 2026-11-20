@extends('layouts.app')

@section('title', 'Brands — '.$settings->brandName())
@section('meta_description', 'Shop homeopathic medicines by brand — SBL, Dr. Reckeweg, Schwabe, and more at HOMEOPATHY PHARMA.')

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Our Brands</h1>
        <p class="hp-section__lead">Browse the full catalogue by trusted homeopathic brand. Each product card shows the pack image above the name.</p>

        @if ($brands->isEmpty())
            <div class="hp-empty">Brands appear once published in admin.</div>
        @else
            <div class="hp-brand-row" style="margin-top:1.5rem;">
                @foreach ($brands as $brand)
                    <a class="hp-brand-card" href="{{ route('shop.index', ['brand' => $brand->slug]) }}">
                        <strong>{{ $brand->name }}</strong>
                        <p>{{ $brand->description ?: 'Trusted homeopathic brand.' }}</p>
                        <span>{{ $brand->products_count }} product{{ $brand->products_count === 1 ? '' : 's' }} →</span>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</section>
@endsection
