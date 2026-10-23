@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Orders — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Your orders</h1>
@forelse ($orders as $order)
<p><a href="{{ route('account.orders.show', $order) }}">{{ $order->number }}</a> — {{ $order->formattedTotal() }} — {{ $order->payment_status }}</p>
@empty
<div class="hp-empty">No orders yet.</div>
@endforelse
{{ $orders->links() }}
</div></section>
@endsection
