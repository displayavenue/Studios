<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
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

        $query = Product::query()
            ->published()
            ->with(['brand', 'images.media'])
            ->when($collection === 'popular', fn ($builder) => $builder->where('is_featured', true))
            ->when($collection === 'super-saving', fn ($builder) => $builder->where('is_super_saving', true))
            ->when($q !== '', fn ($builder) => $builder->where(function ($inner) use ($q) {
                $inner->where('name', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%");
            }))
            ->when($categorySlug !== '', function ($builder) use ($categorySlug) {
                $builder->whereHas('categories', fn ($c) => $c->where('slug', $categorySlug)->published());
            })
            ->when($brandSlug !== '', function ($builder) use ($brandSlug) {
                $builder->whereHas('brand', fn ($b) => $b->where('slug', $brandSlug)->published());
            });

        if ($sort === 'brand_mixed') {
            $mixed = $this->roundRobinByBrand(
                $query->latest('published_at')->get()
            );
            $products = $this->paginateCollection($mixed, 24, $request);
        } else {
            $products = $query
                ->when($sort === 'price_asc', fn ($builder) => $builder->orderBy('price_paise'))
                ->when($sort === 'price_desc', fn ($builder) => $builder->orderByDesc('price_paise'))
                ->when($sort === 'name', fn ($builder) => $builder->orderBy('name'))
                ->when($sort === 'newest', fn ($builder) => $builder->latest('published_at'))
                ->paginate(24)
                ->withQueryString();
        }

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

    /**
     * Interleave products brand-by-brand so page one shows every brand.
     *
     * @param  Collection<int, Product>  $products
     * @return Collection<int, Product>
     */
    private function roundRobinByBrand(Collection $products): Collection
    {
        $brandOrder = Brand::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->pluck('id')
            ->all();

        $queues = [];
        foreach ($brandOrder as $brandId) {
            $queues[$brandId] = collect();
        }

        foreach ($products as $product) {
            $brandId = (int) ($product->brand_id ?? 0);
            if (! isset($queues[$brandId])) {
                $queues[$brandId] = collect();
            }
            $queues[$brandId]->push($product);
        }

        $mixed = collect();
        while (true) {
            $added = false;
            foreach ($queues as $brandId => $list) {
                if ($list->isEmpty()) {
                    continue;
                }
                $mixed->push($list->shift());
                $added = true;
            }
            if (! $added) {
                break;
            }
        }

        return $mixed->values();
    }

    /**
     * @param  Collection<int, Product>  $items
     */
    private function paginateCollection(Collection $items, int $perPage, Request $request): LengthAwarePaginator
    {
        $page = max(1, (int) $request->query('page', 1));
        $total = $items->count();
        $slice = $items->slice(($page - 1) * $perPage, $perPage)->values();

        return (new LengthAwarePaginator(
            $slice,
            $total,
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        ))->withQueryString();
    }
}
