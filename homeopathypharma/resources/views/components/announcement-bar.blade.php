@if ($settings->announcementEnabled() && $settings->announcementText())
    <div class="hp-announce" role="status">{{ $settings->announcementText() }}</div>
@endif
