<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HealthExplorerCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\View\View;

class HealthExplorerController extends Controller
{
    public function __construct(private HealthExplorerCatalog $explorerCatalog)
    {
    }

    public function index(): View
    {
        $catalog = $this->catalog();
        $systems = collect($catalog['systems'] ?? [])
            ->sortBy(fn ($s) => [$s['sort_order'] ?? 100, $s['name'] ?? ''])
            ->values()
            ->all();

        return view('admin.health-explorer.index', [
            'counts' => [
                'systems' => count($catalog['systems'] ?? []),
                'organs' => count($catalog['organs'] ?? []),
                'diseases' => count($catalog['diseases'] ?? []),
                'mental' => count($catalog['mental_conditions'] ?? []),
                'products' => count($catalog['homeopathy_products'] ?? []),
            ],
            'systems' => $systems,
            'organs' => $catalog['organs'] ?? [],
            'diseases' => $catalog['diseases'] ?? [],
            'mental' => $catalog['mental_conditions'] ?? [],
            'products' => $catalog['homeopathy_products'] ?? [],
            'disclaimer' => $catalog['disclaimer'] ?? '',
            'organCountsBySystem' => $this->organCountsBySystem($catalog['organs'] ?? []),
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
        // Repair organs that were created with only a name (empty details).
        if ($this->backfillEmptyOrgans($catalog)) {
            $this->saveCatalog($catalog);
            $catalog = $this->catalog();
        }

        return view('admin.health-explorer.anatomy-editor', [
            'catalog' => $catalog,
            'systems' => $catalog['systems'] ?? [],
            'organs' => $catalog['organs'] ?? [],
            'diseases' => $catalog['diseases'] ?? [],
            'products' => $catalog['homeopathy_products'] ?? [],
        ]);
    }

    /** Fill missing organ details from its name (for dots created before autofill). */
    public function autofillAnatomyOrgan(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:120'],
            'force' => ['nullable', 'boolean'],
        ]);

        $catalog = $this->catalog();
        $found = false;
        $saved = null;
        foreach ($catalog['organs'] as &$organ) {
            if (($organ['id'] ?? null) !== $data['id'] && ($organ['slug'] ?? null) !== $data['id']) {
                continue;
            }
            $this->applyAutoFillToOrgan($organ, $catalog, empty($data['force']));
            $found = true;
            $saved = $organ;
            break;
        }
        unset($organ);
        abort_unless($found, 404, 'Organ not found.');
        $this->saveCatalog($catalog);

        return response()->json(['ok' => true, 'organ' => $saved]);
    }

