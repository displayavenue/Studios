@extends('layouts.app')
@section('title', 'Request '.$consultation->number.' — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:36rem;">
<h1>Request received</h1>
@if(session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<p>Reference <strong>{{ $consultation->number }}</strong> for <strong>{{ $consultation->doctor->full_name }}</strong>.</p>
<p>Fee: {{ $consultation->formattedFee() }}. Our team will contact you on <strong>{{ $consultation->patient_phone }}</strong> to schedule the Google Meet consultation.</p>
<p class="hp-muted">Meeting links are shared by the team after scheduling — they are not shown on this page automatically.</p>
<p><a href="{{ route('home') }}">Back to home</a> · <a href="tel:{{ $settings->phoneTel() }}">{{ $settings->phoneDisplay() }}</a></p>
</div>
</section>
@endsection
