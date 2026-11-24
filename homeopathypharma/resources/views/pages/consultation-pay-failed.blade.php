@extends('layouts.app')
@section('title', 'Payment failed — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:36rem;">
<h1>Payment not completed</h1>
<p>We could not verify payment for consultation <strong>{{ $consultation->number }}</strong>{{ $consultation->doctor ? ' with '.$consultation->doctor->full_name : '' }}.</p>
<p>Fee still due: <strong>{{ $consultation->formattedFee() }}</strong>.</p>
<p class="hp-btn-row" style="flex-wrap:wrap;margin-top:1rem;">
<a class="hp-btn hp-btn--primary" href="{{ route('consultations.pay', $consultation) }}">Try again</a>
<a class="hp-btn hp-btn--secondary" href="tel:{{ $settings->phoneTel() }}">Call {{ $settings->phoneDisplay() }}</a>
</p>
</div>
</section>
@endsection
