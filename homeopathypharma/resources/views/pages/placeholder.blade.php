@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', ($title ?? 'Coming soon').' — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>{{ $title ?? 'Coming soon' }}</h1>
        <div class="hp-empty">{{ $message ?? 'This section is not configured yet.' }}</div>
    </div>
</section>
@endsection
