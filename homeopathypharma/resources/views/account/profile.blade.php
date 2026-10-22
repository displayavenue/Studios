@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Profile — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Profile</h1>
@if (session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<form method="post" action="{{ route('account.profile.update') }}" class="hp-form">
@csrf @method('PUT')
<label class="hp-label">Name <input class="hp-input" name="name" value="{{ old('name', $user->name) }}" required></label>
<label class="hp-label">Email <input class="hp-input" value="{{ $user->email }}" disabled></label>
<label class="hp-label">Phone <input class="hp-input" name="phone" value="{{ old('phone', $user->phone) }}"></label>
<button class="hp-btn hp-btn--primary" type="submit">Save</button>
</form>
</div></section>
@endsection
