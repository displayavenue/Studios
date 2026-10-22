<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\MediaAsset;
use App\Services\Instagram\InstagramFeedService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class GalleryItemController extends Controller
{
    public function index(InstagramFeedService $instagram): View
    {
        return view('admin.gallery.index', [
            'items' => GalleryItem::query()->latest()->paginate(30),
            'instagramConfigured' => $instagram->isConfigured(),
        ]);
    }

    public function create(): View
    {
        return view('admin.gallery.form', [
            'item' => new GalleryItem(['status' => 'published', 'source' => 'manual', 'media_type' => 'image']),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        GalleryItem::query()->create($this->validated($request));

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item saved.');
    }

    public function edit(GalleryItem $gallery): View
    {
        return view('admin.gallery.form', [
            'item' => $gallery,
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, GalleryItem $gallery): RedirectResponse
    {
        $gallery->update($this->validated($request));

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item updated.');
    }

    public function destroy(GalleryItem $gallery): RedirectResponse
    {
        $gallery->delete();

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item deleted.');
    }

    public function syncInstagram(InstagramFeedService $instagram): RedirectResponse
    {
        $result = $instagram->sync();

        return back()->with('status', $result['message']);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'caption' => ['nullable', 'string', 'max:500'],
            'permalink' => ['nullable', 'url', 'max:500'],
            'remote_media_url' => ['nullable', 'url', 'max:500'],
            'media_asset_id' => ['nullable', 'exists:media_assets,id'],
            'media_type' => ['required', 'in:image,video,carousel'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $data['source'] = 'manual';
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }
}
