<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(Request $request): View
    {
        $q = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');

        $products = Product::query()
            ->with('brand')
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('name', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%");
            }))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.products.index', compact('products', 'q', 'status'));
    }

    public function create(): View
    {
        return view('admin.products.form', $this->formData(new Product([
            'status' => 'draft',
            'stock_status' => 'in_stock',
            'stock_qty' => 0,
            'is_featured' => false,
        ])));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $categoryIds = $data['category_ids'] ?? [];
        $mediaIds = $data['media_ids'] ?? [];
        unset($data['category_ids'], $data['media_ids'], $data['price_inr'], $data['sale_price_inr']);

        $product = Product::query()->create($data);
        $product->categories()->sync($categoryIds);
        $this->syncImages($product, $mediaIds);

        return redirect()->route('admin.products.index')->with('status', 'Product created.');
    }

    public function edit(Product $product): View
    {
        $product->load(['categories', 'images']);

        return view('admin.products.form', $this->formData($product));
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request, $product);
        $categoryIds = $data['category_ids'] ?? [];
        $mediaIds = $data['media_ids'] ?? [];
        unset($data['category_ids'], $data['media_ids'], $data['price_inr'], $data['sale_price_inr']);

        $product->update($data);
        $product->categories()->sync($categoryIds);
        $this->syncImages($product, $mediaIds);

        return redirect()->route('admin.products.index')->with('status', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('status', 'Product deleted.');
    }

    private function formData(Product $product): array
    {
        return [
            'product' => $product,
            'brands' => Brand::query()->orderBy('name')->get(),
            'categories' => Category::query()->orderBy('name')->get(),
            'media' => MediaAsset::query()->latest()->limit(80)->get(),
        ];
    }

    private function validated(Request $request, ?Product $product = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product?->id)],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'price_inr' => ['required', 'numeric', 'min:0'],
            'sale_price_inr' => ['nullable', 'numeric', 'min:0'],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'stock_status' => ['required', 'in:in_stock,out_of_stock,backorder'],
            'package_size' => ['nullable', 'string', 'max:100'],
            'ingredients' => ['nullable', 'string'],
            'directions' => ['nullable', 'string'],
            'warnings' => ['nullable', 'string'],
            'manufacturer' => ['nullable', 'string', 'max:190'],
            'status' => ['required', 'in:draft,published,archived'],
            'is_featured' => ['sometimes', 'boolean'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'media_ids' => ['nullable', 'array'],
            'media_ids.*' => ['integer', 'exists:media_assets,id'],
        ]);

        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['price_paise'] = (int) round(((float) $data['price_inr']) * 100);
        $data['sale_price_paise'] = $data['sale_price_inr'] !== null && $data['sale_price_inr'] !== ''
            ? (int) round(((float) $data['sale_price_inr']) * 100)
            : null;

        if ($data['sale_price_paise'] !== null && $data['sale_price_paise'] >= $data['price_paise']) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'sale_price_inr' => 'Sale price must be lower than the regular price.',
            ]);
        }

        if ($data['status'] === 'published' && empty($product?->published_at)) {
            $data['published_at'] = now();
        }

        $exists = Product::query()
            ->where('slug', $data['slug'])
            ->when($product, fn ($q) => $q->where('id', '!=', $product->id))
            ->exists();

        if ($exists) {
            $data['slug'] .= '-'.Str::lower(Str::random(4));
        }

        return $data;
    }

    /** @param  list<int|string>  $mediaIds */
    private function syncImages(Product $product, array $mediaIds): void
    {
        $product->images()->delete();

        foreach (array_values($mediaIds) as $index => $mediaId) {
            ProductImage::query()->create([
                'product_id' => $product->id,
                'media_asset_id' => (int) $mediaId,
                'sort_order' => $index,
                'is_primary' => $index === 0,
            ]);
        }
    }
}
