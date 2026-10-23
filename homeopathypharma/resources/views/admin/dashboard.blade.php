@extends('layouts.admin')
@section('title', 'Overview')
@section('content')
<div class="admin-top"><h2>Overview</h2></div>
<div class="admin-metrics">
    <div class="admin-card admin-metric"><strong>{{ $metrics['products_published'] }}</strong><span>Published products</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['products_draft'] }}</strong><span>Draft products</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['categories'] }}</strong><span>Categories</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['brands'] }}</strong><span>Brands</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['media'] }}</strong><span>Media assets</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['team_published'] }}</strong><span>Published team</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['low_stock'] }}</strong><span>Low stock (≤5)</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['orders_total'] }}</strong><span>Total orders</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['orders_pending'] }}</strong><span>Pending payment</span></div>
    <div class="admin-card admin-metric"><strong>{{ $metrics['orders_paid'] }}</strong><span>Paid orders</span></div>
    <div class="admin-card admin-metric"><strong>₹{{ number_format(($metrics['revenue_paid_paise'] ?? 0)/100, 2) }}</strong><span>Revenue (verified paid)</span></div>
</div>
<p style="margin-top:1.25rem;color:#68746D;">Counts are live from the database. Revenue includes only server-verified paid orders.</p>
@endsection
