@extends('layouts.app')

@section('title', 'Find a doctor — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Find a doctor</h1>
        <p class="hp-section__lead">Only approved practitioner profiles will be listed here. None are published yet.</p>
        <div class="hp-empty">No practitioner profiles are available. Doctors must be verified and published by an administrator.</div>
    </div>
</section>
@endsection
