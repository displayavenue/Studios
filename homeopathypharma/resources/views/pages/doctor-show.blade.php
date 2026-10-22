@extends('layouts.app')
@section('title', $doctor->full_name.' — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<nav class="hp-breadcrumb"><a href="{{ route('doctors.index') }}">Doctors</a> / <span>{{ $doctor->full_name }}</span></nav>
<div class="hp-product-detail">
<div>
@if ($doctor->photo)
<img class="hp-product-detail__image" src="{{ $doctor->photo->publicUrl() }}" alt="{{ $doctor->photo->alt_text ?: $doctor->full_name }}">
@else
<div class="hp-product-card__placeholder" style="min-height:16rem;border-radius:0.75rem;"></div>
@endif
</div>
<div>
<h1>{{ $doctor->full_name }}</h1>
<p class="hp-muted">{{ $doctor->designation }} @if($doctor->years_experience)· {{ $doctor->years_experience }}+ years @endif</p>
@if ($doctor->formattedFee())<p class="hp-product-card__price">{{ $doctor->formattedFee() }}</p>@endif
@if ($doctor->specializations)<p>Focus: {{ implode(' · ', $doctor->specializations) }}</p>@endif
@if ($doctor->languages)<p>Languages: {{ implode(', ', $doctor->languages) }}</p>@endif
@if ($doctor->consultation_modes)<p>Modes: {{ implode(', ', $doctor->consultation_modes) }}</p>@endif
@if ($doctor->bio)<p>{{ $doctor->bio }}</p>@endif
@if ($doctor->credentials->isNotEmpty())
<h2>Verified credentials</h2>
<ul>
@foreach ($doctor->credentials as $cred)
<li>{{ $cred->credential_type }}@if($cred->issuing_body) — {{ $cred->issuing_body }}@endif</li>
@endforeach
</ul>
@endif
</div>
</div>

<h2>Book a consultation</h2>
<form method="get" class="hp-filters" action="{{ route('doctors.show', $doctor->slug) }}">
<label class="hp-label">Date <input class="hp-input" type="date" name="date" value="{{ $date }}"></label>
<label class="hp-label">Mode
<select class="hp-input" name="mode">
@foreach (($doctor->consultation_modes ?: ['online']) as $m)
<option value="{{ $m }}" @selected($mode===$m)>{{ ucfirst($m) }}</option>
@endforeach
</select>
</label>
<button class="hp-btn hp-btn--secondary" type="submit">Show slots</button>
</form>

@if (empty($slots))
<div class="hp-empty">No open slots for this date/mode. Availability is managed by the administrator.</div>
@else
<div class="hp-btn-row" style="flex-wrap:wrap;">
@foreach ($slots as $slot)
<a class="hp-btn hp-btn--primary" href="{{ route('appointments.create', ['slug' => $doctor->slug, 'starts_at' => $slot['starts_at'], 'mode' => $mode]) }}">{{ $slot['label'] }}</a>
@endforeach
</div>
@endif
</div>
</section>
@endsection
