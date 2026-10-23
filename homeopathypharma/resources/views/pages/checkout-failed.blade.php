@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Payment failed — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Payment not completed</h1>
<div class="hp-empty">The payment was not completed. Your card was not charged by this site unless the payment provider confirms otherwise.</div>
<a class="hp-btn hp-btn--primary" href="{{ route('checkout.show') }}">Try checkout again</a>
</div>
</section>
@endsection
