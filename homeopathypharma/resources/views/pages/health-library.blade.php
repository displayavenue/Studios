@extends('layouts.app')

@section('title', 'Health Library — '.$settings->brandName())
@section('meta_description', 'Educational homeopathy articles from '.$settings->brandName().'. General information only — not personal medical advice.')

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <div class="hp-page__intro">
            <h1>Health Library</h1>
            <p class="hp-section__lead">Educational articles appear after review and publication. This is general information, not personal medical advice.</p>
        </div>

        <form class="hp-filters" method="get" action="{{ route('health-library.index') }}">
            <label class="hp-label">Search
                <input class="hp-input" type="search" name="q" value="{{ $q }}" placeholder="Search articles">
            </label>
            <label class="hp-label">Category
                <select class="hp-input" name="category">
                    <option value="">All</option>
                    @foreach ($categories as $category)
                        <option value="{{ $category->slug }}" @selected($categorySlug === $category->slug)>{{ $category->name }}</option>
                    @endforeach
                </select>
            </label>
            <button class="hp-btn hp-btn--primary" type="submit">Filter</button>
        </form>

        @if ($featured->isNotEmpty() && $q === '' && $categorySlug === '')
            <div class="hp-article-featured">
                <h2 class="hp-subhead">Featured</h2>
                <div class="hp-article-grid">
                    @foreach ($featured as $item)
                        <article class="hp-article-card">
                            <h3><a href="{{ route('health-library.show', $item->slug) }}">{{ $item->title }}</a></h3>
                            @if ($item->excerpt)
                                <p>{{ $item->excerpt }}</p>
                            @endif
                        </article>
                    @endforeach
                </div>
            </div>
        @endif

        @if ($articles->isEmpty())
            <div class="hp-empty">No articles published yet.</div>
        @else
            <div class="hp-article-grid">
                @foreach ($articles as $article)
                    <article class="hp-article-card">
                        <h3><a href="{{ route('health-library.show', $article->slug) }}">{{ $article->title }}</a></h3>
                        @if ($article->category)
                            <p class="hp-muted">{{ $article->category->name }}</p>
                        @endif
                        @if ($article->excerpt)
                            <p>{{ $article->excerpt }}</p>
                        @endif
                        @if ($article->published_at)
                            <p class="hp-muted">{{ $article->published_at->timezone('Asia/Kolkata')->format('d M Y') }}</p>
                        @endif
                    </article>
                @endforeach
            </div>
            <div style="margin-top:1.75rem;">{{ $articles->links() }}</div>
        @endif
    </div>
</section>
@endsection
