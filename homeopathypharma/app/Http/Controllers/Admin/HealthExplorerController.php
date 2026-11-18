<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
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

    /** Visual anatomy editor — same figures/dots as the public explorer. */
    public function anatomyEditor(): View
    {
        $catalog = $this->catalog();

        return view('admin.health-explorer.anatomy-editor', [
            'catalog' => $catalog,
            'systems' => $catalog['systems'] ?? [],
            'organs' => $catalog['organs'] ?? [],
            'diseases' => $catalog['diseases'] ?? [],
            'products' => $catalog['homeopathy_products'] ?? [],
        ]);
    }

    /** Save one organ (info + hotspots) from the visual anatomy editor. */
    public function saveAnatomyOrgan(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'system_id' => ['required', 'string', 'max:80'],
            'gender' => ['required', 'in:both,male,female'],
            'summary' => ['nullable', 'string'],
            'function' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'array'],
            'symptoms.*' => ['string', 'max:240'],
            'causes' => ['nullable', 'array'],
            'causes.*' => ['string', 'max:240'],
            'risk_factors' => ['nullable', 'array'],
            'risk_factors.*' => ['string', 'max:240'],
            'diagnostics' => ['nullable', 'array'],
            'diagnostics.*' => ['string', 'max:240'],
            'treatments' => ['nullable', 'array'],
            'treatments.*' => ['string', 'max:240'],
            'specialists' => ['nullable', 'array'],
            'specialists.*' => ['string', 'max:240'],
            'prevention' => ['nullable', 'array'],
            'prevention.*' => ['string', 'max:240'],
            'diseases' => ['nullable', 'array'],
            'diseases.*' => ['string', 'max:120'],
            'homeopathy_product_ids' => ['nullable', 'array'],
            'homeopathy_product_ids.*' => ['string', 'max:120'],
            'related_organ_ids' => ['nullable', 'array'],
            'related_organ_ids.*' => ['string', 'max:120'],
            'hotspots' => ['required', 'array'],
        ]);

        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['organs'] as &$organ) {
            if (($organ['id'] ?? null) !== $data['id'] && ($organ['slug'] ?? null) !== $data['id']) {
                continue;
            }
            $found = true;
            $organ['name'] = $data['name'];
            $organ['system_id'] = $data['system_id'];
            $organ['gender'] = $data['gender'];
            $organ['summary'] = $data['summary'] ?? '';
            $organ['function'] = $data['function'] ?? '';
            $organ['description'] = $data['description'] ?? '';
            $organ['symptoms'] = array_values($data['symptoms'] ?? []);
            $organ['causes'] = array_values($data['causes'] ?? []);
            $organ['risk_factors'] = array_values($data['risk_factors'] ?? []);
            $organ['diagnostics'] = array_values($data['diagnostics'] ?? []);
            $organ['treatments'] = array_values($data['treatments'] ?? []);
            $organ['specialists'] = array_values($data['specialists'] ?? []);
            $organ['prevention'] = array_values($data['prevention'] ?? []);
            $organ['diseases'] = array_values($data['diseases'] ?? []);
            $organ['homeopathy_product_ids'] = array_values($data['homeopathy_product_ids'] ?? []);
            $organ['related_organ_ids'] = array_values($data['related_organ_ids'] ?? []);
            $organ['hotspots'] = $this->normalizeHotspots($data['hotspots'], $data['gender'], $organ['hotspots'] ?? []);
            break;
        }
        unset($organ);

        abort_unless($found, 404, 'Organ not found.');
        $this->saveCatalog($catalog);

        $saved = collect($catalog['organs'])->first(
            fn ($o) => ($o['id'] ?? null) === $data['id'] || ($o['slug'] ?? null) === $data['id']
        );

        return response()->json(['ok' => true, 'organ' => $saved]);
    }

    /** Create a new organ from the visual anatomy editor (name + position only). */
    public function storeAnatomyOrgan(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'system_id' => ['nullable', 'string', 'max:80'],
            'gender' => ['nullable', 'in:both,male,female'],
            'cx' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'cy' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'view' => ['nullable', 'in:front,back,side'],
            'body_gender' => ['nullable', 'in:female,male'],
        ]);

        $catalog = $this->catalog();
        $name = trim($data['name']);
        $slug = Str::slug($name);
        abort_if($slug === '', 422, 'Invalid name.');
        abort_if(
            collect($catalog['organs'] ?? [])->contains(fn ($o) => ($o['slug'] ?? $o['id'] ?? '') === $slug),
            422,
            'An organ with this name already exists.'
        );

        $draft = $this->autoFillOrganFromName($name, $catalog);
        $gender = $data['gender'] ?? $draft['gender'];
        $systemId = ($data['system_id'] ?? null) ?: $draft['system_id'];

        $cx = (float) ($data['cx'] ?? 50);
        $cy = (float) ($data['cy'] ?? 40);
        $view = $data['view'] ?? 'front';
        $bodyGender = $data['body_gender'] ?? 'female';
        $spot = ['cx' => $cx, 'cy' => $cy, 'r' => 1.15];
        $blank = ['cx' => 50.0, 'cy' => 40.0, 'r' => 1.15];
        $makeGenderHotspots = function () use ($view, $spot, $blank) {
            return [
                'front' => $view === 'front' ? $spot : $blank,
                'side' => $view === 'side' ? $spot : $blank,
                'back' => $view === 'back' ? $spot : $blank,
            ];
        };

        $hotspots = [
            'female' => $makeGenderHotspots(),
            'male' => $makeGenderHotspots(),
        ];
        if (isset($hotspots[$bodyGender])) {
            $hotspots[$bodyGender][$view] = $spot;
        }

        $organ = array_merge($draft, [
            'id' => $slug,
            'slug' => $slug,
            'name' => $name,
            'system_id' => $systemId,
            'gender' => $gender,
            'hotspots' => $hotspots,
        ]);

        $catalog['organs'][] = $organ;
        $this->saveCatalog($catalog);

        return response()->json(['ok' => true, 'organ' => $organ], 201);
    }

    /** Bulk-save organ hotspot maps (and optional field patches) from the anatomy editor. */
    public function saveAnatomyBulk(Request $request): JsonResponse
    {
        $data = $request->validate([
            'organs' => ['required', 'array', 'min:1'],
            'organs.*.id' => ['required', 'string', 'max:120'],
            'organs.*.hotspots' => ['required', 'array'],
            'organs.*.name' => ['nullable', 'string', 'max:160'],
            'organs.*.system_id' => ['nullable', 'string', 'max:80'],
            'organs.*.gender' => ['nullable', 'in:both,male,female'],
        ]);

        $catalog = $this->catalog();
        $saved = 0;
        foreach ($data['organs'] as $patch) {
            foreach ($catalog['organs'] as &$organ) {
                if (($organ['id'] ?? null) !== $patch['id'] && ($organ['slug'] ?? null) !== $patch['id']) {
                    continue;
                }
                $gender = $patch['gender'] ?? $organ['gender'] ?? 'both';
                if (! empty($patch['name'])) {
                    $organ['name'] = $patch['name'];
                }
                if (! empty($patch['system_id'])) {
                    $organ['system_id'] = $patch['system_id'];
                }
                if (! empty($patch['gender'])) {
                    $organ['gender'] = $patch['gender'];
                }
                $organ['hotspots'] = $this->normalizeHotspots($patch['hotspots'], $gender, $organ['hotspots'] ?? []);
                $saved++;
                break;
            }
            unset($organ);
        }

        abort_if($saved === 0, 404, 'No matching organs to save.');
        $this->saveCatalog($catalog);

        return response()->json([
            'ok' => true,
            'saved' => $saved,
            'organs' => $catalog['organs'],
        ]);
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

    /**
     * Auto-build organ copy + system guess from a display name so admins only type the name.
     *
     * @return array<string, mixed>
     */
    private function autoFillOrganFromName(string $name, array $catalog): array
    {
        $lower = Str::lower($name);
        $systems = collect($catalog['systems'] ?? []);
        $fallbackSystem = (string) (($systems->first(fn ($s) => ($s['id'] ?? '') !== 'mental')['id'] ?? null)
            ?: ($systems->first()['id'] ?? null)
            ?: 'general');

        $guesses = [
            'cardiovascular' => ['heart', 'blood', 'vessel', 'artery', 'vein', 'cardio'],
            'respiratory' => ['lung', 'bronch', 'airway', 'respir', 'throat', 'trachea'],
            'digestive' => ['stomach', 'liver', 'intestin', 'pancrea', 'gall', 'colon', 'digest', 'bowel', 'spleen'],
            'nervous' => ['brain', 'nerve', 'spine', 'spinal', 'eye', 'neurolog'],
            'endocrine' => ['thyroid', 'hormon', 'adrenal', 'pituitary', 'pancrea', 'thymus', 'pineal', 'parathyroid'],
            'urinary' => ['kidney', 'bladder', 'urin', 'prostate'],
            'reproductive' => ['uterus', 'ovary', 'testis', 'testicle', 'prostate', 'reproductive', 'breast'],
            'musculoskeletal' => ['muscle', 'joint', 'bone', 'knee', 'hip', 'shoulder', 'spine', 'coccyx', 'sacrum', 'rib', 'skull', 'vertebra'],
            'integumentary' => ['skin', 'derm', 'hair', 'nail'],
        ];

        $systemId = $fallbackSystem;
        foreach ($guesses as $id => $needles) {
            foreach ($needles as $needle) {
                if (str_contains($lower, $needle) && $systems->contains(fn ($s) => ($s['id'] ?? '') === $id)) {
                    $systemId = $id;
                    break 2;
                }
            }
        }

        $gender = 'both';
        if (str_contains($lower, 'uterus') || str_contains($lower, 'ovary') || str_contains($lower, 'female')) {
            $gender = 'female';
        } elseif (str_contains($lower, 'testis') || str_contains($lower, 'testicle') || str_contains($lower, 'male reproductive')) {
            $gender = 'male';
        }

        $products = collect($catalog['homeopathy_products'] ?? []);
        $linkedProducts = $products
            ->filter(function ($p) use ($lower, $name) {
                $hay = Str::lower(($p['name'] ?? '').' '.($p['description'] ?? '').' '.($p['traditional_claims'] ?? ''));

                return str_contains($hay, $lower) || str_contains($hay, Str::lower(Str::singular($name)));
            })
            ->take(3)
            ->map(fn ($p) => $p['id'] ?? $p['slug'] ?? null)
            ->filter()
            ->values()
            ->all();

        $diseases = collect($catalog['diseases'] ?? [])
            ->filter(function ($d) use ($lower, $name) {
                $hay = Str::lower(($d['name'] ?? '').' '.($d['summary'] ?? '').' '.implode(' ', $d['organ_ids'] ?? []));

                return str_contains($hay, $lower) || str_contains($hay, Str::slug($name));
            })
            ->take(4)
            ->map(fn ($d) => $d['id'] ?? $d['slug'] ?? null)
            ->filter()
            ->values()
            ->all();

        return [
            'system_id' => $systemId,
            'gender' => $gender,
            'summary' => "Educational overview of the {$name} and common concerns people explore in homeopathy.",
            'function' => "The {$name} contributes to normal body function; imbalance here may show as local or referred symptoms.",
            'description' => "This Health Explorer entry covers the {$name}: what it does, typical symptoms people notice, supportive care context, and related homeopathic product references. Content is for education only and is not a diagnosis or prescription.",
            'symptoms' => [
                "Discomfort around the {$name}",
                'Changes in usual function',
                'Fatigue or reduced stamina',
                'Referred sensations nearby',
            ],
            'causes' => [
                'Lifestyle and stress factors',
                'Inflammation or irritation',
                'Injury, strain, or overuse',
                'Underlying medical conditions',
            ],
            'risk_factors' => [
                'Family history',
                'Sedentary habits',
                'Poor diet or hydration',
                'Chronic stress',
            ],
            'diagnostics' => [
                'Clinical history and examination',
                'Relevant lab or imaging tests when advised',
                'Specialist review if symptoms persist',
            ],
            'treatments' => [
                'Medical evaluation when needed',
                'Lifestyle and supportive care',
                'Prescribed treatment from a qualified practitioner',
                'Educational homeopathy product references below',
            ],
            'specialists' => [
                'General practitioner',
                'Relevant organ specialist',
                'Qualified homeopathy practitioner (adjunct education)',
            ],
            'prevention' => [
                'Balanced diet and hydration',
                'Regular movement and rest',
                'Stress management',
                'Routine check-ups',
            ],
            'diseases' => $diseases,
            'homeopathy_product_ids' => $linkedProducts,
            'related_organ_ids' => [],
            'seo_title' => "{$name} — Human Health Explorer",
            'seo_description' => "Learn about the {$name}, common symptoms, and educational homeopathy references.",
        ];
    }

    /**
     * @param  array<string, mixed>  $incoming
     * @param  array<string, mixed>  $existing
     * @return array<string, mixed>
     */
    private function normalizeHotspots(array $incoming, string $gender, array $existing = []): array
    {
        $targets = $gender === 'both' ? ['female', 'male'] : [$gender];
        $out = $existing;

        foreach ($targets as $g) {
            $src = $incoming[$g] ?? [];
            foreach (['front', 'side', 'back'] as $view) {
                $spot = $src[$view] ?? $existing[$g][$view] ?? ['cx' => 50, 'cy' => 40, 'r' => 1.15];
                $out[$g][$view] = [
                    'cx' => round(max(0, min(100, (float) ($spot['cx'] ?? 50))), 2),
                    'cy' => round(max(0, min(100, (float) ($spot['cy'] ?? 40))), 2),
                    'r' => round((float) ($spot['r'] ?? 1.15), 2),
                ];
            }
        }

        return $out;
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
