<header class="hp-site-header">
    <div class="hp-header-main">
        <div class="hp-container hp-header-main__row">
            <a class="hp-brand" href="{{ route('home') }}">
                <img
                    class="hp-brand__logo"
                    src="{{ asset('images/brand/logo-hp.png') }}?v=20261104-hp-lockup"
                    alt="{{ $settings->brandName() }}"
                    width="480"
                    height="230"
                    decoding="async"
                >
            </a>

            <form class="hp-search" method="get" action="{{ route('shop.index') }}" role="search">
                <label class="hp-sr-only" for="site-search">Search</label>
                <input id="site-search" class="hp-search__input" type="search" name="q" placeholder="Search medicines, brands, concerns…">
                <button class="hp-search__btn" type="submit">Search</button>
            </form>

            <div class="hp-header-actions">
                <a class="hp-header-phone" href="tel:{{ $settings->phoneTel() }}">
                    <span class="hp-header-phone__label">Call us</span>
                    <span class="hp-header-phone__num">{{ $settings->phoneDisplay() }}</span>
                </a>
                <a class="hp-icon-link" href="{{ auth()->check() ? route('account.dashboard') : route('account.login') }}">Account</a>
                <a class="hp-icon-link hp-icon-link--cart" href="{{ route('cart') }}">
                    Cart
                    @if (($cartCount ?? 0) > 0)
                        <span class="hp-cart-badge">{{ $cartCount > 99 ? '99+' : $cartCount }}</span>
                    @endif
                </a>
                <button
                    type="button"
                    class="hp-menu-toggle"
                    data-menu-toggle
                    aria-expanded="false"
                    aria-controls="site-nav"
                >Menu</button>
            </div>
        </div>
    </div>

    <div class="hp-nav-bar">
        <div class="hp-container hp-nav-bar__row">
            <div class="hp-nav-bar__left">
                <details class="hp-cat-menu">
                    <summary class="hp-cat-menu__btn">Shop by Category</summary>
                    <div class="hp-cat-menu__panel">
                        @forelse (($navCategories ?? collect()) as $category)
                            <a href="{{ route('shop.category', $category->slug) }}">{{ $category->name }}</a>
                        @empty
                            <a href="{{ route('shop.index') }}">All products</a>
                        @endforelse
                    </div>
                </details>

                <nav id="site-nav" class="hp-primary-nav" data-nav aria-label="Primary">
                    <a href="{{ route('home') }}#trusted-brands">Brands</a>
                    <a href="{{ route('doctors.index') }}">Consult a Doctor</a>
                    <a href="{{ route('conditions.index') }}">Conditions</a>
                    <a href="{{ route('health-explorer') }}">Health Explorer</a>
                    <a href="{{ route('health-library.index') }}">Health Library</a>
                    <a href="{{ route('about') }}">About Us</a>
                    <a href="{{ route('contact.show') }}">Contact Us</a>
                    <a class="hp-nav-mobile-only" href="{{ route('account.dashboard') }}">Track Order</a>
                    <a class="hp-nav-mobile-only" href="{{ route('contact.show') }}">Need Help?</a>
                    <a class="hp-nav-mobile-only" href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>
                </nav>
            </div>
            <div class="hp-nav-bar__right">
                <a href="{{ route('account.dashboard') }}">Track Order</a>
                <a href="{{ route('contact.show') }}">Need Help?</a>
            </div>
        </div>
    </div>
</header>
