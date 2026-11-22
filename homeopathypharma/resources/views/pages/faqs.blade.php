@extends('layouts.app')
@section('title', "FAQ's — ".$settings->brandName())
@section('meta_description', "FAQ's for Homeopathy Pharma: orders, pricing, payments, product selection, account, delivery, medicines, consultations, and customer support.")

@push('head')
    <link rel="canonical" href="{{ route('faqs') }}">
    <meta name="robots" content="index,follow,max-snippet:-1">
@endpush

@section('content')
<section class="hp-page hp-faq-page" aria-labelledby="hp-faq-title">
    <div class="hp-container">
        <p class="hp-faq-page__eyebrow">Knowledge Centre</p>
        <div class="hp-faq">
            <header class="hp-faq__header">
                <h1 id="hp-faq-title">FAQ's</h1>
                <p class="hp-faq__lead">Everything you need to know about shopping with us.</p>
            </header>

            @forelse ($grouped as $category => $items)
                <section class="hp-faq__section" aria-labelledby="hp-faq-cat-{{ \Illuminate\Support\Str::slug($category) }}">
                    <h2 id="hp-faq-cat-{{ \Illuminate\Support\Str::slug($category) }}" class="hp-faq__cat">{{ $category }}</h2>
                    <div class="hp-faq__list">
                        @foreach ($items as $faq)
                            <details class="hp-faq__item">
                                <summary class="hp-faq__summary">
                                    <span class="hp-faq__q">{{ $faq->question }}</span>
                                    <span class="hp-faq__icon" aria-hidden="true"></span>
                                </summary>
                                @if ($faq->hasAnswer())
                                    <div class="hp-faq__a">
                                        @if ($guide = $faq->guide())
                                            @if ($guide['title'])
                                                <p class="hp-faq__guide-title">{{ $guide['title'] }}</p>
                                            @endif
                                            <ol class="hp-faq__guide">
                                                @foreach ($guide['steps'] as $step)
                                                    <li class="hp-faq__guide-step">
                                                        <div class="hp-faq__guide-marker" aria-hidden="true">
                                                            <span class="hp-faq__guide-num"></span>
                                                        </div>
                                                        <div class="hp-faq__guide-copy">
                                                            <p class="hp-faq__guide-step-title">{{ $step['title'] }}</p>
                                                            @if ($step['body'] !== '')
                                                                <p class="hp-faq__guide-step-body">{{ $step['body'] }}</p>
                                                            @endif
                                                        </div>
                                                    </li>
                                                @endforeach
                                            </ol>
                                        @elseif ($faq->steps())
                                            <ol class="hp-faq__steps">
                                                @foreach ($faq->steps() as $step)
                                                    <li>{{ $step }}</li>
                                                @endforeach
                                            </ol>
                                        @else
                                            <p>{{ $faq->answer }}</p>
                                        @endif
                                    </div>
                                @endif
                            </details>
                        @endforeach
                    </div>
                </section>
            @empty
                <p class="hp-faq__empty">FAQ entries will appear here once published.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
