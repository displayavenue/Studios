<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class BrandController extends Controller
{
    public function index(): View
    {
        return view('admin.brands.index', [
            'brands' => Brand::query()->orderBy('sort_order')->orderBy('name')->paginate(20),
        ]);
    }

    public function create(): View
    {
        return view('admin.brands.form', [
            'brand' => new Brand(['status' => 'draft']),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Brand::query()->create($data);

        return redirect()->route('admin.brands.index')->with('status', 'Brand created.');
    }

    public function edit(Brand $brand): View
    {
        return view('admin.brands.form', [
            'brand' => $brand,
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $brand->update($this->validated($request, $brand));

        return redirect()->route('admin.brands.index')->with('status', 'Brand updated.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            return back()->withErrors(['brand' => 'Archive or reassign products before deleting this brand.']);
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')->with('status', 'Brand deleted.');
    }

    private function validated(Request $request, ?Brand $brand = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'logo_media_id' => ['nullable', 'exists:media_assets,id'],
            'status' => ['required', 'in:draft,published,archived'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $exists = Brand::query()
            ->where('slug', $data['slug'])
            ->when($brand, fn ($q) => $q->where('id', '!=', $brand->id))
            ->exists();

        if ($exists) {
            $data['slug'] .= '-'.Str::lower(Str::random(4));
        }

        return $data;
    }
}
