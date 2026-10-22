@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'Founders & team — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Founders &amp; team</h1>
        <p class="hp-section__lead">Profiles are managed in admin and only appear when published.</p>
        <div class="hp-empty">No founder or team profiles are published yet.</div>
    </div>
</section>
@endsection
