@extends('layouts.chat')

@section('title', 'Chat with us — '.$settings->brandName())
@section('meta_description', 'Have a question? Chat with HOMEOPATHY PHARMA. Our team records every conversation so we can help you properly.')

@section('content')
<div
    class="hp-prochat"
    id="hp-prochat"
    data-hp-prochat
    data-start-url="{{ route('chat.api.start') }}"
    data-send-url-template="{{ url('/chat/api/__UUID__/messages') }}"
    data-poll-url-template="{{ url('/chat/api/__UUID__/messages') }}"
    data-whatsapp-url="{{ $whatsappUrl }}"
>
    <header class="hp-prochat__top">
        <div class="hp-prochat__brand-row">
            <a class="hp-prochat__brand" href="{{ route('home') }}">Homeopathy Pharma</a>
            <a class="hp-prochat__wa" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">Prefer WhatsApp?</a>
        </div>
        <h1 class="hp-prochat__headline">Have a question? We are here to help.</h1>
    </header>

    <div class="hp-prochat__thread" data-hp-prochat-thread role="log" aria-live="polite" aria-relevant="additions"></div>

    <form class="hp-prochat__composer" data-hp-prochat-form>
        <label class="hp-sr-only" for="hp-prochat-input">Type your message</label>
        <textarea
            id="hp-prochat-input"
            class="hp-prochat__input"
            data-hp-prochat-input
            rows="1"
            placeholder="Type your message…"
            enterkeyhint="send"
            maxlength="5000"
            required
        ></textarea>
        <button type="submit" class="hp-prochat__send" data-hp-prochat-send>Send</button>
    </form>
</div>
@endsection

@push('scripts')
<script>
(function () {
    var root = document.querySelector('[data-hp-prochat]');
    if (!root) return;

    var thread = root.querySelector('[data-hp-prochat-thread]');
    var form = root.querySelector('[data-hp-prochat-form]');
    var input = root.querySelector('[data-hp-prochat-input]');
    var sendBtn = root.querySelector('[data-hp-prochat-send]');
    var startUrl = root.getAttribute('data-start-url');
    var sendTpl = root.getAttribute('data-send-url-template');
    var pollTpl = root.getAttribute('data-poll-url-template');
    var csrf = (document.querySelector('meta[name="csrf-token"]') || {}).content || '';
    var storageKey = 'hp_chat_uuid_v1';
    var uuid = localStorage.getItem(storageKey) || '';
    var lastId = 0;
    var busy = false;
    var knownIds = {};

    function urlFor(tpl) {
        return tpl.replace('__UUID__', encodeURIComponent(uuid));
    }

    function scrollBottom() {
        requestAnimationFrame(function () {
            thread.scrollTop = thread.scrollHeight;
        });
    }

    function sideFor(sender) {
        return sender === 'visitor' ? 'out' : 'in';
    }

    function appendMessage(msg) {
        if (!msg || !msg.id || knownIds[msg.id]) return;
        knownIds[msg.id] = true;
        lastId = Math.max(lastId, msg.id);

        var row = document.createElement('div');
        row.className = 'hp-prochat__row hp-prochat__row--' + sideFor(msg.sender);
        var bubble = document.createElement('div');
        bubble.className = 'hp-prochat__bubble hp-prochat__bubble--' + sideFor(msg.sender);
        if (msg.sender === 'system') bubble.classList.add('hp-prochat__bubble--system');
        if (msg.sender === 'agent') bubble.classList.add('hp-prochat__bubble--agent');

        var text = document.createElement('p');
        text.className = 'hp-prochat__text';
        text.textContent = msg.body;

        var meta = document.createElement('span');
        meta.className = 'hp-prochat__meta';
        meta.textContent = msg.created_at || '';

        bubble.appendChild(text);
        bubble.appendChild(meta);
        row.appendChild(bubble);
        thread.appendChild(row);
        scrollBottom();
    }

    function autosize() {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
    }

    function start() {
        return fetch(startUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf
            },
            credentials: 'same-origin',
            body: JSON.stringify({ uuid: uuid || null })
        }).then(function (r) { return r.json(); }).then(function (data) {
            uuid = data.conversation.uuid;
            localStorage.setItem(storageKey, uuid);
            (data.messages || []).forEach(appendMessage);
            input.focus({ preventScroll: true });
        });
    }

    function poll() {
        if (!uuid) return;
        fetch(urlFor(pollTpl) + '?after_id=' + lastId, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin'
        }).then(function (r) { return r.json(); }).then(function (data) {
            (data.messages || []).forEach(appendMessage);
        }).catch(function () {});
    }

    function send(raw) {
        var body = String(raw || '').trim();
        if (!body || busy || !uuid) return;
        busy = true;
        sendBtn.disabled = true;

        fetch(urlFor(sendTpl), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf
            },
            credentials: 'same-origin',
            body: JSON.stringify({ body: body })
        }).then(function (r) {
            return r.json().then(function (data) { return { ok: r.ok, data: data }; });
        }).then(function (result) {
            if (result.ok && result.data) {
                input.value = '';
                autosize();
                if (result.data.message) appendMessage(result.data.message);
                (result.data.auto_replies || []).forEach(appendMessage);
                return;
            }
            var err = (result.data && result.data.message) || 'Could not send. Please try again.';
            appendMessage({
                id: 'local-err-' + Date.now(),
                sender: 'system',
                body: err,
                created_at: ''
            });
        }).catch(function () {
            appendMessage({
                id: 'local-net-' + Date.now(),
                sender: 'system',
                body: 'Network error. Please try again or use Prefer WhatsApp?',
                created_at: ''
            });
        }).finally(function () {
            busy = false;
            sendBtn.disabled = false;
            input.focus({ preventScroll: true });
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        send(input.value);
    });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(input.value);
        }
    });
    input.addEventListener('input', autosize);

    start().then(function () {
        setInterval(poll, 4000);
    }).catch(function () {
        thread.innerHTML = '<p class="hp-prochat__boot-error">Unable to start chat. Please refresh or use Prefer WhatsApp?</p>';
    });
})();
</script>
@endpush
