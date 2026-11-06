@extends('layouts.app')
@section('title', 'Area of Consultation — '.$settings->brandName())
@section('meta_description', 'Browse our doctors by consultation area and book an online or clinic consult with '.$settings->brandName().'.')

@section('content')
<section class="hp-page">
<div class="hp-container">
<nav class="hp-breadcrumb" aria-label="Breadcrumb">
    <a href="{{ route('home') }}">Home</a> /
    <a href="{{ route('conditions.index') }}">Conditions</a> /
    <span>Area of Consultation</span>
</nav>
<h1>Area of Consultation</h1>
<p class="hp-section__lead">Meet our verified homeopathic doctors and book a consultation. Filter by specialization, language, or mode. Doctor profiles and photos are managed in Admin → Doctors.</p>

<form method="get" class="hp-filters" action="{{ route('area-of-consultation') }}">
<input class="hp-input" type="search" name="specialization" value="{{ $specialization }}" placeholder="Specialization / area">
<input class="hp-input" type="search" name="language" value="{{ $language }}" placeholder="Language">
<select class="hp-input" name="mode">
<option value="">Any mode</option>
<option value="online" @selected($mode==='online')>Online</option>
<option value="clinic" @selected($mode==='clinic')>Clinic</option>
</select>
<button class="hp-btn hp-btn--primary" type="submit">Filter</button>
<a class="hp-btn hp-btn--secondary" href="{{ route('area-of-consultation') }}">Clear</a>
</form>

@if ($doctors->isEmpty())
<div class="hp-empty">No practitioner profiles are available yet. Publish verified doctors in Admin → Doctors.</div>
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
@if (!empty($doctor->specializations))
<p class="hp-product-card__meta">{{ implode(' · ', array_slice($doctor->specializations ?? [], 0, 3)) }}</p>
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
