@extends('layouts.app')
@section('title', 'Cart — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Cart</h1>
@if (session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
@if ($errors->any())<div class="hp-status" style="border-color:#B42318;color:#B42318;">{{ $errors->first() }}</div>@endif

@if ($cart->items->isEmpty())
<div class="hp-empty">Your cart is empty. <a href="{{ route('shop.index') }}">Continue shopping</a></div>
@else
<table class="admin-table" style="width:100%;background:#fff;border:1px solid var(--hp-border);border-radius:0.75rem;">
<thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
<tbody>
@foreach ($cart->items as $item)
<tr>
<td>{{ $item->product?->name }}</td>
<td>₹{{ number_format($item->unitPricePaise()/100, 2) }}</td>
<td>
<form method="post" action="{{ route('cart.update', $item) }}" class="hp-btn-row">
@csrf @method('PATCH')
<input class="hp-input" style="width:4.5rem;" type="number" name="quantity" value="{{ $item->quantity }}" min="0" max="99">
<button class="hp-btn hp-btn--secondary" type="submit">Update</button>
</form>
</td>
<td>₹{{ number_format($item->lineTotalPaise()/100, 2) }}</td>
<td>
<form method="post" action="{{ route('cart.remove', $item) }}">@csrf @method('DELETE')
<button class="hp-btn hp-btn--secondary" type="submit">Remove</button>
</form>
</td>
</tr>
@endforeach
</tbody>
</table>
<p style="margin-top:1rem;font-weight:700;">Subtotal: ₹{{ number_format($cart->subtotalPaise()/100, 2) }}</p>
<p class="hp-muted">Shipping and tax are calculated at checkout when configured.</p>
<div class="hp-btn-row" style="margin-top:1rem;">
<a class="hp-btn hp-btn--secondary" href="{{ route('shop.index') }}">Continue shopping</a>
<a class="hp-btn hp-btn--primary" href="{{ route('checkout.show') }}">Proceed to checkout</a>
</div>
@endif
</div>
</section>
@endsection
