@extends('layouts.admin')
@section('title', 'Clear cache & cookies')
@section('content')
<div class="admin-top">
    <div>
        <h2>Clear cache &amp; cookies</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;max-width:46rem;">
            Use this after content, image, or design changes so the live site shows the latest version.
            This clears Laravel caches, bumps CSS/JS cache tokens, and can reset visitor session cookies.
        </p>
    </div>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <p style="margin:0 0 0.35rem;"><strong>Current asset cache token:</strong> <code>{{ $token }}</code></p>
    <p style="margin:0;" class="admin-muted">
        Last cleared:
        @if ($lastClearedAt)
            {{ $lastClearedAt }} (Asia/Kolkata)
        @else
            Never from this screen
        @endif
    </p>
</div>

@if (session('cache_steps'))
    <div class="admin-card" style="margin-bottom:1rem;border-left:4px solid #0b4a34;">
        <strong>What was cleared</strong>
        <ul style="margin:0.5rem 0 0;padding-left:1.2rem;">
            @foreach (session('cache_steps') as $step)
                <li>{{ $step }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="admin-card">
    <h3 style="margin-top:0;">Clear everything</h3>
    <ul style="margin:0 0 1rem;padding-left:1.2rem;line-height:1.5;">
        <li>Application / config / route / view caches</li>
        <li>Site settings cache</li>
        <li>Frontend CSS/JS cache-bust token (forces browsers &amp; CDN to refetch)</li>
        <li>Optional: visitor session cookies (logs other people out; keeps you signed in)</li>
    </ul>

    <form method="post" action="{{ route('admin.cache.purge') }}" class="admin-form" onsubmit="return confirm('Clear all caches and refresh frontend assets now?');">
        @csrf
        <label style="display:flex;gap:0.55rem;align-items:flex-start;font-weight:500;">
            <input type="checkbox" name="invalidate_sessions" value="1" checked style="margin-top:0.2rem;">
            <span>Also clear visitor session cookies (recommended after major updates)</span>
        </label>
        <div class="admin-actions" style="margin-top:1rem;">
            <button class="btn btn-primary" type="submit">Clear all cache &amp; cookies</button>
            <a class="btn btn-secondary" href="{{ route('home') }}" target="_blank" rel="noopener">Open live site</a>
        </div>
    </form>
</div>

<div class="admin-card" style="margin-top:1rem;">
    <h3 style="margin-top:0;">When to use</h3>
    <ol style="margin:0;padding-left:1.2rem;line-height:1.55;">
        <li>Save your change (homepage section, media, product, page, settings, etc.).</li>
        <li>Open this screen and click <strong>Clear all cache &amp; cookies</strong>.</li>
        <li>Hard-refresh the live site once if your browser still shows an old page.</li>
    </ol>
</div>
@endsection
