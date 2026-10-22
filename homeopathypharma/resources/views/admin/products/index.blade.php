@extends('layouts.admin')
@section('title', 'Products')
@section('content')
<div class="admin-top">
    <h2>Products</h2>
    <a class="btn btn-primary" href="{{ route('admin.products.create') }}">Add product</a>
</div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;">
    <input type="search" name="q" value="{{ $q }}" placeholder="Search name or SKU" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
    <select name="status" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
        <option value="">All statuses</option>
        @foreach (['draft','published','archived'] as $s)
            <option value="{{ $s }}" @selected($status === $s)>{{ ucfirst($s) }}</option>
        @endforeach
    </select>
    <button class="btn btn-secondary" type="submit">Filter</button>
</form>
<div class="admin-card">
<table class="admin-table">
    <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
    <tbody>
    @forelse ($products as $product)
        <tr>
            <td>{{ $product->name }} @if($product->is_featured)<span class="badge">Featured</span>@endif</td>
            <td>{{ $product->sku ?: '—' }}</td>
            <td>{{ $product->formattedPrice() }}</td>
            <td>{{ $product->stock_qty }}</td>
            <td><span class="badge">{{ $product->status }}</span></td>
            <td class="admin-actions">
                <a href="{{ route('admin.products.edit', $product) }}">Edit</a>
                <form method="post" action="{{ route('admin.products.destroy', $product) }}" onsubmit="return confirm('Delete this product?');">
                    @csrf @method('DELETE')
                    <button class="btn btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr><td colspan="6">No products yet. Create one to publish on the shop.</td></tr>
    @endforelse
    </tbody>
</table>
</div>
<div style="margin-top:1rem;">{{ $products->links() }}</div>
@endsection
