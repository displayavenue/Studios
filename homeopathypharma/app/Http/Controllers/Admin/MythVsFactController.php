<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MythVsFact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MythVsFactController extends Controller
{
    public function index(): View
    {
        return view('admin.myths-vs-fact.index', [
            'entries' => MythVsFact::query()->ordered()->paginate(30),
        ]);
    }

    public function create(): View
    {
        $nextOrder = (int) MythVsFact::query()->max('sort_order') + 1;

        return view('admin.myths-vs-fact.form', [
            'entry' => new MythVsFact([
                'status' => 'published',
                'sort_order' => $nextOrder,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        MythVsFact::query()->create($this->validated($request));

        return redirect()->route('admin.myth-vs-facts.index')->with('status', 'Myth vs Fact entry saved.');
    }

    public function edit(MythVsFact $mythVsFact): View
    {
        return view('admin.myths-vs-fact.form', [
            'entry' => $mythVsFact,
        ]);
    }

    public function update(Request $request, MythVsFact $mythVsFact): RedirectResponse
    {
        $mythVsFact->update($this->validated($request, $mythVsFact));

        return redirect()->route('admin.myth-vs-facts.index')->with('status', 'Myth vs Fact entry updated.');
    }

    public function destroy(MythVsFact $mythVsFact): RedirectResponse
    {
        $mythVsFact->delete();

        return redirect()->route('admin.myth-vs-facts.index')->with('status', 'Myth vs Fact entry deleted.');
    }

    private function validated(Request $request, ?MythVsFact $entry = null): array
    {
        $data = $request->validate([
            'myth_title' => ['required', 'string', 'max:255'],
            'fact_title' => ['required', 'string', 'max:255'],
            'fact_body' => ['required', 'string', 'max:4000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $data['sort_order'] = $data['sort_order'] ?? 0;
        if ($data['status'] === 'published' && empty($entry?->published_at)) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
