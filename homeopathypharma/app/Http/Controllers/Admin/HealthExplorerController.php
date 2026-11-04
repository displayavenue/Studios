<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\View\View;

class HealthExplorerController extends Controller
{
    public function index(): View
    {
        $catalog = $this->catalog();

        return view('admin.health-explorer.index', [
            'counts' => [
                'systems' => count($catalog['systems'] ?? []),
                'organs' => count($catalog['organs'] ?? []),
                'diseases' => count($catalog['diseases'] ?? []),
                'mental' => count($catalog['mental_conditions'] ?? []),
                'products' => count($catalog['homeopathy_products'] ?? []),
            ],
            'organs' => $catalog['organs'] ?? [],
            'diseases' => $catalog['diseases'] ?? [],
            'mental' => $catalog['mental_conditions'] ?? [],
            'products' => $catalog['homeopathy_products'] ?? [],
            'disclaimer' => $catalog['disclaimer'] ?? '',
        ]);
    }

    public function editProduct(string $slug): View
    {
        $catalog = $this->catalog();
        $product = collect($catalog['homeopathy_products'] ?? [])->firstWhere('slug', $slug)
            ?? collect($catalog['homeopathy_products'] ?? [])->firstWhere('id', $slug);

        abort_unless($product, 404);

        return view('admin.health-explorer.product-form', [
            'product' => $product,
        ]);
    }

    public function updateProduct(Request $request, string $slug): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'ingredients' => ['nullable', 'string', 'max:255'],
            'potency' => ['nullable', 'string', 'max:120'],
            'manufacturer' => ['nullable', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'traditional_claims' => ['nullable', 'string'],
            'evidence_status' => ['nullable', 'string'],
            'safety_warnings' => ['nullable', 'string'],
            'contraindications' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
        ]);

        $path = $this->catalogPath();
        $catalog = $this->catalog();
        $updated = false;

        foreach ($catalog['homeopathy_products'] as &$product) {
            if (($product['slug'] ?? null) === $slug || ($product['id'] ?? null) === $slug) {
                $product = array_merge($product, $data);
                $updated = true;
                break;
            }
        }
        unset($product);

        abort_unless($updated, 404);

        File::put($path, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        // Keep public_html mirror in sync on Hostinger-style deploys when both trees exist.
        $mirror = base_path('../public_html/data/health-explorer/catalog.json');
        if (is_dir(dirname($mirror))) {
            @File::put($mirror, File::get($path));
        }

        return redirect()
            ->route('admin.health-explorer.index')
            ->with('status', 'Homeopathy product updated in explorer catalogue.');
    }

    public function editOrgan(string $slug): View
    {
        $catalog = $this->catalog();
        $organ = collect($catalog['organs'] ?? [])->firstWhere('slug', $slug)
            ?? collect($catalog['organs'] ?? [])->firstWhere('id', $slug);
        abort_unless($organ, 404);

        return view('admin.health-explorer.organ-form', ['organ' => $organ]);
    }

    public function updateOrgan(Request $request, string $slug): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'summary' => ['nullable', 'string'],
            'function' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
        ]);

        $path = $this->catalogPath();
        $catalog = $this->catalog();
        $updated = false;

        foreach ($catalog['organs'] as &$organ) {
            if (($organ['slug'] ?? null) === $slug || ($organ['id'] ?? null) === $slug) {
                $organ['name'] = $data['name'];
                $organ['summary'] = $data['summary'] ?? $organ['summary'] ?? '';
                $organ['function'] = $data['function'] ?? $organ['function'] ?? '';
                $organ['description'] = $data['description'] ?? $organ['description'] ?? '';
                $organ['seo_title'] = $data['seo_title'] ?? null;
                $organ['seo_description'] = $data['seo_description'] ?? null;
                $updated = true;
                break;
            }
        }
        unset($organ);

        abort_unless($updated, 404);
        File::put($path, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        return redirect()
            ->route('admin.health-explorer.index')
            ->with('status', 'Organ updated in explorer catalogue.');
    }

    private function catalogPath(): string
    {
        return public_path('data/health-explorer/catalog.json');
    }

    private function catalog(): array
    {
        $path = $this->catalogPath();
        abort_unless(File::exists($path), 404, 'Explorer catalogue missing.');

        return json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
    }
}
