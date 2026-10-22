@extends('layouts.admin')
@section('title', 'Reports')
@section('content')
<div class="admin-top"><h2>Operations snapshot</h2></div>
<div class="admin-card">
<ul style="margin:0;padding-left:1.2rem;line-height:1.8;">
<li><strong>Paid revenue:</strong> ₹{{ number_format($paidRevenuePaise / 100, 2) }}</li>
<li><strong>Paid orders:</strong> {{ $paidOrders }}</li>
<li><strong>Pending payment orders:</strong> {{ $pendingOrders }}</li>
<li><strong>Upcoming appointments:</strong> {{ $upcomingAppointments }}</li>
<li><strong>Low stock products (≤5):</strong> {{ $lowStock }}</li>
</ul>
</div>
@endsection
