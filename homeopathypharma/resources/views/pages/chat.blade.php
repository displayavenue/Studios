@extends('layouts.chat')

@section('title', 'Chat with us — '.$settings->brandName())
@section('meta_description', 'Have a question? Chat with HOMEOPATHY PHARMA about products, availability, or your health concern.')

@section('content')
<div
    class="hp-wa"
    id="hp-wa-chat"
    data-hp-wa
    data-post-url="{{ route('contact.store') }}"
    data-whatsapp-url="{{ $whatsappUrl }}"
    data-home-url="{{ route('home') }}"
    data-brand="{{ $settings->brandName() }}"
>
    <header class="hp-wa__header">
        <a class="hp-wa__back" href="{{ route('home') }}" aria-label="Back to home">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </a>
        <div class="hp-wa__avatar" aria-hidden="true">HP</div>
        <div class="hp-wa__peer">
            <h1 class="hp-wa__title">Have a question? We are here to help.</h1>
            <p class="hp-wa__status" data-hp-wa-status>online</p>
        </div>
        <a class="hp-wa__wa-link" href="{{ $whatsappUrl }}" target="_blank" rel="noopener" title="Open WhatsApp">
            Prefer WhatsApp?
        </a>
    </header>

    <div class="hp-wa__thread" data-hp-wa-thread role="log" aria-live="polite" aria-relevant="additions"></div>

    <div class="hp-wa__typing" data-hp-wa-typing hidden>
        <span></span><span></span><span></span>
    </div>

    <form class="hp-wa__composer" data-hp-wa-composer autocomplete="on">
        <label class="hp-sr-only" for="hp-wa-input">Type a message</label>
        <button type="button" class="hp-wa__emoji" data-hp-wa-emoji aria-label="Insert emoji" title="Emoji">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"/>
                <path d="M8.5 10.2h.01M15.5 10.2h.01M8.8 14.2c1.1 1.1 2.5 1.5 3.2 1.5s2.1-.4 3.2-1.5"/>
            </svg>
        </button>
        <div class="hp-wa__emoji-panel" data-hp-wa-emoji-panel hidden>
            <button type="button" data-emoji="🙂">🙂</button>
            <button type="button" data-emoji="😊">😊</button>
            <button type="button" data-emoji="👍">👍</button>
            <button type="button" data-emoji="🙏">🙏</button>
            <button type="button" data-emoji="💊">💊</button>
            <button type="button" data-emoji="🌿">🌿</button>
            <button type="button" data-emoji="✅">✅</button>
            <button type="button" data-emoji="❓">❓</button>
        </div>
        <textarea
            id="hp-wa-input"
            class="hp-wa__input"
            data-hp-wa-input
            rows="1"
            placeholder="Type a message"
            enterkeyhint="send"
            inputmode="text"
            autocomplete="on"
            maxlength="5000"
            required
        ></textarea>
        <button type="submit" class="hp-wa__send" data-hp-wa-send aria-label="Send message">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    </form>
</div>

@endsection

