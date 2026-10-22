@extends('layouts.app')
@php($settings = app(\App\Services\SiteSettings::class))
@section('title', 'Appointments — '.$settings->brandName())
@section('content')
<section class="hp-page"><div class="hp-container">
<h1>Your appointments</h1>
@forelse ($appointments as $appointment)
<p>
<strong>{{ $appointment->reference }}</strong> —
{{ $appointment->doctor?->full_name }} —
{{ $appointment->starts_at->timezone('Asia/Kolkata')->format('d M Y h:i A') }} —
{{ $appointment->status }}
</p>
@empty
<div class="hp-empty">No appointments yet.</div>
@endforelse
{{ $appointments->links() }}
</div></section>
@endsection
