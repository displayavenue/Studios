@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'Health Library — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Health Library</h1>
        <p class="hp-section__lead">Educational articles appear after review and publication. This is general information, not personal medical advice.</p>
        <div class="hp-empty">No articles published yet.</div>
    </div>
</section>
@endsection
