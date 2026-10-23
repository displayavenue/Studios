@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Register — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Create account</h1>
<form method="post" action="{{ route('account.register.submit') }}" class="hp-form">
@csrf
<label class="hp-label">Name <input class="hp-input" name="name" value="{{ old('name') }}" required></label>
<label class="hp-label">Email <input class="hp-input" type="email" name="email" value="{{ old('email') }}" required></label>
<label class="hp-label">Phone <input class="hp-input" name="phone" value="{{ old('phone') }}"></label>
<label class="hp-label">Password <input class="hp-input" type="password" name="password" required></label>
<label class="hp-label">Confirm password <input class="hp-input" type="password" name="password_confirmation" required></label>
@foreach ($errors->all() as $error)<p class="hp-error">{{ $error }}</p>@endforeach
<button class="hp-btn hp-btn--primary" type="submit">Register</button>
</form>
</div></section>
@endsection
