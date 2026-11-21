@extends('layouts.app')
@section('title', 'Myths and Facts — '.$settings->brandName())
@section('meta_description', 'Clear, readable myths and facts about common health conditions from '.$settings->brandName().'. Educational information only — not personal medical advice.')

@push('head')
    <link rel="canonical" href="{{ route('myths-and-facts') }}">
    <meta name="robots" content="index,follow,max-snippet:-1">
@endpush

@section('content')
<section class="hp-page hp-myths-page">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> /
            <a href="{{ route('conditions.index') }}">Conditions</a> /
            <span>Myths and Facts</span>
        </nav>

        <div class="hp-page__intro hp-myths-page__intro">
            <h1>Myths and Facts</h1>
            <p class="hp-section__lead">Twenty-four common health stories worth a second look. Browse A to Z Diseases for condition guides, or book through Area of Consultation when you need personal care.</p>
            <div class="hp-btn-row">
                <a class="hp-btn hp-btn--secondary" href="{{ route('conditions.index') }}">A to Z Diseases</a>
                <a class="hp-btn hp-btn--primary" href="{{ route('area-of-consultation') }}">Area of Consultation</a>
            </div>
        </div>

        <ol class="hp-myths-list">
            @foreach ($items as $index => $item)
                <li class="hp-myths-item" style="--hp-myth-i: {{ $index }};">
                    <p class="hp-myths-item__myth">
                        <span class="hp-myths-item__label">Myth</span>
                        <span class="hp-myths-item__text">{{ $item['myth'] }}</span>
                    </p>
                    <p class="hp-myths-item__fact">
                        <span class="hp-myths-item__label">Fact</span>
                        <span class="hp-myths-item__text">{{ $item['fact'] }}</span>
                    </p>
                </li>
            @endforeach
        </ol>

        <p class="hp-disclaimer">Educational information only — not a diagnosis or treatment plan. For personal care, use Area of Consultation or WhatsApp {{ $settings->phoneDisplay() }}.</p>
    </div>
</section>
@endsection