@push('scripts')
<script>
(function () {
    var root = document.querySelector('[data-hp-wa]');
    if (!root) return;

    var thread = root.querySelector('[data-hp-wa-thread]');
    var form = root.querySelector('[data-hp-wa-composer]');
    var input = root.querySelector('[data-hp-wa-input]');
    var sendBtn = root.querySelector('[data-hp-wa-send]');
    var typingEl = root.querySelector('[data-hp-wa-typing]');
    var statusEl = root.querySelector('[data-hp-wa-status]');
    var emojiBtn = root.querySelector('[data-hp-wa-emoji]');
    var emojiPanel = root.querySelector('[data-hp-wa-emoji-panel]');
    var postUrl = root.getAttribute('data-post-url');
    var waUrl = root.getAttribute('data-whatsapp-url');
    var brand = root.getAttribute('data-brand') || 'HOMEOPATHY PHARMA';
    var csrf = (document.querySelector('meta[name="csrf-token"]') || {}).content || '';

    var state = {
        step: 'name', // name | phone | message | done
        name: '',
        phone: '',
        busy: false
    };

    function nowLabel() {
        try {
            return new Intl.DateTimeFormat('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).format(new Date());
        } catch (e) {
            var d = new Date();
            return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
        }
    }

    function scrollBottom() {
        requestAnimationFrame(function () {
            thread.scrollTop = thread.scrollHeight;
        });
    }

    function bubble(text, side, meta) {
        var row = document.createElement('div');
        row.className = 'hp-wa__row hp-wa__row--' + side;
        var msg = document.createElement('div');
        msg.className = 'hp-wa__bubble hp-wa__bubble--' + side;
        var body = document.createElement('p');
        body.className = 'hp-wa__text';
        body.textContent = text;
        var time = document.createElement('span');
        time.className = 'hp-wa__time';
        time.textContent = meta || nowLabel();
        msg.appendChild(body);
        msg.appendChild(time);
        row.appendChild(msg);
        thread.appendChild(row);
        scrollBottom();
        return row;
    }

    function setTyping(on) {
        if (!typingEl) return;
        typingEl.hidden = !on;
        if (statusEl) statusEl.textContent = on ? 'typing…' : 'online';
        if (on) scrollBottom();
    }

    function botSay(text, delay) {
        delay = delay == null ? 650 : delay;
        return new Promise(function (resolve) {
            setTyping(true);
            setTimeout(function () {
                setTyping(false);
                bubble(text, 'in');
                resolve();
            }, delay);
        });
    }

    function setInputMode(step) {
        if (step === 'phone') {
            input.setAttribute('inputmode', 'tel');
            input.setAttribute('autocomplete', 'tel');
            input.placeholder = 'Enter your mobile number';
        } else if (step === 'name') {
            input.setAttribute('inputmode', 'text');
            input.setAttribute('autocomplete', 'name');
            input.placeholder = 'Type your name';
        } else {
            input.setAttribute('inputmode', 'text');
            input.setAttribute('autocomplete', 'off');
            input.placeholder = 'Type a message';
        }
        input.focus({ preventScroll: true });
    }

    function autosize() {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    function validPhone(value) {
        var digits = String(value).replace(/\D+/g, '');
        return digits.length >= 10 && digits.length <= 15;
    }

    function postLead(message) {
        var fd = new FormData();
        fd.append('_token', csrf);
        fd.append('name', state.name);
        fd.append('contact', state.phone);
        fd.append('message', message);
        fd.append('consent', '1');
        fd.append('context', 'Homepage chat');
        fd.append('lead_form', 'homepage_chat');

        return fetch(postUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf
            },
            body: fd,
            credentials: 'same-origin'
        }).then(function (res) {
            return res.json().then(function (data) {
                return { ok: res.ok, data: data };
            }).catch(function () {
                return { ok: false, data: null };
            });
        });
    }

    function handleSend(raw) {
        var text = String(raw || '').trim();
        if (!text || state.busy) return;
        state.busy = true;
        sendBtn.disabled = true;
        bubble(text, 'out');
        input.value = '';
        autosize();

        var chain = Promise.resolve();

        if (state.step === 'name') {
            state.name = text.slice(0, 120);
            state.step = 'phone';
            chain = botSay('Thanks, ' + state.name + '. What is your mobile number?')
                .then(function () { setInputMode('phone'); });
        } else if (state.step === 'phone') {
            if (!validPhone(text)) {
                chain = botSay('Please enter a valid mobile number (10+ digits).')
                    .then(function () { setInputMode('phone'); });
            } else {
                state.phone = text.slice(0, 190);
                state.step = 'message';
                chain = botSay('Got it. Tell us what you need help with — product, availability, or anything else.')
                    .then(function () { setInputMode('message'); });
            }
        } else {
            chain = postLead(text).then(function (result) {
                if (result.ok && result.data && result.data.ok) {
                    state.step = 'done';
                    return botSay(result.data.status || 'Thanks — our team will reply shortly.')
                        .then(function () {
                            return botSay('You can keep typing here, or Prefer WhatsApp for a live chat: ' + (waUrl ? 'tap Prefer WhatsApp? above.' : ''), 500);
                        })
                        .then(function () {
                            state.step = 'message';
                            setInputMode('message');
                        });
                }
                var err = (result.data && result.data.message) || 'Could not send. Please try again or use WhatsApp.';
                if (result.data && result.data.errors) {
                    var key = Object.keys(result.data.errors)[0];
                    if (key) err = result.data.errors[key][0];
                }
                return botSay(err);
            }).catch(function () {
                return botSay('Network error. Please try WhatsApp or call us.');
            });
        }

        chain.finally(function () {
            state.busy = false;
            sendBtn.disabled = false;
            input.focus({ preventScroll: true });
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSend(input.value);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input.value);
        }
    });
    input.addEventListener('input', autosize);

    if (emojiBtn && emojiPanel) {
        emojiBtn.addEventListener('click', function () {
            emojiPanel.hidden = !emojiPanel.hidden;
        });
        emojiPanel.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-emoji]');
            if (!btn) return;
            var emoji = btn.getAttribute('data-emoji') || '';
            var start = input.selectionStart || input.value.length;
            var end = input.selectionEnd || input.value.length;
            input.value = input.value.slice(0, start) + emoji + input.value.slice(end);
            input.focus();
            var pos = start + emoji.length;
            input.setSelectionRange(pos, pos);
            autosize();
            emojiPanel.hidden = true;
        });
        document.addEventListener('click', function (e) {
            if (!emojiPanel.hidden && !emojiPanel.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
                emojiPanel.hidden = true;
            }
        });
    }

    // Boot conversation
    botSay('Have a question? We are here to help.', 350)
        .then(function () {
            return botSay('What is your name?', 550);
        })
        .then(function () {
            setInputMode('name');
        });
})();
</script>
@endpush
