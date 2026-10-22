<header class="hp-header">
    <div class="hp-container hp-header__row">
        <a class="hp-logo" href="{{ route('home') }}">
            <span class="hp-logo__mark" aria-hidden="true">HP</span>
            <span>{{ $settings->brandName() }}</span>
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
            <a href="{{ route('home') }}">Home</a>
            <a href="{{ route('shop.index') }}">Shop</a>
            <a href="{{ route('shop.index') }}">Categories</a>
            <a href="{{ route('doctors.index') }}">Consult a Doctor</a>
            <a href="{{ route('health-library.index') }}">Health Library</a>
            <a href="{{ route('about') }}">About</a>
            <a href="{{ route('contact.show') }}">Contact</a>
        </nav>

        <div class="hp-header__meta">
            <a class="hp-header__phone" href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>
            <a href="{{ route('account') }}">Account</a>
            <a href="{{ route('cart') }}">Cart</a>
        </div>
    </div>
</header>
