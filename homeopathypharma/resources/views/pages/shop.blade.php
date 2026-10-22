@extends('layouts.app')

@section('title', 'Shop — '.$settings->brandName())

@section('content')
<section class="hp-page">
    <div class="hp-container">
        <h1>Shop</h1>
        <p class="hp-section__lead">Published products will appear here from the catalogue database.</p>
        <div class="hp-empty">No products are published yet. Product management arrives in Phase 2.</div>
    </div>
</section>
@endsection
