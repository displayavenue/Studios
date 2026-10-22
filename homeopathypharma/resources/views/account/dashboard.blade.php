@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'My account — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Hello, {{ $user->name }}</h1>
<ul>
<li><a href="{{ route('account.profile') }}">Profile</a></li>
<li><a href="{{ route('account.addresses') }}">Addresses</a></li>
<li><a href="{{ route('account.orders') }}">Orders</a></li>
</ul>
<form method="post" action="{{ route('account.logout') }}">@csrf
<button class="hp-btn hp-btn--secondary" type="submit">Log out</button>
</form>
</div></section>
@endsection
