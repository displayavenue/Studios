<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
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
            'systems' => $catalog['systems'] ?? [],
            'organs' => $catalog['organs'] ?? [],
            'diseases' => $catalog['diseases'] ?? [],
            'mental' => $catalog['mental_conditions'] ?? [],
            'products' => $catalog['homeopathy_products'] ?? [],
            'disclaimer' => $catalog['disclaimer'] ?? '',
        ]);
    }

    public function updateDisclaimer(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'disclaimer' => ['required', 'string', 'max:4000'],
        ]);

        $catalog = $this->catalog();
        $catalog['disclaimer'] = $data['disclaimer'];
        $catalog['updated_at'] = now()->toDateString();
        $this->saveCatalog($catalog);

        return back()->with('status', 'Explorer disclaimer updated.');
    }

    /* ---------------- Systems ---------------- */

    public function createSystem(): View
    {
        return view('admin.health-explorer.system-form', ['system' => null]);
    }

    public function storeSystem(Request $request): RedirectResponse
    {
        $data = $this->validateSystem($request);
        $catalog = $this->catalog();
        $id = Str::slug($data['id'] ?: $data['name']);
        abort_if(collect($catalog['systems'] ?? [])->contains(fn ($s) => ($s['id'] ?? '') === $id), 422, 'System id already exists.');

        $catalog['systems'][] = [
            'id' => $id,
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
        ];
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'System added.');
    }

    public function editSystem(string $id): View
    {
        $system = collect($this->catalog()['systems'] ?? [])->firstWhere('id', $id);
        abort_unless($system, 404);

        return view('admin.health-explorer.system-form', ['system' => $system]);
    }

    public function updateSystem(Request $request, string $id): RedirectResponse
    {
        $data = $this->validateSystem($request, requireId: false);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['systems'] as &$system) {
            if (($system['id'] ?? null) === $id) {
                $system['name'] = $data['name'];
                $system['description'] = $data['description'] ?? '';
                $found = true;
                break;
            }
        }
        unset($system);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'System updated.');
    }

    public function destroySystem(string $id): RedirectResponse
    {
        $catalog = $this->catalog();
        $catalog['systems'] = array_values(array_filter(
            $catalog['systems'] ?? [],
            fn ($s) => ($s['id'] ?? null) !== $id
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'System deleted.');
    }

    /* ---------------- Organs ---------------- */

    public function createOrgan(): View
    {
        return view('admin.health-explorer.organ-form', [
            'organ' => null,
            'systems' => $this->catalog()['systems'] ?? [],
        ]);
    }

    public function storeOrgan(Request $request): RedirectResponse
    {
        $data = $this->validateOrgan($request);
        $catalog = $this->catalog();
        $slug = Str::slug($data['slug'] ?: $data['name']);
        abort_if(collect($catalog['organs'] ?? [])->contains(fn ($o) => ($o['slug'] ?? $o['id'] ?? '') === $slug), 422, 'Organ already exists.');

        $catalog['organs'][] = $this->organPayload($data, $slug);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Organ added.');
    }

    public function editOrgan(string $slug): View
    {
        $organ = $this->findBySlug($this->catalog()['organs'] ?? [], $slug);
        abort_unless($organ, 404);

        return view('admin.health-explorer.organ-form', [
            'organ' => $organ,
            'systems' => $this->catalog()['systems'] ?? [],
        ]);
    }

    public function updateOrgan(Request $request, string $slug): RedirectResponse
    {
        $data = $this->validateOrgan($request);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['organs'] as &$organ) {
            if (($organ['slug'] ?? null) === $slug || ($organ['id'] ?? null) === $slug) {
                $keepSlug = $organ['slug'] ?? $organ['id'] ?? $slug;
                $payload = $this->organPayload($data, $keepSlug, $organ);
                $organ = array_merge($organ, $payload);
                $found = true;
                break;
            }
        }
        unset($organ);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Organ updated.');
    }

    public function destroyOrgan(string $slug): RedirectResponse
    {
        $catalog = $this->catalog();
        $catalog['organs'] = array_values(array_filter(
            $catalog['organs'] ?? [],
            fn ($o) => ($o['slug'] ?? null) !== $slug && ($o['id'] ?? null) !== $slug
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Organ deleted.');
    }

    /* ---------------- Diseases ---------------- */

    public function createDisease(): View
    {
        return view('admin.health-explorer.disease-form', [
            'disease' => null,
            'organs' => $this->catalog()['organs'] ?? [],
        ]);
    }

    public function storeDisease(Request $request): RedirectResponse
    {
        $data = $this->validateDisease($request);
        $catalog = $this->catalog();
        $slug = Str::slug($data['slug'] ?: $data['name']);
        $catalog['diseases'][] = $this->diseasePayload($data, $slug);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Disease added.');
    }

    public function editDisease(string $slug): View
    {
        $disease = $this->findBySlug($this->catalog()['diseases'] ?? [], $slug);
        abort_unless($disease, 404);

        return view('admin.health-explorer.disease-form', [
            'disease' => $disease,
            'organs' => $this->catalog()['organs'] ?? [],
        ]);
    }

    public function updateDisease(Request $request, string $slug): RedirectResponse
    {
        $data = $this->validateDisease($request);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['diseases'] as &$disease) {
            if (($disease['slug'] ?? null) === $slug || ($disease['id'] ?? null) === $slug) {
                $keep = $disease['slug'] ?? $disease['id'] ?? $slug;
                $disease = array_merge($disease, $this->diseasePayload($data, $keep, $disease));
                $found = true;
                break;
            }
        }
        unset($disease);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Disease updated.');
    }

    public function destroyDisease(string $slug): RedirectResponse
    {
        $catalog = $this->catalog();
        $catalog['diseases'] = array_values(array_filter(
            $catalog['diseases'] ?? [],
            fn ($d) => ($d['slug'] ?? null) !== $slug && ($d['id'] ?? null) !== $slug
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Disease deleted.');
    }

    /* ---------------- Mental ---------------- */

    public function createMental(): View
    {
        return view('admin.health-explorer.mental-form', ['item' => null]);
    }

    public function storeMental(Request $request): RedirectResponse
    {
        $data = $this->validateMental($request);
        $catalog = $this->catalog();
        $slug = Str::slug($data['slug'] ?: $data['name']);
        $catalog['mental_conditions'][] = $this->mentalPayload($data, $slug);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Mental health topic added.');
    }

    public function editMental(string $slug): View
    {
        $item = $this->findBySlug($this->catalog()['mental_conditions'] ?? [], $slug);
        abort_unless($item, 404);

        return view('admin.health-explorer.mental-form', ['item' => $item]);
    }

    public function updateMental(Request $request, string $slug): RedirectResponse
    {
        $data = $this->validateMental($request);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['mental_conditions'] as &$item) {
            if (($item['slug'] ?? null) === $slug || ($item['id'] ?? null) === $slug) {
                $keep = $item['slug'] ?? $item['id'] ?? $slug;
                $item = array_merge($item, $this->mentalPayload($data, $keep, $item));
                $found = true;
                break;
            }
        }
        unset($item);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Mental health topic updated.');
    }

    public function destroyMental(string $slug): RedirectResponse
    {
        $catalog = $this->catalog();
        $catalog['mental_conditions'] = array_values(array_filter(
            $catalog['mental_conditions'] ?? [],
            fn ($m) => ($m['slug'] ?? null) !== $slug && ($m['id'] ?? null) !== $slug
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Mental health topic deleted.');
    }

    /* ---------------- Products ---------------- */

    public function createProduct(): View
    {
        return view('admin.health-explorer.product-form', ['product' => null]);
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $data = $this->validateProduct($request);
        $catalog = $this->catalog();
        $slug = Str::slug($data['slug'] ?: $data['name']);
        $catalog['homeopathy_products'][] = $this->productPayload($data, $slug);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Product added.');
    }

    public function editProduct(string $slug): View
    {
        $product = $this->findBySlug($this->catalog()['homeopathy_products'] ?? [], $slug);
        abort_unless($product, 404);

        return view('admin.health-explorer.product-form', ['product' => $product]);
    }

    public function updateProduct(Request $request, string $slug): RedirectResponse
    {
        $data = $this->validateProduct($request);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['homeopathy_products'] as &$product) {
            if (($product['slug'] ?? null) === $slug || ($product['id'] ?? null) === $slug) {
                $keep = $product['slug'] ?? $product['id'] ?? $slug;
                $product = array_merge($product, $this->productPayload($data, $keep, $product));
                $found = true;
                break;
            }
        }
        unset($product);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Product updated.');
    }

    public function destroyProduct(string $slug): RedirectResponse
    {
        $catalog = $this->catalog();
        $catalog['homeopathy_products'] = array_values(array_filter(
            $catalog['homeopathy_products'] ?? [],
            fn ($p) => ($p['slug'] ?? null) !== $slug && ($p['id'] ?? null) !== $slug
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.index')->with('status', 'Product deleted.');
    }

    /* ---------------- helpers ---------------- */

    private function validateSystem(Request $request, bool $requireId = true): array
    {
        return $request->validate([
            'id' => [$requireId ? 'nullable' : 'nullable', 'string', 'max:80'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function validateOrgan(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'system_id' => ['required', 'string', 'max:80'],
            'gender' => ['required', 'in:both,male,female'],
            'summary' => ['nullable', 'string'],
            'function' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'hotspot_front_cx' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hotspot_front_cy' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hotspot_side_cx' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hotspot_side_cy' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hotspot_back_cx' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hotspot_back_cy' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);
    }

    private function validateDisease(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'string'],
            'organ_ids' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
        ]);
    }

    private function validateMental(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
        ]);
    }

    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
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
    }

    private function organPayload(array $data, string $slug, ?array $existing = null): array
    {
        $genders = $data['gender'] === 'both' ? ['male', 'female'] : [$data['gender']];
        $hotspots = $existing['hotspots'] ?? [];
        foreach ($genders as $g) {
            $hotspots[$g] = [
                'front' => [
                    'cx' => (float) ($data['hotspot_front_cx'] ?? $hotspots[$g]['front']['cx'] ?? 50),
                    'cy' => (float) ($data['hotspot_front_cy'] ?? $hotspots[$g]['front']['cy'] ?? 40),
                    'r' => $hotspots[$g]['front']['r'] ?? 1.0,
                ],
                'side' => [
                    'cx' => (float) ($data['hotspot_side_cx'] ?? $hotspots[$g]['side']['cx'] ?? 50),
                    'cy' => (float) ($data['hotspot_side_cy'] ?? $hotspots[$g]['side']['cy'] ?? 40),
                    'r' => $hotspots[$g]['side']['r'] ?? 1.0,
                ],
                'back' => [
                    'cx' => (float) ($data['hotspot_back_cx'] ?? $hotspots[$g]['back']['cx'] ?? 50),
                    'cy' => (float) ($data['hotspot_back_cy'] ?? $hotspots[$g]['back']['cy'] ?? 40),
                    'r' => $hotspots[$g]['back']['r'] ?? 1.0,
                ],
            ];
        }

        return [
            'id' => $existing['id'] ?? $slug,
            'slug' => $slug,
            'name' => $data['name'],
            'system_id' => $data['system_id'],
            'gender' => $data['gender'],
            'summary' => $data['summary'] ?? '',
            'function' => $data['function'] ?? '',
            'description' => $data['description'] ?? '',
            'symptoms' => $this->linesToArray($data['symptoms'] ?? null, $existing['symptoms'] ?? []),
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
            'diseases' => $existing['diseases'] ?? [],
            'causes' => $existing['causes'] ?? [],
            'risk_factors' => $existing['risk_factors'] ?? [],
            'diagnostics' => $existing['diagnostics'] ?? [],
            'treatments' => $existing['treatments'] ?? [],
            'specialists' => $existing['specialists'] ?? [],
            'prevention' => $existing['prevention'] ?? [],
            'homeopathy_product_ids' => $existing['homeopathy_product_ids'] ?? [],
            'related_organ_ids' => $existing['related_organ_ids'] ?? [],
            'hotspots' => $hotspots,
        ];
    }

    private function diseasePayload(array $data, string $slug, ?array $existing = null): array
    {
        return [
            'id' => $existing['id'] ?? $slug,
            'slug' => $slug,
            'name' => $data['name'],
            'summary' => $data['summary'] ?? '',
            'description' => $data['description'] ?? '',
            'symptoms' => $this->linesToArray($data['symptoms'] ?? null, $existing['symptoms'] ?? []),
            'organ_ids' => $this->csvToArray($data['organ_ids'] ?? null, $existing['organ_ids'] ?? []),
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
        ];
    }

    private function mentalPayload(array $data, string $slug, ?array $existing = null): array
    {
        return [
            'id' => $existing['id'] ?? $slug,
            'slug' => $slug,
            'name' => $data['name'],
            'summary' => $data['summary'] ?? '',
            'description' => $data['description'] ?? '',
            'symptoms' => $this->linesToArray($data['symptoms'] ?? null, $existing['symptoms'] ?? []),
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
        ];
    }

    private function productPayload(array $data, string $slug, ?array $existing = null): array
    {
        return [
            'id' => $existing['id'] ?? $slug,
            'slug' => $slug,
            'name' => $data['name'],
            'ingredients' => $data['ingredients'] ?? '',
            'potency' => $data['potency'] ?? '',
            'manufacturer' => $data['manufacturer'] ?? '',
            'description' => $data['description'] ?? '',
            'traditional_claims' => $data['traditional_claims'] ?? '',
            'evidence_status' => $data['evidence_status'] ?? '',
            'safety_warnings' => $data['safety_warnings'] ?? '',
            'contraindications' => $data['contraindications'] ?? '',
            'seo_title' => $data['seo_title'] ?? null,
            'seo_description' => $data['seo_description'] ?? null,
        ];
    }

    private function linesToArray(?string $value, array $fallback = []): array
    {
        if ($value === null) {
            return $fallback;
        }
        $lines = preg_split('/\r\n|\r|\n/', $value) ?: [];

        return array_values(array_filter(array_map('trim', $lines), fn ($l) => $l !== ''));
    }

    private function csvToArray(?string $value, array $fallback = []): array
    {
        if ($value === null) {
            return $fallback;
        }

        return array_values(array_filter(array_map('trim', explode(',', $value)), fn ($v) => $v !== ''));
    }

    private function findBySlug(array $items, string $slug): ?array
    {
        return collect($items)->first(fn ($item) => ($item['slug'] ?? null) === $slug || ($item['id'] ?? null) === $slug);
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

    private function saveCatalog(array $catalog): void
    {
        $catalog['updated_at'] = now()->toDateString();
        $json = json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        File::put($this->catalogPath(), $json."\n");

        $mirror = base_path('../public_html/data/health-explorer/catalog.json');
        if (is_dir(dirname($mirror))) {
            @File::put($mirror, $json."\n");
        }
    }
}
