@php
    $policyPages = \App\Models\PolicyPage::query()->published()->orderBy('title')->get(['title', 'slug']);
@endphp
<footer class="hp-footer">
    <div class="hp-container">
        <div class="hp-footer__grid">
            <div>
                <p class="hp-footer__brand">{{ $settings->brandName() }}</p>
                <p class="hp-footer__intro">{{ $settings->tagline() }}</p>
                <div class="hp-footer__contact">
                    <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a>
                    <span>{{ $settings->address() }}</span>
                </div>
                <p class="hp-footer__social">
                    @if ($settings->facebookUrl())
                        <a href="{{ $settings->facebookUrl() }}" target="_blank" rel="noopener">Facebook</a>
                    @endif
                    @if ($settings->instagramUrl())
                        <a href="{{ $settings->instagramUrl() }}" target="_blank" rel="noopener">Instagram</a>
                    @endif
                </p>
            </div>
            <div>
                <h3>Explore</h3>
                <ul>
                    <li><a href="{{ route('shop.index') }}">Shop</a></li>
                    <li><a href="{{ route('doctors.index') }}">Consult a Doctor</a></li>
                    <li><a href="{{ route('blog.index') }}">Blog</a></li>
                    <li><a href="{{ route('health-library.index') }}">Health Library</a></li>
                    <li><a href="{{ route('gallery') }}">Gallery</a></li>
                    <li><a href="{{ route('about') }}">About</a></li>
                    <li><a href="{{ route('about.founders') }}">Founders</a></li>
                </ul>
            </div>
            <div>
                <h3>Help</h3>
                <ul>
                    <li><a href="{{ route('contact.show') }}">Contact</a></li>
                    <li><a href="{{ route('cart') }}">Cart</a></li>
                    <li><a href="{{ route('account.dashboard') }}">Account</a></li>
                    @foreach ($policyPages as $policyPage)
                        <li><a href="{{ route('policies.show', $policyPage->slug) }}">{{ $policyPage->title }}</a></li>
                    @endforeach
                </ul>
            </div>
        </div>
        <p class="hp-footer__copy">&copy; {{ now()->year }} {{ $settings->brandName() }}. All rights reserved.</p>
    </div>
</footer>
