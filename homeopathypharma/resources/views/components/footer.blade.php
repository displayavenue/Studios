@php
    $policyPages = \App\Models\PolicyPage::query()->published()->orderBy('title')->get(['title', 'slug']);
@endphp
<footer class="hp-footer hp-footer--rich">
    <div class="hp-container">
        <div class="hp-footer__grid hp-footer__grid--5">
            <div>
                <p class="hp-footer__brand">HomeopathyPharma</p>
                <p class="hp-footer__intro">{{ $settings->tagline() }} Genuine medicines and expert guidance from Mira Road, Mumbai.</p>
                <p class="hp-footer__social">
                    @if ($settings->facebookUrl())
                        <a href="{{ $settings->facebookUrl() }}" target="_blank" rel="noopener">Facebook</a>
                    @endif
                    @if ($settings->instagramUrl())
                        <a href="{{ $settings->instagramUrl() }}" target="_blank" rel="noopener">Instagram</a>
                    @endif
                    <a href="{{ $settings->whatsappUrl() }}" target="_blank" rel="noopener">WhatsApp</a>
                </p>
            </div>
            <div>
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="{{ route('shop.index') }}">Shop</a></li>
                    <li><a href="{{ route('doctors.index') }}">Consult a Doctor</a></li>
                    <li><a href="{{ route('conditions.index') }}">Conditions</a></li>
                    <li><a href="{{ route('health-library.index') }}">Health Library</a></li>
                    <li><a href="{{ route('about') }}">About Us</a></li>
                    <li><a href="{{ route('about.founders') }}">Founders</a></li>
                </ul>
            </div>
            <div>
                <h3>Customer Support</h3>
                <ul>
                    <li><a href="{{ route('account.dashboard') }}">Track Order</a></li>
                    <li><a href="{{ route('contact.show') }}">Need Help?</a></li>
                    <li><a href="{{ route('cart') }}">Cart</a></li>
                    <li><a href="{{ route('account.dashboard') }}">Account</a></li>
                    <li><a href="{{ route('gallery') }}">Gallery</a></li>
                </ul>
            </div>
            <div>
                <h3>Policies</h3>
                <ul>
                    @forelse ($policyPages as $policyPage)
                        <li><a href="{{ route('policies.show', $policyPage->slug) }}">{{ $policyPage->title }}</a></li>
                    @empty
                        <li><a href="{{ route('contact.show') }}">Contact for policy copies</a></li>
                    @endforelse
                </ul>
            </div>
            <div>
                <h3>Contact Us</h3>
                <ul class="hp-footer-contact">
                    <li><a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></li>
                    <li>{{ $settings->address() }}</li>
                    <li><a href="{{ $settings->whatsappUrl() }}" target="_blank" rel="noopener">Chat on WhatsApp</a></li>
                </ul>
            </div>
        </div>
        <p class="hp-footer__copy">
            &copy; {{ now()->year }} {{ $settings->brandName() }}. All rights reserved.
            <span>Designed for a Healthier Tomorrow.</span>
        </p>
    </div>
</footer>
