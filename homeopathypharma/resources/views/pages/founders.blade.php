@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'Founders & team — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Founders &amp; team</h1>
        <p class="hp-section__lead">Profiles are managed in admin and only appear when published.</p>
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
