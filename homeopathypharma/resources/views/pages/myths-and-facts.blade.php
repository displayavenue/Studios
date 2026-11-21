@extends('layouts.app')
@section('title', 'Myths vs Fact — '.$settings->brandName())
@section('meta_description', 'Myths vs Fact from '.$settings->brandName().': side-by-side health myths and clear facts. Educational information only — not personal medical advice.')

@push('head')
    <link rel="canonical" href="{{ route('myths-vs-fact') }}">
    <meta name="robots" content="index,follow,max-snippet:-1">
@endpush

@section('content')
<section class="hp-page hp-myths-page">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('conditions.index') }}">Conditions</a> /
            <span>Myths vs Fact</span>
        </nav>

        <div class="hp-myths-shell">
            <header class="hp-myths-shell__header">
                <p class="hp-myths-shell__eyebrow">{{ strtoupper($settings->brandName()) }} · Knowledge Centre</p>
                <h1>Myths vs Fact</h1>
                <p class="hp-myths-shell__lead">Question what you know. Discover what the evidence says.</p>
                <div class="hp-btn-row">
                    <a class="hp-btn hp-btn--secondary" href="{{ route('conditions.index') }}">A to Z Diseases</a>
                    <a class="hp-btn hp-btn--primary" href="{{ route('area-of-consultation') }}">Area of Consultation</a>
                </div>
            </header>

            <ol class="hp-myths-list">
                @foreach ($items as $index => $item)
                    @php $n = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT); @endphp
                    <li class="hp-myths-pair" style="--hp-myth-i: {{ $index }};">
                        <article class="hp-myths-panel hp-myths-panel--myth">
                            <p class="hp-myths-panel__label">{{ $n }} / The Myth</p>
                            <h2 class="hp-myths-panel__title">{{ $item['myth'] }}</h2>
                            <p class="hp-myths-panel__note">{{ $item['myth_note'] }}</p>
                        </article>
                        <article class="hp-myths-panel hp-myths-panel--fact">
                            <p class="hp-myths-panel__label">{{ $n }} / The Fact</p>
                            <h2 class="hp-myths-panel__title">{{ $item['fact'] }}</h2>
                            <p class="hp-myths-panel__note">{{ $item['fact_note'] }}</p>
                        </article>
                    </li>
                @endforeach
            </ol>
        </div>

        <p class="hp-disclaimer">Educational information only — not a diagnosis or treatment plan. For personal care, use Area of Consultation or WhatsApp {{ $settings->phoneDisplay() }}.</p>
    </div>
</section>
@endsection
