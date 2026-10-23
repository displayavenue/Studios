@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Order status — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Order {{ $order->number }}</h1>
@if ($verified)
<div class="hp-status">Payment verified. Thank you — your order is {{ $order->fulfilment_status }}.</div>
@else
<div class="hp-status">Order recorded. Payment is <strong>{{ $order->payment_status }}</strong> until the provider response is verified on the server.</div>
@endif
<p>Total: {{ $order->formattedTotal() }}</p>
<ul>
@foreach ($order->items as $item)
<li>{{ $item->product_name }} × {{ $item->quantity }} — ₹{{ number_format($item->line_total_paise/100, 2) }}</li>
@endforeach
</ul>
@auth
<p><a href="{{ route('account.orders.show', $order) }}">View in your account</a></p>
@endauth
<a class="hp-btn hp-btn--secondary" href="{{ route('shop.index') }}">Continue shopping</a>
</div>
</section>
@endsection
