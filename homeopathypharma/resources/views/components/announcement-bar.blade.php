@php
    $announcement = $settings->announcementEnabled() && $settings->announcementText()
        ? $settings->announcementText()
        : 'Trusted Homeopathic Care for a Healthier Tomorrow';
@endphp
<div class="hp-topbar">
    <div class="hp-container hp-topbar__inner">
        <div class="hp-topbar__left">
            <span class="hp-topbar__announce">{{ $announcement }}</span>
            <span class="hp-topbar__dot hp-hide-sm" aria-hidden="true">·</span>
            <span class="hp-hide-sm">100% Genuine Products</span>
            <span class="hp-topbar__dot hp-hide-sm" aria-hidden="true">·</span>
            <span class="hp-hide-sm">Fast Delivery</span>
        </div>
        <div class="hp-topbar__social">
            @if ($settings->facebookUrl())
                <a href="{{ $settings->facebookUrl() }}" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
            @endif
            @if ($settings->instagramUrl())
                <a href="{{ $settings->instagramUrl() }}" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
            @endif
            <a href="{{ $settings->whatsappUrl('Hi HOMEOPATHY PHARMA') }}" target="_blank" rel="noopener" aria-label="WhatsApp">WhatsApp</a>
        </div>
    </div>
</div>
