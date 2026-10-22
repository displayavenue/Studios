@extends('layouts.app')
@section('title', 'Checkout — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Checkout</h1>
@unless ($razorpayConfigured)
<div class="hp-status">Payment is running in <strong>test mode</strong>. Razorpay credentials are not configured — no real charge will be made.</div>
@endunless
<p class="hp-section__lead">Subtotal: ₹{{ number_format($cart->subtotalPaise()/100, 2) }} · Gateway: {{ $gatewayName }}</p>

<form method="post" action="{{ route('checkout.store') }}" class="hp-form">
@csrf
<input type="hidden" name="idempotency_key" value="{{ (string) Illuminate\Support\Str::uuid() }}">
<label class="hp-label">Full name <input class="hp-input" name="customer_name" value="{{ old('customer_name', auth()->user()?->name) }}" required></label>
<label class="hp-label">Phone <input class="hp-input" name="customer_phone" value="{{ old('customer_phone', auth()->user()?->phone) }}" required></label>
<label class="hp-label">Email (optional) <input class="hp-input" type="email" name="customer_email" value="{{ old('customer_email', auth()->user()?->email) }}"></label>
<label class="hp-label">Address line 1 <input class="hp-input" name="shipping_line1" value="{{ old('shipping_line1') }}" required></label>
<label class="hp-label">Address line 2 <input class="hp-input" name="shipping_line2" value="{{ old('shipping_line2') }}"></label>
<label class="hp-label">City <input class="hp-input" name="shipping_city" value="{{ old('shipping_city') }}" required></label>
<label class="hp-label">State <input class="hp-input" name="shipping_state" value="{{ old('shipping_state') }}" required></label>
<label class="hp-label">Postal code <input class="hp-input" name="shipping_postal_code" value="{{ old('shipping_postal_code') }}" required></label>
<input type="hidden" name="shipping_country" value="IN">
<label class="hp-label">Order notes <textarea class="hp-textarea" name="notes">{{ old('notes') }}</textarea></label>
@if ($errors->any())
@foreach ($errors->all() as $error)<p class="hp-error">{{ $error }}</p>@endforeach
@endif
<button class="hp-btn hp-btn--primary" type="submit">Place order</button>
</form>
</div>
</section>
@endsection
