<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BlogController extends Controller
{
    public function index(Request $request, SiteSettings $settings): View
    {
        $articles = Article::query()
            ->published()
            ->blog()
            ->with(['category', 'cover'])
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return view('pages.blog', [
            'settings' => $settings,
            'articles' => $articles,
        ]);
    }
}
