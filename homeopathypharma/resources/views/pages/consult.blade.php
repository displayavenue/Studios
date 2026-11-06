@extends('layouts.app')

@php($pageTitle = $page->title ?? 'Consult a doctor')

@section('title', $page->seo_title ?? ($pageTitle.' — '.$settings->brandName()))
@section('meta_description', $page->seo_description ?? 'Browse verified practitioner profiles and request a consultation.')

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>{{ $pageTitle }}</h1>
        @if (!empty($page?->body))
            <div class="hp-prose">{!! $page->body !!}</div>
        @else
            <p class="hp-section__lead">Browse verified practitioner profiles and request a consultation when availability is published. Outcomes are not guaranteed.</p>
            <a class="hp-btn hp-btn--primary" href="{{ route('doctors.index') }}">Find a Doctor</a>
        @endif
    </div>
</section>
@endsection
