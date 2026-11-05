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
                <div class="hp-contact-pill" role="group" aria-label="Call or WhatsApp us">
                    <div class="hp-contact-pill__icons">
                        <a
                            class="hp-contact-pill__icon"
                            href="tel:{{ $settings->phoneTel() }}"
                            aria-label="Call {{ $settings->phoneDisplay() }}"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                        </a>
                        <span class="hp-contact-pill__sep" aria-hidden="true"></span>
                        <a
                            class="hp-contact-pill__icon"
                            href="{{ $settings->whatsappUrl() }}"
                            target="_blank"
                            rel="noopener"
                            aria-label="WhatsApp {{ $settings->phoneDisplay() }}"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
                                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.44zM12.06 21.15h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.88-9.89 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
                            </svg>
                        </a>
                    </div>
                    <a class="hp-contact-pill__text" href="tel:{{ $settings->phoneTel() }}">
                        <span class="hp-contact-pill__label">Call / WhatsApp Us</span>
                        <span class="hp-contact-pill__num">{{ $settings->phoneDisplay() }}</span>
                    </a>
                </div>

                <span class="hp-header-actions__rule" aria-hidden="true"></span>

                <a class="hp-icon-link" href="{{ auth()->check() ? route('account.dashboard') : route('account.login') }}">
                    <svg class="hp-icon-link__svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21a8 8 0 0 0-16 0"/>
                        <circle cx="12" cy="8" r="4"/>
                    </svg>
                    <span>Account</span>
                </a>
                <a class="hp-icon-link hp-icon-link--cart" href="{{ route('cart') }}">
                    <span class="hp-icon-link__cart-wrap">
                        <svg class="hp-icon-link__svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 7h15l-1.5 9h-12z"/>
                            <path d="M6 7 5 3H2"/>
                            <circle cx="9" cy="20" r="1.2"/>
                            <circle cx="17" cy="20" r="1.2"/>
                        </svg>
                        <span class="hp-cart-badge">{{ ($cartCount ?? 0) > 99 ? '99+' : (int) ($cartCount ?? 0) }}</span>
                    </span>
                    <span>Cart</span>
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
