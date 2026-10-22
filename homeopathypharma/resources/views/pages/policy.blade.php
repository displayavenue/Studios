@extends('layouts.app')

@section('title', ($page->seo_title ?: $page->title).' — '.$settings->brandName())
@section('meta_description', $page->seo_description ?: Str::limit(strip_tags((string) $page->body), 150))

@section('content')
<section class="hp-page">
    <div class="hp-container hp-article">
        <h1>{{ $page->title }}</h1>
        <div class="hp-prose">
            {!! nl2br(e($page->body)) !!}
        </div>
        <p class="hp-muted" style="margin-top:2rem;">Questions? <a href="{{ route('contact.show') }}">Contact us</a> or call <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>.</p>
    </div>
</section>
@endsection
