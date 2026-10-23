<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ArticleCategoryController extends Controller
{
    public function index(): View
    {
        return view('admin.article-categories.index', [
            'categories' => ArticleCategory::query()->orderBy('sort_order')->orderBy('name')->paginate(20),
        ]);
    }

    public function create(): View
    {
        return view('admin.article-categories.form', [
            'category' => new ArticleCategory(['status' => 'draft']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ArticleCategory::query()->create($this->validated($request));

        return redirect()->route('admin.article-categories.index')->with('status', 'Category created.');
    }

    public function edit(ArticleCategory $article_category): View
    {
        return view('admin.article-categories.form', ['category' => $article_category]);
    }

    public function update(Request $request, ArticleCategory $article_category): RedirectResponse
    {
        $article_category->update($this->validated($request, $article_category));

        return redirect()->route('admin.article-categories.index')->with('status', 'Category updated.');
    }

    public function destroy(ArticleCategory $article_category): RedirectResponse
    {
        if ($article_category->articles()->exists()) {
            return back()->withErrors(['category' => 'Reassign or delete articles first.']);
        }
        $article_category->delete();

        return redirect()->route('admin.article-categories.index')->with('status', 'Category deleted.');
    }

    private function validated(Request $request, ?ArticleCategory $category = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published,archived'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
        $data['slug'] = Str::slug(($data['slug'] ?? '') ?: $data['name']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }
}
