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
    <div class="admin-card admin-metric"><strong>{{ $metrics['leads_new'] ?? 0 }}</strong><span>New leads</span></div>
</div>
<p style="margin-top:1.25rem;color:#68746D;">Counts are live from the database. Revenue includes only server-verified paid orders.</p>

<div class="admin-card" style="margin-top:1.25rem;">
    <h3 style="margin-top:0;">Talk to a Doctor leads</h3>
    <p class="admin-muted" style="margin:0 0 0.75rem;">New form submissions land in the Leads inbox instantly. Set a notify email under Site Settings for email alerts.</p>
    <a class="btn btn-primary" href="{{ route('admin.leads.index') }}">Open leads</a>
</div>

<div class="admin-card" style="margin-top:1.25rem;">
    <h3 style="margin-top:0;">Homepage chats</h3>
    <p class="admin-muted" style="margin:0 0 0.75rem;">When someone uses the chat icon, their name, number, and message appear here so you know who asked what.</p>
    <a class="btn btn-primary" href="{{ route('admin.leads.index', ['source' => 'chat', 'status' => 'all']) }}">Open chats</a>
</div>

<div class="admin-card" style="margin-top:1.25rem;">
    <h3 style="margin-top:0;">After you make changes</h3>
    <p class="admin-muted" style="margin:0 0 0.75rem;">Clear caches and visitor cookies so the live site shows your latest updates.</p>
    <a class="btn btn-primary" href="{{ route('admin.cache.index') }}">Clear cache &amp; cookies</a>
</div>
@endsection
