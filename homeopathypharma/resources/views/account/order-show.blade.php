@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Order '.$order->number)
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Order {{ $order->number }}</h1>
<p>Payment: {{ $order->payment_status }} · Fulfilment: {{ $order->fulfilment_status }}</p>
<p>Total: {{ $order->formattedTotal() }}</p>
<ul>
@foreach ($order->items as $item)
<li>{{ $item->product_name }} × {{ $item->quantity }}</li>
@endforeach
</ul>
</div></section>
@endsection
