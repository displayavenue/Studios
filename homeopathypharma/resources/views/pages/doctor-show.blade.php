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
                    <div class="hp-doctor-card__photo" style="min-height:16rem;border-radius:var(--hp-radius-lg);font-size:2.5rem;">{{ collect(explode(' ', $doctor->full_name))->map(fn ($p) => mb_substr($p, 0, 1))->take(2)->implode('') }}</div>
                @endif
            </div>
            <div>
                <h1>{{ $doctor->full_name }}</h1>
                <p class="hp-muted">{{ $doctor->designation }} @if($doctor->years_experience)· {{ $doctor->years_experience }}+ years @endif</p>
                <p class="hp-product-card__price">{{ $doctor->formattedFee() ?: $settings->consultationFeeDisplay() }} / session</p>
                @if ($doctor->expertise_summary)<p>{{ $doctor->expertise_summary }}</p>@endif
                @if ($doctor->specializations)<p><strong>Expertise:</strong> {{ implode(' · ', $doctor->specializations) }}</p>@endif
                @if ($doctor->registration_number)<p><strong>Registration no.:</strong> {{ $doctor->registration_number }}</p>@endif
                <p><strong>Location:</strong> {{ trim(($doctor->locality ? $doctor->locality.', ' : '').($doctor->city ?: '—')) }}</p>
                @if ($doctor->languages)<p><strong>Languages:</strong> {{ implode(', ', $doctor->languages) }}</p>@endif
                <p><strong>Consultation:</strong> Google Meet — our team schedules the call after you book.</p>
                @if ($doctor->bio)<p style="white-space:pre-line;">{{ $doctor->bio }}</p>@endif
                @if ($doctor->credentials->isNotEmpty())
                    <h2 class="hp-subhead">Verified credentials</h2>
                    <ul>
                        @foreach ($doctor->credentials as $cred)
                            <li>{{ $cred->credential_type }}@if($cred->credential_number) ({{ $cred->credential_number }})@endif @if($cred->issuing_body) — {{ $cred->issuing_body }}@endif</li>
                        @endforeach
                    </ul>
                @endif
                <p class="hp-btn-row" style="margin-top:1.5rem;">
                    <a class="hp-btn hp-btn--primary" href="{{ route('consultations.create', $doctor->slug) }}">Book {{ $doctor->formattedFee() ?: $settings->consultationFeeDisplay() }} session</a>
                </p>
            </div>
        </div>

        @if (! ($doctor->team_schedules_meet ?? true))
            <h2 class="hp-subhead">Open calendar slots</h2>
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
                <div class="hp-empty">No open slots for this date/mode.</div>
            @else
                <div class="hp-btn-row" style="flex-wrap:wrap;">
                    @foreach ($slots as $slot)
                        <a class="hp-btn hp-btn--primary" href="{{ route('appointments.create', ['slug' => $doctor->slug, 'starts_at' => $slot['starts_at'], 'mode' => $mode]) }}">{{ $slot['label'] }}</a>
                    @endforeach
                </div>
            @endif
        @endif
    </div>
</section>
@endsection
