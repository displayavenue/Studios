@extends('layouts.app')

@section('title', $settings->brandName().' — '.$settings->tagline())
@section('meta_description', $settings->tagline())

@section('content')
    @php($hero = $sections->get('hero'))
    @php($trust = $sections->get('trust'))
    @php($categories = $sections->get('categories'))
    @php($featured = $sections->get('featured_products'))
    @php($consult = $sections->get('consult'))
    @php($library = $sections->get('health_library'))

    @if ($hero)
        <section class="hp-hero">
            <div class="hp-container hp-hero__grid">
                <div>
                    <p class="hp-kicker">{{ $settings->brandName() }}</p>
                    <h1>{{ $hero->title }}</h1>
                    <p>{{ $hero->subtitle }}</p>
                    <div class="hp-btn-row">
                        <a class="hp-btn hp-btn--primary" href="{{ $hero->payload['primary_cta_href'] ?? route('shop.index') }}">
                            {{ $hero->payload['primary_cta_label'] ?? 'Shop Products' }}
                        </a>
                        <a class="hp-btn hp-btn--secondary" href="{{ $hero->payload['secondary_cta_href'] ?? route('doctors.index') }}">
                            {{ $hero->payload['secondary_cta_label'] ?? 'Consult a Doctor' }}
                        </a>
                    </div>
                </div>
                <div class="hp-hero__visual" role="img" aria-label="{{ $hero->payload['image_alt'] ?? 'Natural wellness' }}">
                    <span>Media library image will appear here when uploaded in admin.</span>
                </div>
            </div>
        </section>
    @endif

    @if ($trust)
        <section class="hp-section">
            <div class="hp-container">
                <h2>{{ $trust->title }}</h2>
                <div class="hp-trust">
                    @foreach (($trust->payload['items'] ?? []) as $item)
                        <article class="hp-trust__item">
                            <h3>{{ $item['title'] }}</h3>
                            <p>{{ $item['body'] }}</p>
                        </article>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    @if ($categories)
        <section class="hp-section hp-section--alt">
            <div class="hp-container">
                <h2>{{ $categories->title }}</h2>
                <p class="hp-section__lead">{{ $categories->subtitle }}</p>
                @if ($homepageCategories->isEmpty())
                    <div class="hp-empty">No published categories yet. Categories will load from the database after catalogue setup.</div>
                @else
                    <div class="hp-product-grid">
                        @foreach ($homepageCategories as $category)
                            <a class="hp-product-card" href="{{ route('shop.category', $category->slug) }}">
                                @if ($category->image)
                                    <img src="{{ $category->image->publicUrl() }}" alt="{{ $category->image->alt_text ?: $category->name }}">
                                @endif
                                <h3>{{ $category->name }}</h3>
                            </a>
                        @endforeach
                    </div>
                @endif
            </div>
        </section>
    @endif

    @if ($featured)
        <section class="hp-section">
            <div class="hp-container">
                <h2>{{ $featured->title }}</h2>
                <p class="hp-section__lead">{{ $featured->subtitle }}</p>
                @if ($featuredProducts->isEmpty())
                    <div class="hp-empty">No featured products yet. An administrator must publish and feature products before they appear here.</div>
                @else
                    @include('partials.product-grid', ['products' => $featuredProducts])
                @endif
            </div>
        </section>
    @endif

    @if ($consult)
        <section class="hp-section hp-section--alt">
            <div class="hp-container hp-consult">
                <div>
                    <h2>{{ $consult->title }}</h2>
                    <p class="hp-section__lead">{{ $consult->subtitle }}</p>
                    <a class="hp-btn hp-btn--primary" href="{{ $consult->payload['cta_href'] ?? route('doctors.index') }}">
                        {{ $consult->payload['cta_label'] ?? 'Find a Doctor' }}
                    </a>
                </div>
                <div class="hp-consult__panel">Consultation media managed via the media library</div>
            </div>
        </section>
    @endif

    @if ($library)
        <section class="hp-section">
            <div class="hp-container">
                <h2>{{ $library->title }}</h2>
                <p class="hp-section__lead">{{ $library->subtitle }}</p>
                <div class="hp-empty">No published articles yet.</div>
            </div>
        </section>
    @endif
@endsection
