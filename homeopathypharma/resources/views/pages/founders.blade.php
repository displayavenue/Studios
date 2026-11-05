@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))
@php($pageTitle = $page->title ?? 'Founders & team')

@section('title', $page->seo_title ?? ($pageTitle.' — '.$settings->brandName()))
@section('meta_description', $page->seo_description ?? 'Meet the people behind '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>{{ $pageTitle }}</h1>
        @if (!empty($page?->body))
            <div class="hp-prose" style="margin-bottom:1.5rem;">{!! $page->body !!}</div>
        @else
            <p class="hp-section__lead">Profiles are managed in admin and only appear when published.</p>
        @endif
        @if (($members ?? collect())->isEmpty())
            <div class="hp-empty">No founder or team profiles are published yet.</div>
        @else
            <div class="hp-product-grid">
                @foreach ($members as $member)
                    <article class="hp-product-card">
                        @if ($member->photo)
                            <img src="{{ $member->photo->publicUrl() }}" alt="{{ $member->photo->alt_text ?: $member->name }}">
                        @endif
                        <h3>{{ $member->name }}</h3>
                        <p class="hp-product-card__meta">{{ $member->designation }}</p>
                        @if ($member->biography)
                            <p>{{ \Illuminate\Support\Str::limit($member->biography, 160) }}</p>
                        @endif
                    </article>
                @endforeach
            </div>
        @endif
    </div>
</section>
@endsection
