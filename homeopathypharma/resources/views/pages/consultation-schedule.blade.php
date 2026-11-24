@extends('layouts.app')
@section('title', 'Choose consultation slot — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container" style="max-width:40rem;">
<p class="hp-breadcrumb"><a href="{{ route('home') }}">Home</a> · Choose slot</p>
<h1>Choose your preferred slot</h1>
@if(session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<p class="hp-section__lead">Pick any day from today through {{ $days[count($days)-1]['label'] }} (7 days ahead). Fee: <strong>{{ $feeDisplay }}</strong>.</p>

<div class="hp-form" style="margin:1rem 0 1.25rem;">
<p><strong>Reference</strong> {{ $consultation->number }}</p>
@if($consultation->doctor)
<p><strong>Doctor</strong> {{ $consultation->doctor->full_name }}</p>
@endif
<p><strong>Patient</strong> {{ $consultation->patient_name }} · {{ $consultation->patient_phone }}</p>
</div>

<form method="post" action="{{ route('consultations.schedule.save', $consultation) }}" class="hp-form hp-consult-schedule">
@csrf

<p class="hp-consult-schedule__label">Day</p>
@error('preferred_date')<p class="hp-status" role="alert">{{ $message }}</p>@enderror
<div class="hp-consult-schedule__days" role="radiogroup" aria-label="Preferred day">
@foreach($days as $day)
<label class="hp-consult-schedule__day">
<input type="radio" name="preferred_date" value="{{ $day['value'] }}" @checked(old('preferred_date') === $day['value']) required>
<span class="hp-consult-schedule__day-card">
<span class="hp-consult-schedule__weekday">{{ $day['weekday'] }}</span>
<span class="hp-consult-schedule__date">{{ $day['day'] }}</span>
<span class="hp-consult-schedule__month">{{ $day['month'] }}</span>
</span>
</label>
@endforeach
</div>

<p class="hp-consult-schedule__label" style="margin-top:1.25rem;">Time <span class="hp-muted">(IST)</span></p>
@error('preferred_time')<p class="hp-status" role="alert">{{ $message }}</p>@enderror
<div class="hp-consult-schedule__times" role="radiogroup" aria-label="Preferred time">
@foreach($timeSlots as $slot)
@php($label = \Carbon\Carbon::createFromFormat('H:i', $slot, 'Asia/Kolkata')->format('g:i A'))
<label class="hp-consult-schedule__time">
<input type="radio" name="preferred_time" value="{{ $slot }}" @checked(old('preferred_time') === $slot) required>
<span>{{ $label }}</span>
</label>
@endforeach
</div>

<button class="hp-btn hp-btn--primary" type="submit" style="margin-top:1.5rem;width:100%;">Continue to payment</button>
</form>
</div>
</section>

<style>
.hp-consult-schedule__label{font-weight:600;margin:0 0 .65rem;color:var(--hp-ink,#1a2e1a);}
.hp-consult-schedule__days{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.55rem;}
@media (min-width:640px){.hp-consult-schedule__days{grid-template-columns:repeat(8,minmax(0,1fr));}}
.hp-consult-schedule__day{margin:0;cursor:pointer;}
.hp-consult-schedule__day input{position:absolute;opacity:0;pointer-events:none;}
.hp-consult-schedule__day-card{display:flex;flex-direction:column;align-items:center;gap:.15rem;padding:.65rem .35rem;border:1.5px solid rgba(26,58,42,.18);border-radius:.75rem;background:#fff;transition:border-color .15s,background .15s,color .15s;}
.hp-consult-schedule__weekday{font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;color:#5a6b5a;}
.hp-consult-schedule__date{font-size:1.15rem;font-weight:700;line-height:1;color:var(--hp-forest,#1a3a2a);}
.hp-consult-schedule__month{font-size:.72rem;color:#5a6b5a;}
.hp-consult-schedule__day input:checked + .hp-consult-schedule__day-card{border-color:var(--hp-forest,#1a3a2a);background:var(--hp-forest,#1a3a2a);color:#fff;}
.hp-consult-schedule__day input:checked + .hp-consult-schedule__day-card .hp-consult-schedule__weekday,
.hp-consult-schedule__day input:checked + .hp-consult-schedule__day-card .hp-consult-schedule__month,
.hp-consult-schedule__day input:checked + .hp-consult-schedule__day-card .hp-consult-schedule__date{color:#fff;}
.hp-consult-schedule__day input:focus-visible + .hp-consult-schedule__day-card{outline:2px solid var(--hp-forest,#1a3a2a);outline-offset:2px;}
.hp-consult-schedule__times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;}
@media (min-width:560px){.hp-consult-schedule__times{grid-template-columns:repeat(5,minmax(0,1fr));}}
.hp-consult-schedule__time{margin:0;cursor:pointer;}
.hp-consult-schedule__time input{position:absolute;opacity:0;pointer-events:none;}
.hp-consult-schedule__time span{display:block;text-align:center;padding:.7rem .4rem;border:1.5px solid rgba(26,58,42,.18);border-radius:.75rem;background:#fff;font-weight:600;font-size:.92rem;color:var(--hp-forest,#1a3a2a);transition:border-color .15s,background .15s,color .15s;}
.hp-consult-schedule__time input:checked + span{border-color:var(--hp-forest,#1a3a2a);background:var(--hp-forest,#1a3a2a);color:#fff;}
.hp-consult-schedule__time input:focus-visible + span{outline:2px solid var(--hp-forest,#1a3a2a);outline-offset:2px;}
</style>
@endsection
