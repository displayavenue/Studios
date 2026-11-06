{{-- Homepage-only floating chat icon → dedicated chat page --}}
<a
    class="hp-chat-fab"
    id="homepage-chat"
    href="{{ route('chat.show') }}"
    aria-label="Open chat — Have a question? We are here to help."
>
    <span class="hp-chat-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.3-3.6-.8L3 21l1.4-5.6A8.4 8.4 0 0 1 3.5 12 8.5 8.5 0 1 1 12 3.5 8.5 8.5 0 0 1 21 12Z"/>
            <path d="M8.5 11.2h7M8.5 14.2h4.5"/>
        </svg>
    </span>
</a>
