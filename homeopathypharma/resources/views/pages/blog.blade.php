@extends('layouts.app')
@section('title', 'Blog — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Blog</h1>
<p class="hp-section__lead">Articles and guides from {{ $settings->brandName() }}.</p>
@if($articles->isEmpty())
<div class="hp-empty">No blog posts published yet.</div>
@else
<div class="hp-article-grid">
@foreach($articles as $article)
<article class="hp-article-card">
<h3><a href="{{ route('health-library.show', $article->slug) }}">{{ $article->title }}</a></h3>
@if($article->excerpt)<p>{{ $article->excerpt }}</p>@endif
</article>
@endforeach
</div>
<div style="margin-top:1.5rem;">{{ $articles->links() }}</div>
@endif
</div>
</section>
@endsection
