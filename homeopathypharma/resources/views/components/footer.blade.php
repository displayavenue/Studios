<footer class="hp-footer">
    <div class="hp-container">
        <div class="hp-footer__grid">
            <div>
                <p class="hp-footer__brand">{{ $settings->brandName() }}</p>
                <p>{{ $settings->tagline() }}</p>
                <p style="margin-top:1rem;">
                    <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>
                </p>
                <p>{{ $settings->address() }}</p>
            </div>
            <div>
                <h3>Explore</h3>
                <ul>
                    <li><a href="{{ route('shop.index') }}">Shop</a></li>
                    <li><a href="{{ route('doctors.index') }}">Consult a Doctor</a></li>
                    <li><a href="{{ route('health-library.index') }}">Health Library</a></li>
                    <li><a href="{{ route('about') }}">About</a></li>
                    <li><a href="{{ route('about.founders') }}">Founders</a></li>
                </ul>
            </div>
            <div>
                <h3>Help</h3>
                <ul>
                    <li><a href="{{ route('contact.show') }}">Contact</a></li>
                    <li><a href="{{ route('cart') }}">Cart</a></li>
                    <li><a href="{{ route('account') }}">Account</a></li>
                </ul>
            </div>
        </div>
        <p class="hp-footer__copy">&copy; {{ now()->year }} {{ $settings->brandName() }}. All rights reserved.</p>
    </div>
</footer>
