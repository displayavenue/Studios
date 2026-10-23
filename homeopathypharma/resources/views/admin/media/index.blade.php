@extends('layouts.admin')
@section('title', 'Media Library')
@section('content')
<div class="admin-top">
    <h2>Media Library</h2>
</div>
<div class="admin-card" style="margin-bottom:1rem;">
    <form method="post" action="{{ route('admin.media.store') }}" enctype="multipart/form-data" class="admin-form">
        @csrf
        <label>Upload image (JPEG/PNG/WebP/GIF, max 5 MB)
            <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required>
        </label>
        <label>Alt text
            <input type="text" name="alt_text" maxlength="255">
        </label>
        <button class="btn btn-primary" type="submit">Upload</button>
    </form>
</div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;">
    <input type="search" name="q" value="{{ $q }}" placeholder="Search filename or alt text" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
    <button class="btn btn-secondary" type="submit">Search</button>
</form>
<div class="media-grid">
    @forelse ($media as $item)
        <div class="admin-card media-card">
            <img src="{{ $item->publicUrl() }}" alt="{{ $item->alt_text ?: $item->original_name }}">
            <p style="font-size:0.75rem;margin:0.4rem 0;word-break:break-all;">#{{ $item->id }} · {{ $item->original_name }}</p>
            <form method="post" action="{{ route('admin.media.update', $item) }}" class="admin-form" style="gap:0.4rem;">
                @csrf
                @method('PUT')
                <input type="text" name="alt_text" value="{{ $item->alt_text }}" placeholder="Alt text">
                <button class="btn btn-secondary" type="submit">Save</button>
            </form>
            <form method="post" action="{{ route('admin.media.destroy', $item) }}" onsubmit="return confirm('Delete this image if unused?');" style="margin-top:0.4rem;">
                @csrf
                @method('DELETE')
                <button class="btn btn-danger" type="submit">Delete</button>
            </form>
        </div>
    @empty
        <div class="admin-card">No media uploaded yet.</div>
    @endforelse
</div>
<div style="margin-top:1rem;">{{ $media->links() }}</div>
@endsection
