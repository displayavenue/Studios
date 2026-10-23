@extends('layouts.app')
@section('title', 'Book consultation — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Book with {{ $doctor->full_name }}</h1>
<p class="hp-section__lead">Selected time: {{ $startsAt ? \Carbon\Carbon::parse($startsAt)->timezone('Asia/Kolkata')->format('D, d M Y h:i A') : 'not selected' }} (Asia/Kolkata)</p>
@if (!$startsAt)
<div class="hp-empty">Please choose a slot from the doctor profile first.</div>
@else
<form method="post" action="{{ route('appointments.store', $doctor->slug) }}" class="hp-form">
@csrf
<input type="hidden" name="starts_at" value="{{ $startsAt }}">
<input type="hidden" name="consultation_mode" value="{{ $mode }}">
<label class="hp-label">Patient name <input class="hp-input" name="patient_name" value="{{ old('patient_name', auth()->user()?->name) }}" required></label>
<label class="hp-label">Phone <input class="hp-input" name="patient_phone" value="{{ old('patient_phone', auth()->user()?->phone) }}" required></label>
<label class="hp-label">Email (optional) <input class="hp-input" type="email" name="patient_email" value="{{ old('patient_email', auth()->user()?->email) }}"></label>
<label class="hp-label">Notes <textarea class="hp-textarea" name="notes">{{ old('notes') }}</textarea></label>
<label class="hp-check"><input type="checkbox" name="terms" value="1" required> I accept the consultation terms and understand this is not an emergency service. Please avoid sharing unnecessary medical details here.</label>
@foreach ($errors->all() as $error)<p class="hp-error">{{ $error }}</p>@endforeach
<button class="hp-btn hp-btn--primary" type="submit">Confirm appointment</button>
</form>
@endif
</div>
</section>
@endsection
