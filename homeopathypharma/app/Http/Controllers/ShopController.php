<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ShopController extends Controller
{
    public function index(Request $request, SiteSettings $settings): View
    {
        $q = trim((string) $request->query('q', ''));
        $categorySlug = (string) $request->query('category', '');
        $brandSlug = (string) $request->query('brand', '');
        $sort = (string) $request->query('sort', 'newest');

        $products = Product::query()
            ->published()
            ->with(['brand', 'images.media'])
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('name', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%");
            }))
            ->when($categorySlug !== '', function ($query) use ($categorySlug) {
                $query->whereHas('categories', fn ($c) => $c->where('slug', $categorySlug)->published());
            })
            ->when($brandSlug !== '', function ($query) use ($brandSlug) {
                $query->whereHas('brand', fn ($b) => $b->where('slug', $brandSlug)->published());
            })
            ->when($sort === 'price_asc', fn ($query) => $query->orderBy('price_paise'))
            ->when($sort === 'price_desc', fn ($query) => $query->orderByDesc('price_paise'))
            ->when($sort === 'name', fn ($query) => $query->orderBy('name'))
            ->when($sort === 'newest', fn ($query) => $query->latest('published_at'))
            ->paginate(12)
            ->withQueryString();

        return view('pages.shop', [
            'settings' => $settings,
            'products' => $products,
            'categories' => Category::query()->published()->orderBy('sort_order')->orderBy('name')->get(),
            'brands' => Brand::query()->published()->orderBy('name')->get(),
            'q' => $q,
            'categorySlug' => $categorySlug,
            'brandSlug' => $brandSlug,
            'sort' => $sort,
        ]);
    }

    public function category(string $slug, SiteSettings $settings): View
    {
        $category = Category::query()->published()->where('slug', $slug)->firstOrFail();

        $products = $category->products()
            ->published()
            ->with(['brand', 'images.media'])
            ->latest('published_at')
            ->paginate(12);

        return view('pages.category', [
            'settings' => $settings,
            'category' => $category,
            'products' => $products,
        ]);
    }
}
