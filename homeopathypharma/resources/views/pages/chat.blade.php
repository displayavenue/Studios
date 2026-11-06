@extends('layouts.app')

@section('title', 'Chat with us — '.$settings->brandName())
@section('meta_description', 'Have a question? Send a message to HOMEOPATHY PHARMA about products, availability, or your health concern.')

@section('content')
<section class="hp-chat-page" aria-label="Chat with us">
    <div class="hp-chat-page__shell">
        <header class="hp-chat-page__head">
            <p class="hp-chat-page__eyebrow">{{ $settings->brandName() }}</p>
            <h1>Have a question? We are here to help.</h1>
        </header>

        <div class="hp-chat-page__card">
            @if (session('lead_success') && session('lead_form') === 'homepage_chat')
                <div class="hp-chat-page__success" role="status" aria-live="polite">
                    <p>{{ session('status') }}</p>
                    <a class="hp-btn hp-btn--secondary" href="{{ route('home') }}">Back to home</a>
                </div>
            @else
                <form class="hp-chat-page__form" method="post" action="{{ route('contact.store') }}">
                    @csrf
                    <input type="hidden" name="context" value="Homepage chat">
                    <input type="hidden" name="lead_form" value="homepage_chat">
                    <input type="hidden" name="consent" value="1">

                    <label class="hp-label" for="chat-page-name">Your name</label>
                    <input
                        id="chat-page-name"
                        class="hp-input"
                        type="text"
                        name="name"
                        value="{{ old('lead_form') === 'homepage_chat' ? old('name') : '' }}"
                        placeholder="Your name"
                        autocomplete="name"
                        required
                        maxlength="120"
                    >
                    @error('name')
                        @if (old('lead_form') === 'homepage_chat')
                            <p class="hp-error">{{ $message }}</p>
                        @endif
                    @enderror

                    <label class="hp-label" for="chat-page-mobile">Mobile number</label>
                    <input
                        id="chat-page-mobile"
                        class="hp-input"
                        type="tel"
                        name="contact"
                        value="{{ old('lead_form') === 'homepage_chat' ? old('contact') : '' }}"
                        placeholder="Mobile number"
                        autocomplete="tel"
                        required
                        maxlength="190"
                    >
                    @error('contact')
                        @if (old('lead_form') === 'homepage_chat')
                            <p class="hp-error">{{ $message }}</p>
                        @endif
                    @enderror

                    <label class="hp-label" for="chat-page-message">Your message</label>
                    <textarea
                        id="chat-page-message"
                        class="hp-textarea"
                        name="message"
                        rows="6"
                        placeholder="Tell us what you need help with…"
                        required
                        maxlength="5000"
                    >{{ old('lead_form') === 'homepage_chat' ? old('message') : '' }}</textarea>
                    @error('message')
                        @if (old('lead_form') === 'homepage_chat')
                            <p class="hp-error">{{ $message }}</p>
                        @endif
                    @enderror

                    <p class="hp-chat-page__consent">By sending, you agree to be contacted about this enquiry. Not for emergencies.</p>

                    @if ($errors->any() && old('lead_form') === 'homepage_chat')
                        <p class="hp-error" role="alert">{{ $errors->first() }}</p>
                    @endif

                    <button class="hp-btn hp-btn--primary hp-chat-page__send" type="submit">Send message</button>
                </form>
            @endif

            <p class="hp-chat-page__wa-wrap">
                <a class="hp-chat-page__wa" href="{{ $whatsappUrl }}" target="_blank" rel="noopener">
                    Prefer WhatsApp? Chat now
                </a>
            </p>
        </div>
    </div>
</section>
@endsection
