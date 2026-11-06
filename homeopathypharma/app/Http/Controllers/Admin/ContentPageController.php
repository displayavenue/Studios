<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ContentPageController extends Controller
{
    public function index(): View
    {
        return view('admin.pages.index', [
            'pages' => ContentPage::query()->orderBy('title')->get(),
        ]);
    }

    public function edit(ContentPage $page): View
    {
        return view('admin.pages.form', compact('page'));
    }

    public function update(Request $request, ContentPage $page, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'body' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'in:draft,published'],
        ]);

        if ($data['status'] === 'published' && empty($page->published_at)) {
            $data['published_at'] = now();
        }

        $page->update($data);
        $audit->log('content_page.updated', $page);

        return redirect()->route('admin.pages.index')->with('status', 'Page updated.');
    }
}
