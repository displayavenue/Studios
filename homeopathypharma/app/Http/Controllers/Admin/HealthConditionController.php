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
    private const LETTER_SESSION_KEY = 'admin_conditions_letter';

    public function index(Request $request): View
    {
        $q = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');
        $letter = $this->resolveLetter($request);

        $conditions = HealthCondition::query()
            ->with('media')
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('title', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%");
            }))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($letter !== '', fn ($query) => $query->where('title', 'like', $letter.'%'))
            ->orderBy('title')
            ->paginate(30)
            ->withQueryString();

        $letterCounts = HealthCondition::query()
            ->selectRaw('UPPER(SUBSTR(title, 1, 1)) as letter')
            ->selectRaw('COUNT(*) as total')
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('title', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%")
                    ->orWhere('category', 'like', "%{$q}%");
            }))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->groupBy('letter')
            ->orderBy('letter')
            ->pluck('total', 'letter');

        $alphabet = range('A', 'Z');

        return view('admin.conditions.index', compact(
            'conditions',
            'q',
            'status',
            'letter',
            'letterCounts',
            'alphabet'
        ));
    }

    public function create(Request $request): View
    {
        $this->rememberLetterFromRequest($request);

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

        return $this->redirectToIndex('Disease / condition created.');
    }

    public function edit(Request $request, HealthCondition $condition): View
    {
        $this->rememberLetterFromRequest($request);
        $condition->load('media');

        return view('admin.conditions.form', $this->formData($condition));
    }

    public function update(Request $request, HealthCondition $condition): RedirectResponse
    {
        $condition->update($this->validated($request, $condition));

        return $this->redirectToIndex('Disease / condition updated.');
    }

    public function destroy(HealthCondition $condition): RedirectResponse
    {
        $condition->delete();

        return $this->redirectToIndex('Disease / condition deleted.');
    }

    /**
     * @return array{condition: HealthCondition, media: \Illuminate\Support\Collection<int, MediaAsset>, categories: list<string>, letter: string}
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
            'letter' => (string) session(self::LETTER_SESSION_KEY, ''),
        ];
    }

    private function resolveLetter(Request $request): string
    {
        if ($request->has('letter')) {
            $letter = strtoupper(trim((string) $request->query('letter', '')));
            if ($letter !== '' && ! preg_match('/^[A-Z]$/', $letter)) {
                $letter = '';
            }
            $request->session()->put(self::LETTER_SESSION_KEY, $letter);

            return $letter;
        }

        return (string) $request->session()->get(self::LETTER_SESSION_KEY, '');
    }

    private function rememberLetterFromRequest(Request $request): void
    {
        if (! $request->has('letter')) {
            return;
        }

        $letter = strtoupper(trim((string) $request->query('letter', '')));
        if ($letter !== '' && ! preg_match('/^[A-Z]$/', $letter)) {
            $letter = '';
        }
        $request->session()->put(self::LETTER_SESSION_KEY, $letter);
    }

    private function redirectToIndex(string $status): RedirectResponse
    {
        $letter = (string) session(self::LETTER_SESSION_KEY, '');

        return redirect()
            ->route('admin.conditions.index', array_filter([
                'letter' => $letter !== '' ? $letter : null,
            ], fn ($value) => $value !== null))
            ->with('status', $status);
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

        $data['slug'] = Str::slug(($data['slug'] ?? '') ?: $data['title']);
        $data['seo_title'] = ($data['seo_title'] ?? null) ?: ($data['title'].' — HOMEOPATHY PHARMA');
        $data['seo_description'] = ($data['seo_description'] ?? null) ?: Str::limit(strip_tags($data['snippet']), 155);
        $data['image_url'] = ($data['image_url'] ?? null) ?: asset('images/brand/logo-hp.png');
        $data['image_alt'] = ($data['image_alt'] ?? null) ?: $data['title'];
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
