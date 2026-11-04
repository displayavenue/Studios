@extends('layouts.app')

@php
    $settings = $settings ?? app(\App\Services\SiteSettings::class);
    $hxManifestPath = public_path('build/manifest.json');
    $hxManifest = is_file($hxManifestPath)
        ? json_decode((string) file_get_contents($hxManifestPath), true)
        : [];
    $hxEntry = $hxManifest['resources/js/health-explorer/main.jsx'] ?? null;
@endphp

@section('title', 'Human Health Explorer — '.$settings->brandName())
@section('meta_description', 'Interactive male and female anatomy explorer with organ guides, mental health topics, and carefully labelled homeopathy product information. Educational only — not a diagnosis or prescription.')

@section('content')
    <div
        id="health-explorer-root"
        data-catalog-url="{{ $catalogUrl }}"
        data-shop-url="{{ route('shop.index') }}"
        data-consult-url="{{ route('consult') }}"
    >
        <noscript>
            <div class="hp-container" style="padding:2rem 0;">
                <h1>Human Health Explorer</h1>
                <p>Please enable JavaScript to use the interactive anatomy explorer.</p>
            </div>
        </noscript>
        <div class="hx-boot" style="padding:2.5rem 1rem;text-align:center;color:#5b6b65;">
            Loading Human Health Explorer…
        </div>
    </div>
@endsection

@push('head')
    @if (!empty($hxEntry['css']))
        @foreach ($hxEntry['css'] as $css)
            <link rel="stylesheet" href="{{ asset('build/'.$css) }}">
        @endforeach
    @else
        <link rel="stylesheet" href="{{ asset('css/health-explorer.css') }}?v=hx1">
    @endif
@endpush

@push('scripts')
    @if (!empty($hxEntry['file']))
        <script type="module" src="{{ asset('build/'.$hxEntry['file']) }}"></script>
    @endif
@endpush
