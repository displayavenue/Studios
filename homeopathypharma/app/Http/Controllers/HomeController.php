<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HomepageSection;
use App\Models\Product;
use App\Services\SiteSettings;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $sections = HomepageSection::query()
            ->published()
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key');

        $homepageCategories = Category::query()
            ->published()
            ->where('show_on_homepage', true)
            ->with('image')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(12)
            ->get();

        $featuredProducts = Product::query()
            ->published()
            ->where('is_featured', true)
            ->with(['images.media'])
            ->latest('published_at')
            ->limit(8)
            ->get();

        return view('home.index', [
            'settings' => $settings,
            'sections' => $sections,
            'homepageCategories' => $homepageCategories,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
