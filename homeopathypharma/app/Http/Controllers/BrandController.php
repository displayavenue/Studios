<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BrandController extends Controller
{
    public function index(Request $request, SiteSettings $settings): View
    {
        $q = trim((string) $request->query('q', ''));
        $brandSlug = (string) $request->query('brand', '');
        $categorySlug = (string) $request->query('category', '');

        $brands = Brand::query()
            ->published()
            ->withCount(['products' => fn ($query) => $query->published()])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $categories = Category::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $products = Product::query()
            ->published()
            ->with(['brand', 'images.media'])
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('name', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%")
                    ->orWhereHas('brand', fn ($brand) => $brand->where('name', 'like', "%{$q}%"));
            }))
            ->when($brandSlug !== '', function ($query) use ($brandSlug) {
                $query->whereHas('brand', fn ($brand) => $brand->where('slug', $brandSlug)->published());
            })
            ->when($categorySlug !== '', function ($query) use ($categorySlug) {
                $query->whereHas('categories', fn ($category) => $category->where('slug', $categorySlug)->published());
            })
            ->latest('published_at')
            ->paginate(24)
            ->withQueryString();

        return view('pages.brands', [
            'settings' => $settings,
            'brands' => $brands,
            'categories' => $categories,
            'products' => $products,
            'q' => $q,
            'brandSlug' => $brandSlug,
            'categorySlug' => $categorySlug,
        ]);
    }
}
