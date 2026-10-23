@extends('layouts.app')

@section('title', $condition->seo_title)
@section('meta_description', $condition->seo_description)

@push('head')
    <link rel="canonical" href="{{ route('conditions.show', $condition->slug) }}">
    <meta name="robots" content="{{ $condition->is_indexed ? 'index,follow' : 'noindex,follow' }},max-image-preview:large,max-snippet:-1">
    <meta name="keywords" content="{{ implode(', ', $condition->seo_keywords ?? []) }}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{{ $condition->seo_title }}">
    <meta property="og:description" content="{{ $condition->seo_description }}">
    <meta property="og:url" content="{{ route('conditions.show', $condition->slug) }}">
    <meta property="og:image" content="{{ $condition->image_url }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $condition->seo_title }}">
    <meta name="twitter:description" content="{{ $condition->seo_description }}">
    <meta name="twitter:image" content="{{ $condition->image_url }}">
    <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'MedicalWebPage',
                    '@id' => route('conditions.show', $condition->slug).'#webpage',
                    'url' => route('conditions.show', $condition->slug),
                    'name' => $condition->seo_title,
                    'headline' => $condition->title,
                    'description' => $condition->seo_description,
                    'inLanguage' => 'en-IN',
                    'isAccessibleForFree' => true,
                    'datePublished' => optional($condition->published_at)?->toAtomString(),
                    'dateModified' => optional($condition->updated_at)?->toAtomString(),
                    'image' => $condition->image_url,
                    'about' => [
                        '@type' => 'MedicalCondition',
                        'name' => $condition->title,
                    ],
                    'audience' => [
                        '@type' => 'PeopleAudience',
                        'geographicArea' => 'India',
                    ],
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => $settings->brandName(),
                        'url' => url('/'),
                        'telephone' => $settings->phoneTel(),
                        'address' => $settings->address(),
                    ],
                    'speakable' => [
                        '@type' => 'SpeakableSpecification',
                        'cssSelector' => ['.hp-condition-snippet', '.hp-condition-short'],
                    ],
                ],
                [
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => route('home')],
                        ['@type' => 'ListItem', 'position' => 2, 'name' => 'Conditions', 'item' => route('conditions.index')],
                        ['@type' => 'ListItem', 'position' => 3, 'name' => $condition->title, 'item' => route('conditions.show', $condition->slug)],
                    ],
                ],
                [
                    '@type' => 'FAQPage',
                    'mainEntity' => collect($condition->faqs ?? [])->map(fn ($faq) => [
                        '@type' => 'Question',
                        'name' => $faq['question'],
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $faq['answer'],
                        ],
                    ])->values()->all(),
                ],
                [
                    '@type' => 'Product',
                    'name' => $condition->title.' — educational consult guidance',
                    'description' => $condition->snippet,
                    'image' => $condition->image_url,
                    'brand' => ['@type' => 'Brand', 'name' => $settings->brandName()],
                    'aggregateRating' => [
                        '@type' => 'AggregateRating',
                        'ratingValue' => $condition->rating_average,
                        'reviewCount' => $condition->review_count,
                        'bestRating' => 5,
                        'worstRating' => 1,
                    ],
                    'review' => collect($condition->reviews ?? [])->map(fn ($review) => [
                        '@type' => 'Review',
                        'author' => ['@type' => 'Person', 'name' => $review['author']],
                        'reviewBody' => $review['quote'],
                        'reviewRating' => [
                            '@type' => 'Rating',
                            'ratingValue' => $review['rating'],
                            'bestRating' => 5,
                        ],
                    ])->values()->all(),
                ],
            ],
        ], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT) !!}
    </script>
@endpush

