@extends('layouts.admin')
@section('title', 'Order '.$order->number)
@section('content')
<div class="admin-top"><h2>Order {{ $order->number }}</h2></div>
<div class="admin-card" style="margin-bottom:1rem;">
<p><strong>Customer:</strong> {{ $order->customer_name }} · {{ $order->customer_phone }}</p>
<p><strong>Ship to:</strong> {{ $order->shipping_line1 }}, {{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_postal_code }}</p>
<p><strong>Payment:</strong> {{ $order->payment_status }} @if($order->paid_at)(paid {{ $order->paid_at }})@endif</p>
<p><strong>Total:</strong> {{ $order->formattedTotal() }}</p>
<ul>
@foreach ($order->items as $item)
<li>{{ $item->product_name }} × {{ $item->quantity }} — ₹{{ number_format($item->line_total_paise/100, 2) }}</li>
@endforeach
</ul>
</div>

@if ($order->shipments->isNotEmpty())
<div class="admin-card" style="margin-bottom:1rem;">
<h3 style="margin-top:0;">Shipments</h3>
<ul>
@foreach ($order->shipments as $shipment)
<li>
{{ $shipment->provider }} · {{ $shipment->status }}
@if ($shipment->courier) · {{ $shipment->courier }}@endif
@if ($shipment->tracking_number) · tracking {{ $shipment->tracking_number }}@endif
</li>
@endforeach
</ul>
</div>
@endif

<form method="post" action="{{ route('admin.orders.update', $order) }}" class="admin-form admin-card">
@csrf @method('PUT')
<label>Fulfilment status
<select name="fulfilment_status">
@foreach (['unfulfilled','processing','shipped','delivered','cancelled'] as $s)
<option value="{{ $s }}" @selected($order->fulfilment_status===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Courier (optional) <input name="courier" value="{{ old('courier', $order->shipment?->courier) }}"></label>
<label>Tracking number (optional) <input name="tracking_number" value="{{ old('tracking_number', $order->shipment?->tracking_number) }}"></label>
<p style="color:#68746D;font-size:0.9rem;">Moving to processing/shipped creates a shipment via Manual or Shiprocket (when configured). Payment status cannot be set to paid from admin — only verified provider responses / webhooks can.</p>
<button class="btn btn-primary" type="submit">Update fulfilment</button>
</form>
@endsection
