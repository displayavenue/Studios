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
        $collection = strtolower(trim((string) $request->query('collection', '')));
        if (! in_array($collection, ['popular', 'super-saving'], true)) {
            $collection = '';
        }
        $sort = (string) $request->query('sort', 'newest');

        // For Popular / Super Saving "View all", default to brand-mixed order
        // so one large catalogue cannot fill the first page alone.
        if ($collection !== '' && ! $request->has('sort')) {
            $sort = 'brand_mixed';
        }

        $products = Product::query()
            ->published()
            ->with(['brand', 'images.media'])
            ->when($collection === 'popular', fn ($query) => $query->where('is_featured', true))
            ->when($collection === 'super-saving', fn ($query) => $query->where('is_super_saving', true))
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
            ->when($sort === 'brand_mixed', function ($query) {
                $query->leftJoin('brands', 'brands.id', '=', 'products.brand_id')
                    ->orderByRaw('COALESCE(brands.sort_order, 9999)')
                    ->orderBy('brands.name')
                    ->orderByDesc('products.published_at')
                    ->select('products.*');
            })
            ->paginate(24)
            ->withQueryString();

        $heading = match ($collection) {
            'popular' => 'Popular Homeopathic Medicines',
            'super-saving' => 'Super Saving Deals',
            default => 'Shop',
        };
        $lead = match ($collection) {
            'popular' => 'All Popular products from every brand.',
            'super-saving' => 'All Super Saving deals from every brand.',
            default => 'Published products from the catalogue.',
        };

        return view('pages.shop', [
            'settings' => $settings,
            'products' => $products,
            'categories' => Category::query()->published()->orderBy('sort_order')->orderBy('name')->get(),
            'brands' => Brand::query()->published()->orderBy('name')->get(),
            'q' => $q,
            'categorySlug' => $categorySlug,
            'brandSlug' => $brandSlug,
            'collection' => $collection,
            'sort' => $sort,
            'heading' => $heading,
            'lead' => $lead,
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
