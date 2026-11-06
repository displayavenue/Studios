<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use App\Models\MediaAsset;
use App\Services\MediaUploader;
use App\Support\HomepageSectionCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomepageSectionController extends Controller
{
    public function index(): View
    {
        // Keep catalog keys present so new frontend sections appear in admin immediately after deploy.
        foreach (HomepageSectionCatalog::definitions() as $key => $definition) {
            HomepageSection::query()->firstOrCreate(
                ['key' => $key],
                [
                    'title' => $definition['title'],
                    'subtitle' => $definition['subtitle'],
                    'payload' => $definition['payload'],
                    'sort_order' => $definition['sort_order'],
                    'is_enabled' => true,
                    'status' => 'published',
                    'published_at' => now(),
                ]
            );
        }

        return view('admin.homepage.index', [
            'sections' => HomepageSection::query()->orderBy('sort_order')->get(),
            'catalog' => HomepageSectionCatalog::definitions(),
        ]);
    }

    public function edit(HomepageSection $homepage): View
    {
        $fields = HomepageSectionCatalog::fieldsFor($homepage->key);
        $payload = HomepageSectionCatalog::normalizePayload($homepage->key, $homepage->payload ?? []);

        return view('admin.homepage.form', [
            'section' => $homepage,
            'fields' => $fields,
            'payload' => $payload,
            'label' => HomepageSectionCatalog::label($homepage->key),
            'media' => MediaAsset::query()->latest('id')->limit(100)->get(),
        ]);
    }

    public function update(Request $request, HomepageSection $homepage, MediaUploader $uploader): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:190'],
            'subtitle' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_enabled' => ['sometimes', 'boolean'],
            'status' => ['required', 'in:draft,published'],
            'payload' => ['nullable', 'array'],
            'payload.*' => ['nullable'],
            'image_upload' => ['nullable', 'file', 'max:5120'],
            'payload_json' => ['nullable', 'string'],
        ]);

        $payload = HomepageSectionCatalog::normalizePayload($homepage->key, $homepage->payload ?? []);

        foreach (($data['payload'] ?? []) as $key => $value) {
            if ($key === 'media_asset_id') {
                $payload[$key] = $value !== null && $value !== '' ? (int) $value : null;
                continue;
            }
            $payload[$key] = is_string($value) ? $value : (is_null($value) ? null : (string) $value);
        }

        if ($request->hasFile('image_upload')) {
            $asset = $uploader->upload(
                $request->file('image_upload'),
                $request->user()?->id,
                $payload['image_alt'] ?? ($homepage->title.' image')
            );
            $payload['media_asset_id'] = $asset->id;
        }

        // Re-derive structured lists from textareas.
        $payload = HomepageSectionCatalog::normalizePayload($homepage->key, $payload);

        // Advanced escape hatch: full JSON replace when provided and valid.
        if (! empty($data['payload_json'])) {
            $decoded = json_decode($data['payload_json'], true);
            if (! is_array($decoded)) {
                return back()->withErrors(['payload_json' => 'Payload must be valid JSON.'])->withInput();
            }
            $payload = HomepageSectionCatalog::normalizePayload($homepage->key, $decoded);
        }

        $homepage->update([
            'title' => $data['title'],
            'subtitle' => $data['subtitle'],
            'sort_order' => $data['sort_order'] ?? $homepage->sort_order,
            'is_enabled' => $request->boolean('is_enabled'),
            'status' => $data['status'],
            'payload' => $payload,
            'published_at' => $data['status'] === 'published' ? ($homepage->published_at ?? now()) : $homepage->published_at,
        ]);

        return redirect()->route('admin.homepage.index')->with('status', 'Homepage section updated. Frontend will use these values immediately.');
    }
}