@section('content')
<article class="hp-page hp-condition-page" itemscope itemtype="https://schema.org/MedicalWebPage">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('conditions.index') }}">Conditions</a> /
            <span>{{ $condition->title }}</span>
        </nav>

        <header class="hp-condition-hero">
            <p class="hp-kicker">{{ $condition->category }}</p>
            <h1 itemprop="headline">{{ $condition->title }}</h1>
            <p class="hp-condition-snippet" itemprop="description">{{ $condition->snippet }}</p>
            <div class="hp-condition-rating" aria-label="Average rating {{ $condition->rating_average }} out of 5 from {{ $condition->review_count }} reviews">
                <strong>{{ number_format($condition->rating_average, 1) }}</strong>
                <span>/ 5 · {{ $condition->review_count }} reviews</span>
            </div>
            <div class="hp-btn-row">
                <a class="hp-btn hp-btn--primary hp-btn--whatsapp" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">WhatsApp about {{ $condition->title }}</a>
                <a class="hp-btn hp-btn--secondary" href="{{ route('doctors.index') }}">Book {{ $settings->consultationFeeDisplay() }} consult</a>
            </div>
        </header>

        <figure class="hp-condition-media">
            <img src="{{ $condition->image_url }}" alt="{{ $condition->image_alt }}" width="1200" height="700" loading="eager" fetchpriority="high">
        </figure>

        <p class="hp-condition-short">{{ $condition->short_description }}</p>

        <div class="hp-condition-body hp-prose">
            {!! \Illuminate\Support\Str::markdown($condition->long_description) !!}
        </div>

        <aside class="hp-condition-cta" aria-label="WhatsApp call to action">
            <h2>Talk to us on WhatsApp</h2>
            <p>Message our team about {{ $condition->title }}. We help schedule a {{ $settings->consultationFeeDisplay() }} Google Meet session with a published doctor.</p>
            <a class="hp-btn hp-btn--primary hp-btn--whatsapp" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">Chat on WhatsApp</a>
            <a class="hp-btn hp-btn--secondary" href="tel:{{ $settings->phoneTel() }}">Call {{ $settings->phoneDisplay() }}</a>
        </aside>

        <section class="hp-condition-faqs" aria-labelledby="faq-heading">
            <h2 id="faq-heading">FAQs about {{ $condition->title }}</h2>
            <div class="hp-faq-list">
                @foreach ($condition->faqs ?? [] as $faq)
                    <details class="hp-faq-item">
                        <summary>{{ $faq['question'] }}</summary>
                        <p>{{ $faq['answer'] }}</p>
                    </details>
                @endforeach
            </div>
        </section>

        <section class="hp-condition-reviews" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading">Patient feedback</h2>
            <p class="hp-section__lead">Ten unique feedback notes related to {{ $condition->title }} consults and guidance. Replace with verified reviews in admin as you collect them.</p>
            <div class="hp-review-grid">
                @foreach ($condition->reviews ?? [] as $review)
                    <blockquote class="hp-review-card">
                        <p>“{{ $review['quote'] }}”</p>
                        <footer>
                            <strong>{{ $review['author'] }}</strong>
                            <span class="hp-muted"> · {{ $review['role'] }} · {{ $review['rating'] }}/5</span>
                        </footer>
                    </blockquote>
                @endforeach
            </div>
        </section>

        @if ($related->isNotEmpty())
            <section class="hp-condition-related" aria-labelledby="related-heading">
                <h2 id="related-heading">Related in {{ $condition->category }}</h2>
                <ul class="hp-condition-list">
                    @foreach ($related as $item)
                        <li><a href="{{ route('conditions.show', $item->slug) }}">{{ $item->title }}</a></li>
                    @endforeach
                </ul>
            </section>
        @endif

        <p class="hp-disclaimer">
            Educational content about {{ $condition->title }} only. Not a diagnosis or cure claim.
            For personal care, <a href="{{ route('doctors.index') }}">consult a doctor</a>,
            <a href="{{ $whatsappUrl }}" target="_blank" rel="noopener">WhatsApp us</a>,
            or call <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>.
        </p>
    </div>
</article>
@endsection
