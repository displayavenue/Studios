<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomepageSectionController extends Controller
{
    public function index(): View
    {
        return view('admin.homepage.index', [
            'sections' => HomepageSection::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function edit(HomepageSection $homepage): View
    {
        return view('admin.homepage.form', [
            'section' => $homepage,
        ]);
    }

    public function update(Request $request, HomepageSection $homepage): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:190'],
            'subtitle' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_enabled' => ['sometimes', 'boolean'],
            'status' => ['required', 'in:draft,published'],
            'payload_json' => ['nullable', 'string'],
        ]);

        $payload = $homepage->payload ?? [];
        if (! empty($data['payload_json'])) {
            $decoded = json_decode($data['payload_json'], true);
            if (! is_array($decoded)) {
                return back()->withErrors(['payload_json' => 'Payload must be valid JSON.'])->withInput();
            }
            $payload = $decoded;
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

        return redirect()->route('admin.homepage.index')->with('status', 'Homepage section updated.');
    }
}
