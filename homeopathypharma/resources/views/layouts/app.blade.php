<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', $settings->brandName())</title>
    <meta name="description" content="@yield('meta_description', $settings->tagline())">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/storefront.css') }}">
    @stack('head')
</head>
<body>
    <a class="hp-skip" href="#main">Skip to content</a>
    @include('components.announcement-bar')
    @include('components.header')
    <main id="main">
        @yield('content')
    </main>
    @include('components.footer')
    <script>
        (function () {
            var btn = document.querySelector('[data-menu-toggle]');
            var nav = document.querySelector('[data-nav]');
            if (!btn || !nav) return;
            btn.addEventListener('click', function () {
                var open = nav.classList.toggle('is-open');
                btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            window.addEventListener('resize', function () {
                if (window.innerWidth > 980 && nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        })();
    </script>
    @stack('scripts')
</body>
</html>
