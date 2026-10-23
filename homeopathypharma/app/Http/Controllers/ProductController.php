<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\SiteSettings;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function show(string $slug, SiteSettings $settings): View
    {
        $product = Product::query()
            ->published()
            ->with(['brand', 'categories', 'images.media'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::query()
            ->published()
            ->where('id', '!=', $product->id)
            ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $product->categories->pluck('id')))
            ->with(['images.media'])
            ->limit(4)
            ->get();

        return view('pages.product', [
            'settings' => $settings,
            'product' => $product,
            'related' => $related,
        ]);
    }
}
