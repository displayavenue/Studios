@extends('layouts.app')

@section('title', 'A to Z Diseases — '.$settings->brandName())
@section('meta_description', 'A–Z educational disease and health-condition guides from '.$settings->brandName().'. Browse '.$total.' topics and book a consultation.')

@push('head')
    <link rel="canonical" href="{{ route('conditions.index') }}">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
@endpush

@section('content')
<section class="hp-page hp-conditions-index">
    <div class="hp-container">
        <nav class="hp-breadcrumb" aria-label="Breadcrumb">
            <a href="{{ route('home') }}">Home</a> / <span>A to Z Diseases</span>
        </nav>
        <div class="hp-page__intro">
            <h1>A to Z Diseases</h1>
            <p class="hp-section__lead">{{ $total }} educational guides. Content is editable in Admin → A–Z Diseases. Not personal medical advice.</p>
            <div class="hp-btn-row">
                <a class="hp-btn hp-btn--primary" href="{{ route('area-of-consultation') }}">Area of Consultation</a>
                <a class="hp-btn hp-btn--secondary" href="{{ route('doctors.index') }}">Consult a Doctor</a>
            </div>
        </div>

        @if (!empty($letters) && count($letters))
        <nav class="hp-az-nav" aria-label="A to Z">
            @foreach ($letters as $letter)
                <a href="#letter-{{ $letter }}">{{ $letter }}</a>
            @endforeach
        </nav>
        @endif

        @foreach ($byLetter as $letter => $items)
            <section class="hp-condition-group" id="letter-{{ $letter }}">
                <h2>{{ $letter }}</h2>
                <div class="hp-disease-grid">
                    @foreach ($items as $condition)
                        <a class="hp-disease-card" href="{{ route('conditions.show', $condition->slug) }}">
                            <span class="hp-disease-card__media" style="background-image:url('{{ $condition->imageUrl() }}')"></span>
                            <span class="hp-disease-card__body">
                                <strong>{{ $condition->title }}</strong>
                                <small>{{ $condition->category }}</small>
                            </span>
                        </a>
                    @endforeach
                </div>
            </section>
        @endforeach

        <p class="hp-disclaimer">Educational information only. For emergencies call local services. For personal care, book via Area of Consultation or WhatsApp {{ $settings->phoneDisplay() }}.</p>
    </div>
</section>
@endsection
