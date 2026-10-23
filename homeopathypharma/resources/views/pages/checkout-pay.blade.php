@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Pay for order — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Pay for order {{ $order->number }}</h1>
<p>Total due: <strong>{{ $order->formattedTotal() }}</strong></p>
<p class="hp-muted">Payment status is only marked paid after server verification.</p>

@if ($gateway === 'test')
<div class="hp-status">Test payment mode. Click below to simulate a successful verified payment.</div>
<form method="post" action="{{ route('checkout.confirm-test') }}">
@csrf
<input type="hidden" name="order_id" value="{{ $order->id }}">
<button class="hp-btn hp-btn--primary" type="submit">Confirm test payment</button>
</form>
@else
<div class="hp-status">Razorpay checkout session created ({{ $payment->provider_order_id }}). Embed the Razorpay Checkout script with your key when going live.</div>
<a class="hp-btn hp-btn--secondary" href="{{ route('checkout.failed') }}">Payment failed</a>
@endif
</div>
</section>
@endsection
