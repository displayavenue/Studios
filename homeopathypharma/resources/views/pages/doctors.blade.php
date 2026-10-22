@extends('layouts.app')
@section('title', 'Find a doctor — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Find a doctor</h1>
<p class="hp-section__lead">Only verified and published practitioner profiles are listed. No profiles are invented.</p>

<form method="get" class="hp-filters" action="{{ route('doctors.index') }}">
<input class="hp-input" type="search" name="specialization" value="{{ $specialization }}" placeholder="Specialization">
<input class="hp-input" type="search" name="language" value="{{ $language }}" placeholder="Language">
<select class="hp-input" name="mode">
<option value="">Any mode</option>
<option value="online" @selected($mode==='online')>Online</option>
<option value="clinic" @selected($mode==='clinic')>Clinic</option>
</select>
<button class="hp-btn hp-btn--primary" type="submit">Filter</button>
<a class="hp-btn hp-btn--secondary" href="{{ route('doctors.index') }}">Clear</a>
</form>

@if ($doctors->isEmpty())
<div class="hp-empty">No practitioner profiles are available. Doctors must be verified and published by an administrator.</div>
@else
<div class="hp-product-grid">
@foreach ($doctors as $doctor)
<article class="hp-product-card">
<a href="{{ route('doctors.show', $doctor->slug) }}">
@if ($doctor->photo)
<img src="{{ $doctor->photo->publicUrl() }}" alt="{{ $doctor->photo->alt_text ?: $doctor->full_name }}">
@else
<div class="hp-product-card__placeholder" aria-hidden="true"></div>
@endif
<h3>{{ $doctor->full_name }}</h3>
<p class="hp-product-card__meta">{{ $doctor->designation }} @if($doctor->years_experience)· {{ $doctor->years_experience }}+ yrs @endif</p>
@if ($doctor->locality || $doctor->city)
<p class="hp-product-card__meta">{{ collect([$doctor->locality, $doctor->city])->filter()->implode(', ') }}</p>
@endif
@if ($doctor->formattedFee())
<p class="hp-product-card__price">{{ $doctor->formattedFee() }}</p>
@endif
</a>
</article>
@endforeach
</div>
<div style="margin-top:1.5rem;">{{ $doctors->links() }}</div>
@endif
</div>
</section>
@endsection
