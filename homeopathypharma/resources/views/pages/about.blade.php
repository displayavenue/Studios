@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'About — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <div class="hp-page__intro">
            <h1>About</h1>
            <p class="hp-section__lead">{{ $settings->tagline() }}</p>
        </div>
        <div class="hp-article">
            <p class="hp-prose" style="margin-top:0;">{{ $settings->brandName() }} is an online homeopathy product store and practitioner discovery platform based in Mira Road, Mumbai.</p>
            <p>We connect people with verified doctors for scheduled Google Meet consultations and a curated catalogue of homeopathic products.</p>
            <div class="hp-section__actions hp-btn-row">
                <a class="hp-btn hp-btn--primary" href="{{ route('about.founders') }}">Founders &amp; team</a>
                <a class="hp-btn hp-btn--secondary" href="{{ route('contact.show') }}">Contact us</a>
            </div>
        </div>
    </div>
</section>
@endsection
