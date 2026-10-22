@extends('layouts.app')

@section('title', 'Find a doctor — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <div class="hp-page__intro">
            <h1>Find a doctor</h1>
            <p class="hp-section__lead">Verified practitioner profiles. Book a {{ $settings->consultationFeeDisplay() }} Google Meet session — our team schedules the call after you request.</p>
        </div>

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
            <div class="hp-doctor-grid">
                @foreach ($doctors as $doctor)
                    <article class="hp-doctor-card">
                        <a href="{{ route('doctors.show', $doctor->slug) }}" style="text-decoration:none;color:inherit;display:contents;">
                            <div class="hp-doctor-card__photo">
                                @if ($doctor->photo)
                                    <img src="{{ $doctor->photo->publicUrl() }}" alt="{{ $doctor->photo->alt_text ?: $doctor->full_name }}">
                                @else
                                    <span aria-hidden="true">{{ collect(explode(' ', $doctor->full_name))->map(fn ($p) => mb_substr($p, 0, 1))->take(2)->implode('') }}</span>
                                @endif
                            </div>
                            <h3>{{ $doctor->full_name }}</h3>
                            <p class="hp-muted">{{ $doctor->designation }} @if($doctor->years_experience)· {{ $doctor->years_experience }}+ yrs @endif</p>
                            @if ($doctor->locality || $doctor->city)
                                <p class="hp-muted">{{ collect([$doctor->locality, $doctor->city])->filter()->implode(', ') }}</p>
                            @endif
                        </a>
                        <ul class="hp-doctor-meta">
                            @if ($doctor->formattedFee())
                                <li><strong>Session</strong> {{ $doctor->formattedFee() }}</li>
                            @endif
                        </ul>
                        <div class="hp-doctor-card__actions">
                            <a class="hp-btn hp-btn--primary" href="{{ route('consultations.create', $doctor->slug) }}">Book session</a>
                            <a class="hp-text-link" href="{{ route('doctors.show', $doctor->slug) }}">Profile</a>
                        </div>
                    </article>
                @endforeach
            </div>
            <div style="margin-top:1.75rem;">{{ $doctors->links() }}</div>
        @endif
    </div>
</section>
@endsection
