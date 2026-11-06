<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#075e54">
    <title>@yield('title', 'Chat — '.$settings->brandName())</title>
    <meta name="description" content="@yield('meta_description', $settings->tagline())">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    @php
        $hpCacheToken = $settings->frontendCacheToken();
        $hpCssApp = public_path('css/app.css');
        $hpCssStore = public_path('css/storefront.css');
        $hpCssAppV = (is_file($hpCssApp) ? filemtime($hpCssApp) : time()).'-'.$hpCacheToken;
        $hpCssStoreV = (is_file($hpCssStore) ? filemtime($hpCssStore) : time()).'-'.$hpCacheToken;
    @endphp
    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v={{ $hpCssAppV }}">
    <link rel="stylesheet" href="{{ asset('css/storefront.css') }}?v={{ $hpCssStoreV }}">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    @stack('head')
</head>
<body class="hp-chat-body">
    @yield('content')
    @stack('scripts')
</body>
</html>
