@extends('layouts.admin')
@section('title', 'Orders')
@section('content')
<div class="admin-top"><h2>Orders</h2></div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;">
<select name="payment_status" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
<option value="">All payment statuses</option>
@foreach (['pending','paid','failed','refunded'] as $s)
<option value="{{ $s }}" @selected($status===$s)>{{ $s }}</option>
@endforeach
</select>
<button class="btn btn-secondary" type="submit">Filter</button>
</form>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Number</th><th>Customer</th><th>Total</th><th>Payment</th><th>Fulfilment</th><th></th></tr></thead>
<tbody>
@forelse ($orders as $order)
<tr>
<td>{{ $order->number }}</td>
<td>{{ $order->customer_name }}</td>
<td>{{ $order->formattedTotal() }}</td>
<td><span class="badge">{{ $order->payment_status }}</span></td>
<td>{{ $order->fulfilment_status }}</td>
<td><a href="{{ route('admin.orders.show', $order) }}">View</a></td>
</tr>
@empty
<tr><td colspan="6">No orders yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $orders->links() }}
@endsection
