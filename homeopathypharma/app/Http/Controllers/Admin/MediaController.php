<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Models\SiteSetting;
use App\Services\MediaUploader;
use Illuminate\Http\JsonResponse;
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

    public function store(Request $request, MediaUploader $uploader): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:5120'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $asset = $uploader->upload($data['file'], $request->user()?->id, $data['alt_text'] ?? null);

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'ok' => true,
                'media' => $this->mediaPayload($asset),
                'message' => 'Image uploaded.',
            ]);
        }

        return back()->with('status', 'Image uploaded.');
    }

    public function show(MediaAsset $medium): JsonResponse
    {
        return response()->json([
            'ok' => true,
            'media' => $this->mediaPayload($medium),
        ]);
    }

    public function adjust(Request $request, MediaAsset $medium, MediaUploader $uploader): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:5120'],
        ]);

        $asset = $uploader->replace($medium, $data['file']);

        // Bust storefront CSS/asset caches so visitors see the new crop promptly.
        SiteSetting::query()->updateOrCreate(
            ['key' => 'frontend_cache_token'],
            ['value' => (string) time()]
        );

        return response()->json([
            'ok' => true,
            'media' => $this->mediaPayload($asset),
            'message' => 'Image adjusted. Frontend will show the new crop.',
        ]);
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

    /**
     * @return array{id:int,url:string,original_name:?string,alt_text:?string,width:?int,height:?int,mime_type:?string}
     */
    private function mediaPayload(MediaAsset $asset): array
    {
        return [
            'id' => (int) $asset->id,
            'url' => $asset->publicUrl(),
            'original_name' => $asset->original_name,
            'alt_text' => $asset->alt_text,
            'width' => $asset->width,
            'height' => $asset->height,
            'mime_type' => $asset->mime_type,
        ];
    }
}
