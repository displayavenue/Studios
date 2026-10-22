<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PolicyPage;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PolicyPageController extends Controller
{
    public function index(): View
    {
        return view('admin.policies.index', [
            'pages' => PolicyPage::query()->orderBy('title')->get(),
        ]);
    }

    public function edit(PolicyPage $policy): View
    {
        return view('admin.policies.form', ['page' => $policy]);
    }

    public function update(Request $request, PolicyPage $policy, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'body' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'in:draft,published'],
        ]);

        if ($data['status'] === 'published' && empty($policy->published_at)) {
            $data['published_at'] = now();
        }

        $policy->update($data);
        $audit->log('policy.updated', $policy);

        return redirect()->route('admin.policies.index')->with('status', 'Policy page updated.');
    }
}
