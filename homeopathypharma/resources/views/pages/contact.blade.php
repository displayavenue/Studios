@extends('layouts.app')

@section('title', 'Contact — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <div class="hp-page__intro">
            <h1>Contact</h1>
            <p class="hp-section__lead">Reach {{ $settings->brandName() }} using the details below.</p>
        </div>

        @if (session('status'))
            <div class="hp-status" role="status">{{ session('status') }}</div>
        @endif

        <div class="hp-contact-layout">
            <dl class="hp-contact-details">
                <div>
                    <dt>Phone</dt>
                    <dd><a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></dd>
                </div>
                <div>
                    <dt>Address</dt>
                    <dd>{{ $settings->address() }}</dd>
                </div>
                @if ($settings->instagramUrl() || $settings->facebookUrl())
                    <div>
                        <dt>Social</dt>
                        <dd>
                            @if ($settings->instagramUrl())
                                <a href="{{ $settings->instagramUrl() }}" target="_blank" rel="noopener">Instagram</a>
                            @endif
                            @if ($settings->instagramUrl() && $settings->facebookUrl()) · @endif
                            @if ($settings->facebookUrl())
                                <a href="{{ $settings->facebookUrl() }}" target="_blank" rel="noopener">Facebook</a>
                            @endif
                        </dd>
                    </div>
                @endif
            </dl>

            <form class="hp-form" method="post" action="{{ route('contact.store') }}">
                @csrf
                <label class="hp-label">
                    Name
                    <input class="hp-input" type="text" name="name" value="{{ old('name') }}" required maxlength="120">
                    @error('name')<p class="hp-error">{{ $message }}</p>@enderror
                </label>
                <label class="hp-label">
                    Phone or email
                    <input class="hp-input" type="text" name="contact" value="{{ old('contact') }}" required maxlength="190">
                    @error('contact')<p class="hp-error">{{ $message }}</p>@enderror
                </label>
                <label class="hp-label">
                    Message
                    <textarea class="hp-textarea" name="message" required maxlength="5000">{{ old('message') }}</textarea>
                    @error('message')<p class="hp-error">{{ $message }}</p>@enderror
                </label>
                <label class="hp-check">
                    <input type="checkbox" name="consent" value="1" @checked(old('consent'))>
                    <span>I agree to be contacted about this enquiry. Please do not include sensitive medical details.</span>
                </label>
                @error('consent')<p class="hp-error">{{ $message }}</p>@enderror
                <button class="hp-btn hp-btn--primary" type="submit">Send message</button>
            </form>
        </div>
    </div>
</section>
@endsection
