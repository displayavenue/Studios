@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Login — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Account login</h1>
<form method="post" action="{{ route('account.login.submit') }}" class="hp-form">
@csrf
<label class="hp-label">Email <input class="hp-input" type="email" name="email" value="{{ old('email') }}" required></label>
<label class="hp-label">Password <input class="hp-input" type="password" name="password" required></label>
@error('email')<p class="hp-error">{{ $message }}</p>@enderror
<label class="hp-check"><input type="checkbox" name="remember" value="1"> Remember me</label>
<button class="hp-btn hp-btn--primary" type="submit">Sign in</button>
</form>
<p style="margin-top:1rem;"><a href="{{ route('account.register') }}">Create an account</a></p>
</div></section>
@endsection
