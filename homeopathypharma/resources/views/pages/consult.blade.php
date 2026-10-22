@extends('layouts.app')
@section('title', 'Consult a doctor — '.$settings->brandName())
@section('content')
<section class="hp-page">
<div class="hp-container">
<h1>Consult a doctor</h1>
<p class="hp-section__lead">Browse verified practitioner profiles and request a consultation when availability is published. Outcomes are not guaranteed.</p>
<a class="hp-btn hp-btn--primary" href="{{ route('doctors.index') }}">Find a Doctor</a>
</div>
</section>
@endsection
