@extends('layouts.app')

@section('title', 'Health conditions A–Z — '.$settings->brandName())
@section('meta_description', 'Educational guides to common health problems and how homeopathy may approach them. Index of '.$total.' condition pages from '.$settings->brandName().', Mira Road, Mumbai.')

@push('head')
    <link rel="canonical" href="{{ route('conditions.index') }}">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Health conditions A–Z — {{ $settings->brandName() }}">
    <meta property="og:description" content="Educational condition guides with FAQs, reviews, and WhatsApp consult CTA.">
    <meta property="og:url" content="{{ route('conditions.index') }}">
@endpush

@section('content')
<section class="hp-page hp-conditions-index">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> / <span>Conditions</span>
        </nav>
        <div class="hp-page__intro">
            <h1>Health conditions &amp; problems</h1>
            <p class="hp-section__lead">{{ $total }} educational guides covering symptoms overview, red flags, FAQs, and how a homeopath may take the case. Not personal medical advice.</p>
            <div class="hp-btn-row">
                <a class="hp-btn hp-btn--primary" href="{{ $settings->whatsappUrl('Hi HOMEOPATHY PHARMA, I want help choosing a condition consult.') }}" target="_blank" rel="noopener">WhatsApp us</a>
                <a class="hp-btn hp-btn--secondary" href="{{ route('doctors.index') }}">Book doctor · {{ $settings->consultationFeeDisplay() }}</a>
            </div>
        </div>

        @foreach ($grouped as $category => $items)
            <section class="hp-condition-group" id="{{ \Illuminate\Support\Str::slug($category) }}">
                <h2>{{ $category }}</h2>
                <ul class="hp-condition-list">
                    @foreach ($items as $condition)
                        <li>
                            <a href="{{ route('conditions.show', $condition->slug) }}">{{ $condition->title }}</a>
                        </li>
                    @endforeach
                </ul>
            </section>
        @endforeach

        <p class="hp-disclaimer">Educational information only. For emergencies call local services. For personal care, consult a qualified clinician or WhatsApp {{ $settings->phoneDisplay() }}.</p>
    </div>
</section>
@endsection
