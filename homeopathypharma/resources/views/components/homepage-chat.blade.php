{{-- Homepage-only floating chat — product doubts, concerns, information --}}
@php
    $chatWhatsapp = $settings->whatsappUrl('Hi HOMEOPATHY PHARMA, I have a question about a product.');
    $chatOpenOnLoad = session('lead_success') && session('lead_form') === 'homepage_chat';
@endphp
<div
    class="hp-chat{{ $chatOpenOnLoad ? ' is-open' : '' }}"
    id="homepage-chat"
    data-hp-chat
    data-open="{{ $chatOpenOnLoad ? '1' : '0' }}"
>
    <div class="hp-chat__panel" id="homepage-chat-panel" role="dialog" aria-modal="false" aria-labelledby="hp-chat-title" @if (! $chatOpenOnLoad) hidden @endif data-hp-chat-panel>
        <header class="hp-chat__head">
            <div class="hp-chat__head-copy">
                <p class="hp-chat__eyebrow">HOMEOPATHY PHARMA</p>
                <h2 id="hp-chat-title">Ask about a product</h2>
                <p class="hp-chat__head-sub">Doubts, concerns, or information — we reply personally.</p>
            </div>
            <button type="button" class="hp-chat__close" data-hp-chat-close aria-label="Close chat">
                <span aria-hidden="true">&times;</span>
            </button>
        </header>

        <div class="hp-chat__body" data-hp-chat-body>
            <div class="hp-chat__bubble hp-chat__bubble--bot" data-hp-chat-welcome>
                Hi — tell us which product or health topic you need help with. Share your number so our team can reply.
            </div>

            @if ($chatOpenOnLoad)
                <div class="hp-chat__bubble hp-chat__bubble--bot hp-chat__bubble--success" role="status">
                    {{ session('status') }}
                </div>
            @endif

            <div class="hp-chat__bubble hp-chat__bubble--bot hp-chat__bubble--success" data-hp-chat-success hidden role="status"></div>
        </div>

        <form
            class="hp-chat__form"
            method="post"
            action="{{ route('contact.store') }}"
            data-hp-chat-form
            @if ($chatOpenOnLoad) hidden @endif
        >
            @csrf
            <input type="hidden" name="context" value="Homepage chat">
            <input type="hidden" name="lead_form" value="homepage_chat">
            <input type="hidden" name="consent" value="1">

            <label class="hp-sr-only" for="hp-chat-name">Your name</label>
            <input
                id="hp-chat-name"
                class="hp-chat__input"
                type="text"
                name="name"
                placeholder="Your name"
                autocomplete="name"
                required
                maxlength="120"
            >

            <label class="hp-sr-only" for="hp-chat-mobile">Mobile number</label>
            <input
                id="hp-chat-mobile"
                class="hp-chat__input"
                type="tel"
                name="contact"
                placeholder="Mobile number"
                autocomplete="tel"
                required
                maxlength="190"
            >

            <label class="hp-sr-only" for="hp-chat-message">Your question</label>
            <textarea
                id="hp-chat-message"
                class="hp-chat__textarea"
                name="message"
                placeholder="Ask about a product, dosage doubt, availability, or anything else…"
                rows="3"
                required
                maxlength="5000"
            ></textarea>

            <p class="hp-chat__consent">By sending, you agree to be contacted about this enquiry. Not for emergencies.</p>
            <p class="hp-chat__error" data-hp-chat-error hidden role="alert"></p>

            <button class="hp-chat__send" type="submit" data-hp-chat-send>Send message</button>
        </form>

        <footer class="hp-chat__foot">
            <a class="hp-chat__wa" href="{{ $chatWhatsapp }}" target="_blank" rel="noopener">
                Prefer WhatsApp? Chat now
            </a>
        </footer>
    </div>

    <button
        type="button"
        class="hp-chat__launcher"
        data-hp-chat-toggle
        aria-expanded="{{ $chatOpenOnLoad ? 'true' : 'false' }}"
        aria-controls="homepage-chat-panel"
    >
        <span class="hp-chat__launcher-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.3-3.6-.8L3 21l1.4-5.6A8.4 8.4 0 0 1 3.5 12 8.5 8.5 0 1 1 12 3.5 8.5 8.5 0 0 1 21 12Z"/>
                <path d="M8.5 11.2h7M8.5 14.2h4.5"/>
            </svg>
        </span>
        <span class="hp-chat__launcher-label">Chat with us</span>
    </button>
</div>

<script>
(function () {
    var root = document.querySelector('[data-hp-chat]');
    if (!root) return;

    var panel = root.querySelector('[data-hp-chat-panel]');
    var toggle = root.querySelector('[data-hp-chat-toggle]');
    var closeBtn = root.querySelector('[data-hp-chat-close]');
    var form = root.querySelector('[data-hp-chat-form]');
    var errorEl = root.querySelector('[data-hp-chat-error]');
    var successEl = root.querySelector('[data-hp-chat-success]');
    var sendBtn = root.querySelector('[data-hp-chat-send]');
    var openOnLoad = root.getAttribute('data-open') === '1';

    function setOpen(open) {
        root.classList.toggle('is-open', open);
        if (panel) panel.hidden = !open;
        if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            var first = root.querySelector('.hp-chat__input, .hp-chat__textarea');
            if (first && form && !form.hidden) {
                setTimeout(function () { first.focus(); }, 80);
            }
        }
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            setOpen(!root.classList.contains('is-open'));
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', function () { setOpen(false); });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });

    if (openOnLoad) setOpen(true);

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending…';
        }

        var fd = new FormData(form);
        var token = document.querySelector('meta[name="csrf-token"]');
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': token ? token.getAttribute('content') : ''
            },
            body: fd,
            credentials: 'same-origin'
        }).then(function (res) {
            return res.json().then(function (data) {
                return { ok: res.ok, status: res.status, data: data };
            }).catch(function () {
                return { ok: res.ok, status: res.status, data: null };
            });
        }).then(function (result) {
            if (result.ok && result.data && result.data.ok) {
                form.hidden = true;
                form.reset();
                if (successEl) {
                    successEl.hidden = false;
                    successEl.textContent = result.data.status || 'Thanks — our team will reply shortly.';
                }
                return;
            }

            var msg = 'Could not send. Please try again or use WhatsApp.';
            if (result.data && result.data.errors) {
                var firstKey = Object.keys(result.data.errors)[0];
                if (firstKey) msg = result.data.errors[firstKey][0];
            } else if (result.data && result.data.message) {
                msg = result.data.message;
            }
            if (errorEl) {
                errorEl.hidden = false;
                errorEl.textContent = msg;
            }
        }).catch(function () {
            if (errorEl) {
                errorEl.hidden = false;
                errorEl.textContent = 'Network error. Please try WhatsApp or call us.';
            }
        }).finally(function () {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send message';
            }
        });
    });
})();
</script>
