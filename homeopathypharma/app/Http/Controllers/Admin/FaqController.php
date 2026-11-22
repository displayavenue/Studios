<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class FaqController extends Controller
{
    public function index(): View
    {
        return view('admin.faqs.index', [
            'entries' => Faq::query()->ordered()->get(),
        ]);
    }

    public function create(): View
    {
        $nextOrder = (int) Faq::query()->max('sort_order') + 1;

        return view('admin.faqs.form', [
            'entry' => new Faq([
                'category' => Faq::CATEGORIES[0],
                'status' => 'published',
                'sort_order' => $nextOrder,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Faq::query()->create($this->validated($request));

        return redirect()
            ->route('admin.faqs.index')
            ->with('status', 'FAQ saved.')
            ->with('saved_blink', true);
    }

    public function edit(Faq $faq): View
    {
        return view('admin.faqs.form', [
            'entry' => $faq,
        ]);
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $faq->update($this->validated($request, $faq));

        return redirect()
            ->route('admin.faqs.edit', $faq)
            ->with('status', 'FAQ saved.')
            ->with('saved_blink', true);
    }

    public function bulkUpdate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'faqs' => ['required', 'array', 'min:1'],
            'faqs.*.id' => ['required', 'integer', 'distinct', 'exists:faqs,id'],
            'faqs.*.category' => ['required', 'string', Rule::in(Faq::CATEGORIES)],
            'faqs.*.question' => ['required', 'string', 'max:255'],
            'faqs.*.answer' => ['nullable', 'string', 'max:5000'],
            'faqs.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'faqs.*.status' => ['required', 'in:draft,published,archived'],
        ]);

        $count = 0;

        DB::transaction(function () use ($data, &$count) {
            foreach ($data['faqs'] as $row) {
                /** @var Faq $faq */
                $faq = Faq::query()->findOrFail($row['id']);
                $payload = $this->normalizedRow($row, $faq);
                $faq->update($payload);
                $count++;
            }
        });

        return redirect()
            ->route('admin.faqs.index')
            ->with('status', "Saved {$count} FAQ change(s).")
            ->with('saved_blink', true);
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return redirect()
            ->route('admin.faqs.index')
            ->with('status', 'FAQ deleted.')
            ->with('saved_blink', true);
    }

    private function validated(Request $request, ?Faq $entry = null): array
    {
        $data = $request->validate([
            'category' => ['required', 'string', Rule::in(Faq::CATEGORIES)],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['nullable', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        return $this->normalizedRow($data, $entry);
    }

    /**
     * @param  array{category: string, question: string, answer?: ?string, sort_order?: ?int, status: string}  $data
     */
    private function normalizedRow(array $data, ?Faq $entry = null): array
    {
        $data['answer'] = filled(trim((string) ($data['answer'] ?? '')))
            ? trim((string) $data['answer'])
            : null;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        if ($data['status'] === 'published' && empty($entry?->published_at)) {
            $data['published_at'] = now();
        }

        unset($data['id']);

        return $data;
    }
}
