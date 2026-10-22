<header class="hp-header">
    <div class="hp-header__utility">
        <div class="hp-container hp-header__utility-inner">
            <div class="hp-header__utility-left">
                <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>
                <span class="hp-header__utility-sep hp-header__hide-sm" aria-hidden="true">·</span>
                <span class="hp-header__hide-sm">{{ $settings->address() }}</span>
            </div>
            <div class="hp-header__utility-right">
                @if ($settings->instagramUrl())
                    <a href="{{ $settings->instagramUrl() }}" target="_blank" rel="noopener">Instagram</a>
                @endif
                @if ($settings->facebookUrl())
                    <a href="{{ $settings->facebookUrl() }}" target="_blank" rel="noopener">Facebook</a>
                @endif
                <a class="hp-header__hide-xs" href="{{ auth()->check() ? route('account.dashboard') : route('account.login') }}">
                    {{ auth()->check() ? 'Account' : 'Sign in' }}
                </a>
            </div>
        </div>
    </div>

    <div class="hp-container hp-header__main">
        <a class="hp-logo" href="{{ route('home') }}">
            <span class="hp-logo__mark" aria-hidden="true">HP</span>
            <span class="hp-logo__text">
                <span class="hp-logo__name">{{ $settings->brandName() }}</span>
                <span class="hp-logo__tag">{{ $settings->tagline() }}</span>
            </span>
        </a>

        <button
            type="button"
            class="hp-menu-toggle"
            data-menu-toggle
            aria-expanded="false"
            aria-controls="site-nav"
        >
            Menu
        </button>

        <nav id="site-nav" class="hp-nav" data-nav aria-label="Primary">
            <a href="{{ route('shop.index') }}">Shop</a>
            <a href="{{ route('doctors.index') }}">Doctors</a>
            <a href="{{ route('blog.index') }}">Blog</a>
            <a href="{{ route('health-library.index') }}">Health Library</a>
            <a href="{{ route('gallery') }}">Gallery</a>
            <a href="{{ route('about') }}">About</a>
            <a href="{{ route('contact.show') }}">Contact</a>
        </nav>

        <div class="hp-header__actions">
            <a class="hp-header__cart" href="{{ route('cart') }}">Cart</a>
        </div>
    </div>
</header>
