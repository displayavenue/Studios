@extends('layouts.app')
@section('title', 'Appointment '.$appointment->reference)
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Appointment confirmed</h1>
@if (session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<p><strong>Reference:</strong> {{ $appointment->reference }}</p>
<p><strong>Practitioner:</strong> {{ $appointment->doctor->full_name }}</p>
<p><strong>When:</strong> {{ $appointment->starts_at->timezone('Asia/Kolkata')->format('D, d M Y h:i A') }} ({{ $appointment->timezone }})</p>
<p><strong>Mode:</strong> {{ $appointment->consultation_mode }}</p>
<p><strong>Status:</strong> {{ $appointment->status }}</p>
@if ($appointment->meeting_url)
<p><a class="hp-btn hp-btn--primary" href="{{ $appointment->meeting_url }}">Join meeting</a></p>
@elseif ($videoNotice)
<div class="hp-empty">{{ $videoNotice }}</div>
@endif
@auth
<p><a href="{{ route('account.appointments') }}">View your appointments</a></p>
@endauth
</div>
</section>
@endsection
