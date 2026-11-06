@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))
@php($pageTitle = $page->title ?? 'About')

@section('title', ($page->seo_title ?? $pageTitle.' — '.$settings->brandName()))
@section('meta_description', $page->seo_description ?? $settings->tagline())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>{{ $pageTitle }}</h1>
        @if (!empty($page?->body))
            <div class="hp-prose">{!! $page->body !!}</div>
        @else
            <p class="hp-section__lead">{{ $settings->tagline() }}</p>
            <p>{{ $settings->brandName() }} is building an online homeopathy product store and practitioner discovery platform.</p>
            <p><a href="{{ route('about.founders') }}">Founders &amp; team</a></p>
        @endif
    </div>
</section>
@endsection
