@extends('layouts.app')
@section('title', 'Understanding Homeopathy — '.$settings->brandName())
@section('meta_description', 'Understanding Homeopathy: clear answers on what homeopathy is, how medicines are prepared, safety, use with conventional care, and what happens in a consultation. Based on CCRH / AYUSH educational material.')

@push('head')
    <link rel="canonical" href="{{ route('understanding-homeopathy') }}">
    <meta name="robots" content="index,follow,max-snippet:-1">
@endpush

@section('content')
<section class="hp-page hp-uh" aria-labelledby="hp-uh-title">
    <div class="hp-container hp-uh__frame">
        <header class="hp-uh__header">
            <p class="hp-uh__eyebrow">Knowledge Centre</p>
            <h1 id="hp-uh-title">Understanding Homeopathy</h1>
            <p class="hp-uh__lead">
                Straightforward answers to common questions, drawn from
                <cite>{{ $source }}</cite>.
            </p>
        </header>

        <ol class="hp-uh-list">
            @foreach ($faqs as $index => $faq)
                @php $n = $index + 1; @endphp
                <li class="hp-uh-item">
                    <details class="hp-uh-card" @if ($n === 1) open @endif>
                        <summary class="hp-uh-card__summary">
                            <span class="hp-uh-card__num" aria-hidden="true">{{ str_pad((string) $n, 2, '0', STR_PAD_LEFT) }}</span>
                            <span class="hp-uh-card__q">{{ $faq['question'] }}</span>
                        </summary>
                        <div class="hp-uh-card__body">
                            <p>{{ $faq['answer'] }}</p>
                        </div>
                    </details>
                </li>
            @endforeach
        </ol>

        <p class="hp-disclaimer hp-uh__disclaimer">
            Educational information only — not a diagnosis or treatment plan.
            Source: {{ $source }}.
            For personal care, use
            <a href="{{ route('area-of-consultation') }}">Area of Consultation</a>
            or WhatsApp {{ $settings->phoneDisplay() }}.
        </p>
    </div>
</section>
@endsection
