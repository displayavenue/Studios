@extends('layouts.app')

@php($settings = $settings ?? app(\App\Services\SiteSettings::class))

@section('title', 'Founders & team — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <div class="hp-page__intro">
            <h1>Founders &amp; team</h1>
            <p class="hp-section__lead">Profiles are managed in admin and only appear when published.</p>
        </div>
        @if (($members ?? collect())->isEmpty())
            <div class="hp-empty">No founder or team profiles are published yet.</div>
        @else
            <div class="hp-people-grid">
                @foreach ($members as $member)
                    <article class="hp-person-card">
                        <div class="hp-person-card__photo">
                            @if ($member->photo)
                                <img src="{{ $member->photo->publicUrl() }}" alt="{{ $member->photo->alt_text ?: $member->name }}">
                            @else
                                <span aria-hidden="true">{{ mb_substr($member->name, 0, 1) }}</span>
                            @endif
                        </div>
                        <h3>{{ $member->name }}</h3>
                        <p class="hp-muted">{{ $member->designation }}</p>
                        @if ($member->biography)
                            <p>{{ \Illuminate\Support\Str::limit($member->biography, 220) }}</p>
                        @endif
                    </article>
                @endforeach
            </div>
        @endif
    </div>
</section>
@endsection
