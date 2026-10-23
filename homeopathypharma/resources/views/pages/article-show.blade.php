@extends('layouts.app')

@section('title', ($article->seo_title ?: $article->title).' — '.$settings->brandName())
@section('meta_description', $article->seo_description ?: ($article->excerpt ?: Str::limit(strip_tags((string) $article->body), 150)))

@section('content')
<section class="hp-page">
    <div class="hp-container hp-article">
        <p class="hp-breadcrumb">
            <a href="{{ route('health-library.index') }}">Health Library</a>
            @if ($article->category)
                · {{ $article->category->name }}
            @endif
        </p>
        <h1>{{ $article->title }}</h1>
        <p class="hp-muted">
            @if ($article->author_name){{ $article->author_name }} · @endif
            @if ($article->published_at){{ $article->published_at->timezone('Asia/Kolkata')->format('d M Y') }}@endif
        </p>
        @if ($article->excerpt)
            <p class="hp-section__lead">{{ $article->excerpt }}</p>
        @endif
        <div class="hp-prose">
            {!! nl2br(e($article->body)) !!}
        </div>
        <p class="hp-disclaimer">This article is educational and is not a substitute for professional medical advice. For personal guidance, <a href="{{ route('doctors.index') }}">consult a doctor</a> or call <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>.</p>

        @if ($related->isNotEmpty())
            <aside class="hp-related">
                <h2 class="hp-subhead">Related</h2>
                <ul>
                    @foreach ($related as $item)
                        <li><a href="{{ route('health-library.show', $item->slug) }}">{{ $item->title }}</a></li>
                    @endforeach
                </ul>
            </aside>
        @endif
    </div>
</section>
@endsection
