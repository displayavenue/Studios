@extends('layouts.app')

@section('title', ($category->seo_title ?: $category->name).' — '.$settings->brandName())
@section('meta_description', $category->seo_description ?: $category->description)

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('shop.index') }}">Shop</a> /
            <span>{{ $category->name }}</span>
        </nav>
        <h1>{{ $category->name }}</h1>
        @if ($category->description)
            <p class="hp-section__lead">{{ $category->description }}</p>
        @endif
        @if ($products->isEmpty())
            <div class="hp-empty">No published products in this category yet.</div>
        @else
            @include('partials.product-grid', ['products' => $products])
            <div style="margin-top:1.5rem;">{{ $products->links() }}</div>
        @endif
    </div>
</section>
@endsection
