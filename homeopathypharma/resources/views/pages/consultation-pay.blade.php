@extends('layouts.app')
@section('title', 'Pay consultation fee — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:36rem;">
<p class="hp-breadcrumb"><a href="{{ route('home') }}">Home</a> · Pay consultation</p>
<h1>Pay consultation fee</h1>
@if(session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
@if(!empty($error))<div class="hp-status" role="alert">{{ $error }}</div>@endif

<div class="hp-form" style="margin:1.25rem 0;">
<p><strong>Reference</strong> {{ $consultation->number }}</p>
<p><strong>Doctor</strong> {{ $consultation->doctor?->full_name ?: '—' }}</p>
<p><strong>Patient</strong> {{ $consultation->patient_name }} · {{ $consultation->patient_phone }}</p>
<p><strong>Fee due</strong> <span style="font-size:1.35rem;font-weight:700;">{{ $consultation->formattedFee() }}</span></p>
</div>

@if($offline)
<p>Online payment is not enabled yet. Please pay the consultation fee by calling or messaging us, and quote reference <strong>{{ $consultation->number }}</strong>.</p>
<p class="hp-btn-row" style="flex-wrap:wrap;margin-top:1rem;">
<a class="hp-btn hp-btn--primary" href="tel:{{ $settings->phoneTel() }}">Call {{ $settings->phoneDisplay() }}</a>
@if($settings->whatsappUrl())
<a class="hp-btn hp-btn--secondary" href="{{ $settings->whatsappUrl() }}" target="_blank" rel="noopener">WhatsApp</a>
@endif
</p>
<p class="hp-muted" style="margin-top:1rem;">You can return to this page later: keep your reference number handy.</p>
@elseif($gateway === 'test')
<div class="hp-status">Test payment mode — no real charge. Confirm below to mark the fee paid.</div>
<form method="post" action="{{ route('consultations.confirm-test', $consultation) }}">
@csrf
<button class="hp-btn hp-btn--primary" type="submit">Pay {{ $consultation->formattedFee() }} (test)</button>
</form>
@else
<div class="hp-status">Razorpay session ready ({{ $payment->provider_order_id }}). Complete checkout with your Razorpay key when live.</div>
<p class="hp-btn-row" style="flex-wrap:wrap;margin-top:1rem;">
<a class="hp-btn hp-btn--secondary" href="{{ route('consultations.failed', $consultation) }}">Payment failed</a>
</p>
@endif

<p style="margin-top:1.5rem;"><a href="{{ route('consultations.confirmation', $consultation) }}">Skip for now</a> · <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></p>
</div>
</section>
@endsection
