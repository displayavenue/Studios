@extends('layouts.app')
@section('title', 'Gallery — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Gallery</h1>
<p class="hp-section__lead">
@if ($instagramConfigured)
Instagram posts synced from your connected account.
@elseif ($instagramUrl)
Follow us on <a href="{{ $instagramUrl }}" rel="noopener" target="_blank">Instagram</a>. Connect an Instagram API token in server env to auto-import posts, or add items in Admin → Gallery.
@else
Add your Instagram URL in Admin → Site Settings, connect <code>INSTAGRAM_ACCESS_TOKEN</code> to sync posts, or curate images in Admin → Gallery.
@endif
</p>
@if($items->isEmpty())
<div class="hp-empty">No gallery items yet.</div>
@else
<div class="hp-gallery-grid">
@foreach($items as $item)
<figure class="hp-gallery-item">
@if($item->displayUrl())
<a href="{{ $item->permalink ?: $item->displayUrl() }}" @if($item->permalink) target="_blank" rel="noopener" @endif>
<img src="{{ $item->displayUrl() }}" alt="{{ $item->caption ?: 'Gallery image' }}">
</a>
@endif
@if($item->caption)<figcaption>{{ \Illuminate\Support\Str::limit($item->caption, 120) }}</figcaption>@endif
</figure>
@endforeach
</div>
<div style="margin-top:1.5rem;">{{ $items->links() }}</div>
@endif
</div>
</section>
@endsection
