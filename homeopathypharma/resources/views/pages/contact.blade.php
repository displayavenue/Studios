@extends('layouts.app')

@section('title', 'Contact — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Contact</h1>
        <p class="hp-section__lead">Reach {{ $settings->brandName() }} using the details below.</p>

        <p><strong>Phone:</strong> <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></p>
        <p><strong>Address:</strong> {{ $settings->address() }}</p>

        @if (session('status'))
            <div class="hp-status" role="status">{{ session('status') }}</div>
        @endif

        <form class="hp-form" method="post" action="{{ route('contact.store') }}" style="margin-top:1.5rem;">
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
</section>
@endsection