    /** Save one organ (info + hotspots) from the visual anatomy editor. */
    public function saveAnatomyOrgan(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'system_id' => ['nullable', 'string', 'max:80'],
            'system_ids' => ['nullable', 'array', 'min:1'],
            'system_ids.*' => ['string', 'max:80'],
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
            'hotspots_by_system' => ['nullable', 'array'],
        ]);

        $systemIds = $this->resolveSystemIdsInput($data);
        abort_if($systemIds === [], 422, 'Select at least one body system.');

        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['organs'] as &$organ) {
            if (($organ['id'] ?? null) !== $data['id'] && ($organ['slug'] ?? null) !== $data['id']) {
                continue;
            }
            $found = true;
            $organ['name'] = $data['name'];
            $this->applyOrganSystems($organ, $systemIds);
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
            if (array_key_exists('hotspots_by_system', $data)) {
                $organ['hotspots_by_system'] = $this->normalizeHotspotsBySystem(
                    is_array($data['hotspots_by_system']) ? $data['hotspots_by_system'] : [],
                    $data['gender'],
                    is_array($organ['hotspots_by_system'] ?? null) ? $organ['hotspots_by_system'] : []
                );
            }
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
            'system_ids' => ['nullable', 'array'],
            'system_ids.*' => ['string', 'max:80'],
            'gender' => ['nullable', 'in:both,male,female'],
            'cx' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'cy' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'view' => ['nullable', 'in:front,back,left,right,side'],
            'body_gender' => ['nullable', 'in:female,male'],
        ]);

        $catalog = $this->catalog();
        $name = trim($data['name']);
        $slug = Str::slug($name);
        abort_if($slug === '', 422, 'Invalid name.');

        $cx = (float) ($data['cx'] ?? 50);
        $cy = (float) ($data['cy'] ?? 40);
        $view = $data['view'] ?? 'front';
        if ($view === 'side') {
            $view = 'left';
        }
        $bodyGender = $data['body_gender'] ?? 'female';
        $spot = ['cx' => $cx, 'cy' => $cy, 'r' => 1.15];
        $requestedSystems = $this->resolveSystemIdsInput($data);

        // If this organ already exists, only add/update the red dot on this body + view.
        foreach ($catalog['organs'] as &$existing) {
            if (($existing['slug'] ?? null) !== $slug && ($existing['id'] ?? null) !== $slug) {
                continue;
            }
            // Placing while filtered to a system writes a per-system spot (keeps other systems' positions).
            $targetSystem = $requestedSystems[0] ?? null;
            if ($targetSystem) {
                $this->writeSystemHotspot($existing, $targetSystem, $bodyGender, $view, $spot);
                $merged = array_values(array_unique(array_merge(
                    HealthExplorerCatalog::normalizeOrganSystemIds($existing),
                    $requestedSystems
                )));
                $this->applyOrganSystems($existing, $merged);
            } else {
                $existing['hotspots'] = is_array($existing['hotspots'] ?? null) ? $existing['hotspots'] : [];
                $existing['hotspots'][$bodyGender] = is_array($existing['hotspots'][$bodyGender] ?? null)
                    ? $existing['hotspots'][$bodyGender]
                    : [];
                $existing['hotspots'][$bodyGender][$view] = $spot;
            }
            $this->saveCatalog($catalog);

            return response()->json(['ok' => true, 'organ' => $existing, 'updated_view' => true]);
        }
        unset($existing);

        $draft = $this->autoFillOrganFromName($name, $catalog);
        $gender = $data['gender'] ?? $draft['gender'];
        $systemIds = $requestedSystems !== []
            ? $requestedSystems
            : HealthExplorerCatalog::normalizeOrganSystemIds($draft);

        // New organ: place a red dot only on the current body + view.
        $hotspots = [
            'female' => [],
            'male' => [],
        ];
        $hotspots[$bodyGender][$view] = $spot;
        $hotspotsBySystem = [];
        $primarySystem = $systemIds[0] ?? null;
        if ($primarySystem) {
            $hotspotsBySystem[$primarySystem] = [
                'female' => [],
                'male' => [],
            ];
            $hotspotsBySystem[$primarySystem][$bodyGender][$view] = $spot;
        }

        $organ = array_merge($draft, [
            'id' => $slug,
            'slug' => $slug,
            'name' => $name,
            'gender' => $gender,
            'hotspots' => $hotspots,
            'hotspots_by_system' => $hotspotsBySystem,
        ]);
        $this->applyOrganSystems($organ, $systemIds);

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
            'organs.*.system_ids' => ['nullable', 'array'],
            'organs.*.system_ids.*' => ['string', 'max:80'],
            'organs.*.gender' => ['nullable', 'in:both,male,female'],
            'organs.*.hotspots_by_system' => ['nullable', 'array'],
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
                $systemIds = $this->resolveSystemIdsInput($patch);
                if ($systemIds !== []) {
                    $this->applyOrganSystems($organ, $systemIds);
                }
                if (! empty($patch['gender'])) {
                    $organ['gender'] = $patch['gender'];
                }
                $organ['hotspots'] = $this->normalizeHotspots($patch['hotspots'], $gender, $organ['hotspots'] ?? []);
                if (array_key_exists('hotspots_by_system', $patch)) {
                    $organ['hotspots_by_system'] = $this->normalizeHotspotsBySystem(
                        is_array($patch['hotspots_by_system']) ? $patch['hotspots_by_system'] : [],
                        $gender,
                        is_array($organ['hotspots_by_system'] ?? null) ? $organ['hotspots_by_system'] : []
                    );
                }
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

    public function systemsIndex(): View
    {
        $catalog = $this->catalog();
        $systems = collect($catalog['systems'] ?? [])
            ->sortBy(fn ($s) => [$s['sort_order'] ?? 100, $s['name'] ?? ''])
            ->values()
            ->all();

        return view('admin.health-explorer.systems-index', [
            'systems' => $systems,
            'organCountsBySystem' => $this->organCountsBySystem($catalog['organs'] ?? []),
        ]);
    }

    public function createSystem(): View
    {
        return view('admin.health-explorer.system-form', [
            'system' => null,
            'organs' => [],
        ]);
    }

    public function storeSystem(Request $request): RedirectResponse
    {
        $data = $this->validateSystem($request);
        $catalog = $this->catalog();
        $id = Str::slug($data['id'] ?: $data['name']);
        abort_if(collect($catalog['systems'] ?? [])->contains(fn ($s) => ($s['id'] ?? '') === $id), 422, 'System id already exists.');

        $catalog['systems'][] = $this->systemPayload($data, $id);
        $this->saveCatalog($catalog);

        return redirect()
            ->route('admin.health-explorer.systems.edit', $id)
            ->with('status', 'System added. Edit this system independently — your changes are stored separately from other systems.');
    }

    public function editSystem(string $id): View
    {
        $catalog = $this->catalog();
        $system = collect($catalog['systems'] ?? [])->firstWhere('id', $id);
        abort_unless($system, 404);

        $organs = array_values(array_filter(
            $catalog['organs'] ?? [],
            fn ($o) => HealthExplorerCatalog::organBelongsToSystem($o, $id)
        ));

        return view('admin.health-explorer.system-form', [
            'system' => $system,
            'organs' => $organs,
        ]);
    }

    public function updateSystem(Request $request, string $id): RedirectResponse
    {
        $data = $this->validateSystem($request, requireId: false);
        $catalog = $this->catalog();
        $found = false;
        foreach ($catalog['systems'] as &$system) {
            if (($system['id'] ?? null) === $id) {
                $system = $this->systemPayload($data, $id, $system);
                $found = true;
                break;
            }
        }
        unset($system);
        abort_unless($found, 404);
        $this->saveCatalog($catalog);

        return redirect()
            ->route('admin.health-explorer.systems.edit', $id)
            ->with('status', 'System updated. Only this system was changed — other systems and organs were left alone.');
    }

    public function destroySystem(string $id): RedirectResponse
    {
        $catalog = $this->catalog();
        $linked = collect($catalog['organs'] ?? [])->contains(
            fn ($o) => HealthExplorerCatalog::organBelongsToSystem($o, $id)
        );
        abort_if($linked, 422, 'Remove or reassign organs in this system before deleting it.');

        $catalog['systems'] = array_values(array_filter(
            $catalog['systems'] ?? [],
            fn ($s) => ($s['id'] ?? null) !== $id
        ));
        $this->saveCatalog($catalog);

        return redirect()->route('admin.health-explorer.systems.index')->with('status', 'System deleted.');
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
            'id' => ['nullable', 'string', 'max:80'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:4000'],
            'summary' => ['nullable', 'string'],
            'function' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'string'],
            'causes' => ['nullable', 'string'],
            'treatments' => ['nullable', 'string'],
            'specialists' => ['nullable', 'string'],
            'prevention' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:180'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'enabled' => ['nullable', 'boolean'],
            'overlay_mode' => ['nullable', 'in:none,full_figure,vessels'],
            'overlay_female_front' => ['nullable', 'string', 'max:255'],
            'overlay_male_front' => ['nullable', 'string', 'max:255'],
            'overlay_female_back' => ['nullable', 'string', 'max:255'],
            'overlay_male_back' => ['nullable', 'string', 'max:255'],
            'overlay_female_side' => ['nullable', 'string', 'max:255'],
            'overlay_male_side' => ['nullable', 'string', 'max:255'],
            'overlay_female_side_left' => ['nullable', 'string', 'max:255'],
            'overlay_male_side_left' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function systemPayload(array $data, string $id, ?array $existing = null): array
    {
        $overlays = is_array($existing['overlays'] ?? null) ? $existing['overlays'] : [];
        foreach (['female', 'male'] as $gender) {
            if (! isset($overlays[$gender]) || ! is_array($overlays[$gender])) {
                $overlays[$gender] = [];
            }
            foreach (['front', 'back', 'side', 'side-left'] as $view) {
                $field = 'overlay_'.$gender.'_'.str_replace('-', '_', $view);
                if (array_key_exists($field, $data)) {
                    $path = trim((string) ($data[$field] ?? ''));
                    if ($path === '') {
                        unset($overlays[$gender][$view]);
                    } else {
                        $overlays[$gender][$view] = $path;
                    }
                }
            }
            if ($overlays[$gender] === []) {
                unset($overlays[$gender]);
            }
        }

        return [
            'id' => $id,
            'name' => $data['name'],
            'description' => $data['description'] ?? ($existing['description'] ?? ''),
            'summary' => $data['summary'] ?? ($existing['summary'] ?? ''),
            'function' => $data['function'] ?? ($existing['function'] ?? ''),
            'symptoms' => $this->linesToArray($data['symptoms'] ?? null, $existing['symptoms'] ?? []),
            'causes' => $this->linesToArray($data['causes'] ?? null, $existing['causes'] ?? []),
            'treatments' => $this->linesToArray($data['treatments'] ?? null, $existing['treatments'] ?? []),
            'specialists' => $this->linesToArray($data['specialists'] ?? null, $existing['specialists'] ?? []),
            'prevention' => $this->linesToArray($data['prevention'] ?? null, $existing['prevention'] ?? []),
            'seo_title' => $data['seo_title'] ?? ($existing['seo_title'] ?? null),
            'seo_description' => $data['seo_description'] ?? ($existing['seo_description'] ?? null),
            'sort_order' => (int) ($data['sort_order'] ?? $existing['sort_order'] ?? 100),
            'enabled' => array_key_exists('enabled', $data)
                ? (bool) $data['enabled']
                : (bool) ($existing['enabled'] ?? true),
            'overlay_mode' => $data['overlay_mode'] ?? ($existing['overlay_mode'] ?? 'none'),
            'overlays' => $overlays,
        ];
    }

    private function validateOrgan(Request $request): array
    {
        $data = $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:160'],
            'system_id' => ['nullable', 'string', 'max:80'],
            'system_ids' => ['nullable', 'array', 'min:1'],
            'system_ids.*' => ['string', 'max:80'],
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
        abort_if($this->resolveSystemIdsInput($data) === [], 422, 'Select at least one body system.');

        return $data;
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

        $systemIds = $this->resolveSystemIdsInput($data);
        if ($systemIds === [] && $existing) {
            $systemIds = HealthExplorerCatalog::normalizeOrganSystemIds($existing);
        }

        return [
            'id' => $existing['id'] ?? $slug,
            'slug' => $slug,
            'name' => $data['name'],
            'system_id' => $systemIds[0] ?? '',
            'system_ids' => $systemIds,
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
            'hotspots_by_system' => is_array($existing['hotspots_by_system'] ?? null)
                ? $existing['hotspots_by_system']
                : [],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return list<string>
     */
    private function resolveSystemIdsInput(array $data): array
    {
        return HealthExplorerCatalog::normalizeOrganSystemIds([
            'system_id' => $data['system_id'] ?? '',
            'system_ids' => $data['system_ids'] ?? [],
        ]);
    }

    /**
     * @param  array<string, mixed>  $organ
     * @param  list<string>  $systemIds
     */
    private function applyOrganSystems(array &$organ, array $systemIds): void
    {
        $ids = HealthExplorerCatalog::normalizeOrganSystemIds([
            'system_ids' => $systemIds,
        ]);
        $organ['system_ids'] = $ids;
        $organ['system_id'] = $ids[0] ?? '';
    }

    /**
     * @param  list<array<string, mixed>>  $organs
     * @return array<string, int>
     */
    private function organCountsBySystem(array $organs): array
    {
        $counts = [];
        foreach ($organs as $organ) {
            foreach (HealthExplorerCatalog::normalizeOrganSystemIds($organ) as $systemId) {
                $counts[$systemId] = ($counts[$systemId] ?? 0) + 1;
            }
        }

        return $counts;
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
    /**
     * @param  array<string, mixed>  $catalog
     */
    private function backfillEmptyOrgans(array &$catalog): bool
    {
        $changed = false;
        foreach ($catalog['organs'] as &$organ) {
            if ($this->applyAutoFillToOrgan($organ, $catalog, true)) {
                $changed = true;
            }
        }
        unset($organ);

        return $changed;
    }

    /**
     * Merge name-based defaults into an organ. When $emptyOnly is true, only
     * organs missing core details are repaired (blank fields + guessed system).
     *
     * @param  array<string, mixed>  $organ
     * @param  array<string, mixed>  $catalog
     */
    private function applyAutoFillToOrgan(array &$organ, array $catalog, bool $emptyOnly = true): bool
    {
        $name = trim((string) ($organ['name'] ?? ''));
        if ($name === '') {
            return false;
        }

        $needs = $this->organNeedsAutoFill($organ);
        if ($emptyOnly && ! $needs) {
            return false;
        }

        $draft = $this->autoFillOrganFromName($name, $catalog);
        $changed = false;
        // Never force-overwrite system membership — organs can belong to multiple systems.
        $forceKeys = ['gender', 'seo_title', 'seo_description'];
        $existingSystems = HealthExplorerCatalog::normalizeOrganSystemIds($organ);

        foreach ($draft as $key => $value) {
            if (in_array($key, ['system_id', 'system_ids'], true)) {
                if ($existingSystems !== []) {
                    continue;
                }
                // Fill blank membership from the name-based guess once.
                $this->applyOrganSystems($organ, HealthExplorerCatalog::normalizeOrganSystemIds($draft));
                $changed = true;

                continue;
            }

            $current = $organ[$key] ?? null;
            $blank = $current === null
                || $current === ''
                || (is_array($current) && count($current) === 0);

            if ($emptyOnly && ! $blank && ! in_array($key, $forceKeys, true)) {
                continue;
            }

            if ($current !== $value) {
                $organ[$key] = $value;
                $changed = true;
            }
        }

        return $changed;
    }

    /**
     * @param  array<string, mixed>  $organ
     */
    private function organNeedsAutoFill(array $organ): bool
    {
        $summary = trim((string) ($organ['summary'] ?? ''));
        $function = trim((string) ($organ['function'] ?? ''));
        $symptoms = $organ['symptoms'] ?? [];

        return $summary === '' || $function === '' || ! is_array($symptoms) || count($symptoms) === 0;
    }

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
            'hematologic' => ['blood', 'hemat', 'haemat', 'marrow', 'anemia', 'anaemia', 'platelet', 'hemoglobin', 'haemoglobin'],
            'lymphatic' => ['lymph', 'immune', 'spleen', 'tonsil'],
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
            'system_ids' => $systemId !== '' ? [$systemId] : [],
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
        $views = ['front', 'back', 'left', 'right', 'side'];

        foreach ($targets as $g) {
            $src = $incoming[$g] ?? null;
            if (! is_array($src)) {
                continue;
            }
            $out[$g] = is_array($out[$g] ?? null) ? $out[$g] : [];

            // Replace this body's view map from the editor payload (omitted views are removed).
            $next = [];
            foreach ($views as $view) {
                if (! array_key_exists($view, $src)) {
                    continue;
                }
                $spot = $src[$view];
                if ($spot === null || $spot === false || ! is_array($spot)) {
                    continue;
                }
                $next[$view] = [
                    'cx' => round(max(0, min(100, (float) ($spot['cx'] ?? 50))), 2),
                    'cy' => round(max(0, min(100, (float) ($spot['cy'] ?? 40))), 2),
                    'r' => round((float) ($spot['r'] ?? 1.15), 2),
                ];
            }

            // Migrate legacy `side` into independent left/right when needed.
            if (isset($next['side'])) {
                $side = $next['side'];
                if (! isset($next['left'])) {
                    $next['left'] = $side;
                }
                if (! isset($next['right'])) {
                    $next['right'] = [
                        'cx' => round(max(0, min(100, 100 - (float) $side['cx'])), 2),
                        'cy' => $side['cy'],
                        'r' => $side['r'],
                    ];
                }
            }

            $out[$g] = $next;
        }

        return $out;
    }

    /**
     * Per-system hotspot maps. Same shape as hotspots, keyed by system id.
     * false/null view entries are kept as false (tombstones hide the shared default).
     *
     * @param  array<string, mixed>  $incoming
     * @param  array<string, mixed>  $existing
     * @return array<string, mixed>
     */
    private function normalizeHotspotsBySystem(array $incoming, string $gender, array $existing = []): array
    {
        // Incoming is authoritative for which systems keep a per-system map.
        $out = [];
        foreach ($incoming as $systemId => $srcSystem) {
            $systemId = trim((string) $systemId);
            if ($systemId === '' || $systemId === 'all' || $systemId === 'mental' || ! is_array($srcSystem)) {
                continue;
            }
            $prevSystem = is_array($existing[$systemId] ?? null) ? $existing[$systemId] : [];
            $targets = $gender === 'both' ? ['female', 'male'] : [$gender];
            $nextSystem = $prevSystem;
            foreach ($targets as $g) {
                $src = $srcSystem[$g] ?? null;
                if (! is_array($src)) {
                    // Keep prior gender map when payload omits it.
                    continue;
                }
                $next = [];
                foreach (['front', 'back', 'left', 'right', 'side'] as $view) {
                    if (! array_key_exists($view, $src)) {
                        continue;
                    }
                    $spot = $src[$view];
                    if ($spot === null || $spot === false) {
                        $next[$view] = false;

                        continue;
                    }
                    if (! is_array($spot)) {
                        continue;
                    }
                    $next[$view] = [
                        'cx' => round(max(0, min(100, (float) ($spot['cx'] ?? 50))), 2),
                        'cy' => round(max(0, min(100, (float) ($spot['cy'] ?? 40))), 2),
                        'r' => round((float) ($spot['r'] ?? 1.15), 2),
                    ];
                }
                if (isset($next['side']) && is_array($next['side'])) {
                    $side = $next['side'];
                    if (! isset($next['left'])) {
                        $next['left'] = $side;
                    }
                    if (! isset($next['right'])) {
                        $next['right'] = [
                            'cx' => round(max(0, min(100, 100 - (float) $side['cx'])), 2),
                            'cy' => $side['cy'],
                            'r' => $side['r'],
                        ];
                    }
                }
                $nextSystem[$g] = $next;
            }
            $out[$systemId] = $nextSystem;
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $organ
     * @param  array{cx: float, cy: float, r?: float}  $spot
     */
    private function writeSystemHotspot(array &$organ, string $systemId, string $bodyGender, string $view, array $spot): void
    {
        $systemId = trim($systemId);
        if ($systemId === '') {
            return;
        }
        $by = is_array($organ['hotspots_by_system'] ?? null) ? $organ['hotspots_by_system'] : [];
        $by[$systemId] = is_array($by[$systemId] ?? null) ? $by[$systemId] : [];
        $by[$systemId][$bodyGender] = is_array($by[$systemId][$bodyGender] ?? null) ? $by[$systemId][$bodyGender] : [];
        $by[$systemId][$bodyGender][$view] = [
            'cx' => round(max(0, min(100, (float) ($spot['cx'] ?? 50))), 2),
            'cy' => round(max(0, min(100, (float) ($spot['cy'] ?? 40))), 2),
            'r' => round((float) ($spot['r'] ?? 1.15), 2),
        ];
        $organ['hotspots_by_system'] = $by;
    }

    private function catalog(): array
    {
        return $this->explorerCatalog->get();
    }

    private function saveCatalog(array $catalog): void
    {
        $this->explorerCatalog->save($catalog);
    }
}
