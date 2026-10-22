@extends('layouts.app')
@section('title', 'Book '.$doctor->full_name.' — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:36rem;">
<p class="hp-breadcrumb"><a href="{{ route('home') }}">Home</a> · <a href="{{ route('doctors.show', $doctor->slug) }}">{{ $doctor->full_name }}</a></p>
<h1>Book a session</h1>
<p class="hp-section__lead">{{ $feeDisplay }} · Google Meet. Submit this form and our team will schedule the call with {{ $doctor->full_name }}.</p>
<ul class="hp-doctor-meta" style="margin-bottom:1.25rem;">
<li><strong>Doctor</strong> {{ $doctor->full_name }} ({{ $doctor->designation ?: 'BHMS' }})</li>
@if($doctor->registration_number)<li><strong>Reg. no.</strong> {{ $doctor->registration_number }}</li>@endif
<li><strong>Expertise</strong> {{ $doctor->expertise_summary ?: implode(', ', $doctor->specializations ?? []) }}</li>
<li><strong>Location</strong> {{ trim(($doctor->locality ? $doctor->locality.', ' : '').($doctor->city ?: '')) }}</li>
</ul>
<form method="post" action="{{ route('consultations.store', $doctor->slug) }}" class="hp-form">
@csrf
<label class="hp-label">Your name <input class="hp-input" name="patient_name" value="{{ old('patient_name') }}" required></label>
<label class="hp-label">Phone <input class="hp-input" name="patient_phone" value="{{ old('patient_phone') }}" required></label>
<label class="hp-label">Email (optional) <input class="hp-input" type="email" name="patient_email" value="{{ old('patient_email') }}"></label>
<label class="hp-label">Preferred time window <input class="hp-input" name="preferred_window" value="{{ old('preferred_window') }}" placeholder="e.g. Weekday evenings"></label>
<label class="hp-label">Concern (optional) <textarea class="hp-textarea" name="concern">{{ old('concern') }}</textarea></label>
<label class="hp-check"><input type="checkbox" name="terms" value="1" required> I understand this is a consultation request. The team will confirm a Google Meet slot. This is not emergency care.</label>
<button class="hp-btn hp-btn--primary" type="submit">Request {{ $feeDisplay }} session</button>
</form>
</div>
</section>
@endsection
