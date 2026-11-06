<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HealthCondition;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class HealthConditionController extends Controller
{
    public function index(Request $request): View
    {
        $q = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');

        $conditions = HealthCondition::query()
            ->with('media')
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('title', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%");
            }))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderBy('title')
            ->paginate(30)
            ->withQueryString();

        return view('admin.conditions.index', compact('conditions', 'q', 'status'));
    }

    public function create(): View
    {
        return view('admin.conditions.form', $this->formData(new HealthCondition([
            'status' => 'draft',
            'is_indexed' => true,
            'category' => 'General symptoms',
            'review_count' => 0,
            'rating_average' => 0,
            'sort_order' => 0,
        ])));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        HealthCondition::query()->create($data);

        return redirect()->route('admin.conditions.index')->with('status', 'Disease / condition created.');
    }

    public function edit(HealthCondition $condition): View
    {
        $condition->load('media');

        return view('admin.conditions.form', $this->formData($condition));
    }

    public function update(Request $request, HealthCondition $condition): RedirectResponse
    {
        $condition->update($this->validated($request, $condition));

        return redirect()->route('admin.conditions.index')->with('status', 'Disease / condition updated.');
    }

    public function destroy(HealthCondition $condition): RedirectResponse
    {
        $condition->delete();

        return redirect()->route('admin.conditions.index')->with('status', 'Disease / condition deleted.');
    }

    /**
     * @return array{condition: HealthCondition, media: \Illuminate\Support\Collection<int, MediaAsset>, categories: list<string>}
     */
    private function formData(HealthCondition $condition): array
    {
        return [
            'condition' => $condition,
            'media' => MediaAsset::query()->latest()->limit(200)->get(),
            'categories' => HealthCondition::query()
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category')
                ->filter()
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?HealthCondition $condition = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('health_conditions', 'slug')->ignore($condition?->id)],
            'category' => ['required', 'string', 'max:80'],
            'media_asset_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:190'],
            'snippet' => ['required', 'string', 'max:320'],
            'short_description' => ['required', 'string', 'max:2000'],
            'long_description' => ['required', 'string'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'status' => ['required', 'in:draft,published,archived'],
            'is_indexed' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ]);

        $data['slug'] = Str::slug($data['slug'] ?: $data['title']);
        $data['seo_title'] = $data['seo_title'] ?: ($data['title'].' — HOMEOPATHY PHARMA');
        $data['seo_description'] = $data['seo_description'] ?: Str::limit(strip_tags($data['snippet']), 155);
        $data['image_url'] = $data['image_url'] ?: asset('images/brand/logo-hp.png');
        $data['image_alt'] = $data['image_alt'] ?: $data['title'];
        $data['is_indexed'] = $request->boolean('is_indexed');
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['faqs'] = $condition?->faqs ?? [];
        $data['reviews'] = $condition?->reviews ?? [];
        $data['seo_keywords'] = $condition?->seo_keywords ?? [$data['title'], 'homeopathy', 'HOMEOPATHY PHARMA'];

        if (($data['status'] ?? '') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = $condition?->published_at ?? now();
        }

        return $data;
    }
}
