@extends('layouts.app')
@section('title', 'Request '.$consultation->number.' — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:36rem;">
<h1>{{ $consultation->isPaid() ? 'Booking confirmed' : 'Request received' }}</h1>
@if(session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<p>Reference <strong>{{ $consultation->number }}</strong>@if($consultation->doctor) for <strong>{{ $consultation->doctor->full_name }}</strong>@endif.</p>
@if($consultation->preferred_window)
<p>Preferred slot: <strong>{{ $consultation->preferred_window }}</strong></p>
@endif
<p>Fee: {{ $consultation->formattedFee() }}
@if($consultation->isPaid())
 — <strong>paid</strong>{{ $consultation->paid_at ? ' on '.$consultation->paid_at->timezone('Asia/Kolkata')->format('d M Y, g:i A') : '' }}.
@else
 — <strong>unpaid</strong>.
 @if(! $consultation->preferred_window)
 <a href="{{ route('consultations.schedule', $consultation) }}">Choose slot</a> ·
 @endif
 <a href="{{ route('consultations.pay', $consultation) }}">Pay consultation fee</a>
@endif
</p>
<p>Our team will contact you on <strong>{{ $consultation->patient_phone }}</strong> to schedule the Google Meet consultation.</p>
<p class="hp-muted">Meeting links are shared by the team after scheduling — they are not shown on this page automatically.</p>
<p><a href="{{ route('home') }}">Back to home</a> · <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></p>
</div>
</section>
@endsection
