@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'About — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>About</h1>
        <p class="hp-section__lead">{{ $settings->tagline() }}</p>
        <p>{{ $settings->brandName() }} is building an online homeopathy product store and practitioner discovery platform.</p>
        <p>Company history and team details will be published through the admin panel when confirmed.</p>
        <p><a href="{{ route('about.founders') }}">Founders &amp; team</a></p>
    </div>
</section>
@endsection
