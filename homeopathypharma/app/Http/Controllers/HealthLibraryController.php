<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HealthLibraryController extends Controller
{
    public function index(Request $request, SiteSettings $settings): View
    {
        $q = trim((string) $request->query('q', ''));
        $categorySlug = (string) $request->query('category', '');

        $articles = Article::query()
            ->published()
            ->with(['category', 'cover'])
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('title', 'like', "%{$q}%")
                    ->orWhere('excerpt', 'like', "%{$q}%");
            }))
            ->when($categorySlug !== '', function ($query) use ($categorySlug) {
                $query->whereHas('category', fn ($c) => $c->where('slug', $categorySlug)->published());
            })
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return view('pages.health-library', [
            'settings' => $settings,
            'articles' => $articles,
            'categories' => ArticleCategory::query()->published()->orderBy('sort_order')->orderBy('name')->get(),
            'featured' => Article::query()->published()->where('is_featured', true)->latest('published_at')->limit(3)->get(),
            'q' => $q,
            'categorySlug' => $categorySlug,
        ]);
    }

    public function show(string $slug, SiteSettings $settings): View
    {
        $article = Article::query()
            ->published()
            ->with(['category', 'cover'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Article::query()
            ->published()
            ->where('id', '!=', $article->id)
            ->when($article->article_category_id, fn ($q) => $q->where('article_category_id', $article->article_category_id))
            ->limit(3)
            ->get();

        return view('pages.article-show', compact('settings', 'article', 'related'));
    }
}
