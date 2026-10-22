<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Services\MediaUploader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MediaController extends Controller
{
    public function index(Request $request): View
    {
        $q = trim((string) $request->query('q', ''));

        $media = MediaAsset::query()
            ->when($q !== '', fn ($query) => $query->where(function ($inner) use ($q) {
                $inner->where('filename', 'like', "%{$q}%")
                    ->orWhere('original_name', 'like', "%{$q}%")
                    ->orWhere('alt_text', 'like', "%{$q}%");
            }))
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return view('admin.media.index', compact('media', 'q'));
    }

    public function store(Request $request, MediaUploader $uploader): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:5120'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $uploader->upload($data['file'], $request->user()?->id, $data['alt_text'] ?? null);

        return back()->with('status', 'Image uploaded.');
    }

    public function update(Request $request, MediaAsset $medium): RedirectResponse
    {
        $data = $request->validate([
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
        ]);

        $medium->update($data);

        return back()->with('status', 'Media updated.');
    }

    public function destroy(MediaAsset $medium, MediaUploader $uploader): RedirectResponse
    {
        if (! $uploader->deleteIfUnused($medium)) {
            return back()->withErrors(['media' => 'This image is still referenced. Remove references before deleting.']);
        }

        return back()->with('status', 'Media deleted.');
    }
}
