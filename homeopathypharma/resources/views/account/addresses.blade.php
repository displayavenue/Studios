@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Addresses — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Addresses</h1>
@if (session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
@forelse ($addresses as $address)
<article class="hp-product-card" style="margin-bottom:0.75rem;">
<p><strong>{{ $address->full_name }}</strong> · {{ $address->phone }}</p>
<p>{{ $address->line1 }} @if($address->line2), {{ $address->line2 }}@endif</p>
<p>{{ $address->city }}, {{ $address->state }} {{ $address->postal_code }}</p>
<form method="post" action="{{ route('account.addresses.destroy', $address) }}">@csrf @method('DELETE')
<button class="hp-btn hp-btn--secondary" type="submit">Remove</button>
</form>
</article>
@empty
<div class="hp-empty">No saved addresses yet.</div>
@endforelse
<h2>Add address</h2>
<form method="post" action="{{ route('account.addresses.store') }}" class="hp-form">
@csrf
<label class="hp-label">Label <input class="hp-input" name="label"></label>
<label class="hp-label">Full name <input class="hp-input" name="full_name" required></label>
<label class="hp-label">Phone <input class="hp-input" name="phone" required></label>
<label class="hp-label">Line 1 <input class="hp-input" name="line1" required></label>
<label class="hp-label">Line 2 <input class="hp-input" name="line2"></label>
<label class="hp-label">City <input class="hp-input" name="city" required></label>
<label class="hp-label">State <input class="hp-input" name="state" required></label>
<label class="hp-label">Postal code <input class="hp-input" name="postal_code" required></label>
<label class="hp-check"><input type="checkbox" name="is_default" value="1"> Default address</label>
<button class="hp-btn hp-btn--primary" type="submit">Save address</button>
</form>
</div></section>
@endsection
