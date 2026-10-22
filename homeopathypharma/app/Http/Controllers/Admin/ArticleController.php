<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\MediaAsset;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ArticleController extends Controller
{
    public function index(): View
    {
        return view('admin.articles.index', [
            'articles' => Article::query()->with('category')->latest()->paginate(20),
        ]);
    }

    public function create(): View
    {
        return view('admin.articles.form', [
            'article' => new Article(['status' => 'draft', 'content_type' => 'article']),
            'categories' => ArticleCategory::query()->orderBy('name')->get(),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request, AuditLogger $audit): RedirectResponse
    {
        $article = Article::query()->create($this->validated($request));
        $audit->log('article.created', $article);

        return redirect()->route('admin.articles.index')->with('status', 'Article saved as '.$article->status.'.');
    }

    public function edit(Article $article): View
    {
        return view('admin.articles.form', [
            'article' => $article,
            'categories' => ArticleCategory::query()->orderBy('name')->get(),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, Article $article, AuditLogger $audit): RedirectResponse
    {
        $article->update($this->validated($request, $article));
        $audit->log('article.updated', $article);

        return redirect()->route('admin.articles.index')->with('status', 'Article updated.');
    }

    public function destroy(Article $article, AuditLogger $audit): RedirectResponse
    {
        $audit->log('article.deleted', $article, ['title' => $article->title]);
        $article->delete();

        return redirect()->route('admin.articles.index')->with('status', 'Article deleted.');
    }

    private function validated(Request $request, ?Article $article = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'content_type' => ['required', 'in:article,blog,case_study'],
            'article_category_id' => ['nullable', 'exists:article_categories,id'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'cover_media_id' => ['nullable', 'exists:media_assets,id'],
            'author_name' => ['nullable', 'string', 'max:120'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'is_featured' => ['sometimes', 'boolean'],
            'show_on_homepage' => ['sometimes', 'boolean'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $data['slug'] = Str::slug(($data['slug'] ?? '') ?: $data['title']);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['show_on_homepage'] = $request->boolean('show_on_homepage');
        $data['created_by'] = $article?->created_by ?? $request->user()?->id;
        if ($data['status'] === 'published' && empty($article?->published_at)) {
            $data['published_at'] = now();
        }

        $exists = Article::query()
            ->where('slug', $data['slug'])
            ->when($article, fn ($q) => $q->where('id', '!=', $article->id))
            ->exists();
        if ($exists) {
            $data['slug'] .= '-'.Str::lower(Str::random(4));
        }

        // Sanitize: store plain text/markdown-like content escaped on render.
        return $data;
    }
}
