@extends('layouts.admin')
@section('title', 'Products')
@section('content')
<div class="admin-top">
    <h2>Products</h2>
    <a class="btn btn-primary" href="{{ route('admin.products.create') }}">Add product</a>
</div>
<form method="get" class="admin-actions" style="margin-bottom:1rem;flex-wrap:wrap;">
    <input type="search" name="q" value="{{ $q }}" placeholder="Search name or SKU" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;min-width:14rem;">
    <select name="brand" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
        <option value="">All brands</option>
        @foreach ($brands as $brand)
            <option value="{{ $brand->slug }}" @selected($brandSlug === $brand->slug)>{{ $brand->name }}</option>
        @endforeach
    </select>
    <select name="status" style="padding:0.55rem 0.75rem;border:1px solid #E3E8E1;border-radius:0.5rem;">
        <option value="">All statuses</option>
        @foreach (['draft','published','archived'] as $s)
            <option value="{{ $s }}" @selected($status === $s)>{{ ucfirst($s) }}</option>
        @endforeach
    </select>
    <button class="btn btn-secondary" type="submit">Filter</button>
</form>
@if (session('status'))
    <div class="admin-card" style="margin-bottom:1rem;border-color:#b7d7c4;background:#f3faf5;">{{ session('status') }}</div>
@endif
<p class="admin-muted" style="margin:0 0 0.85rem;">One-click homepage placement: <strong>Popular</strong> and <strong>Super Saving</strong> appear under each other on the storefront.</p>
<div class="admin-card">
<table class="admin-table admin-product-table">
    <thead>
        <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Market</th>
            <th>Sale</th>
            <th>Discount</th>
            <th>Homepage</th>
            <th>Stock</th>
            <th>Status</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    @forelse ($products as $product)
        @php($image = $product->primaryImage())
        <tr>
            <td>
                @if ($image)
                    <img class="admin-product-table__thumb" src="{{ $image->publicUrl() }}" alt="">
                @else
                    <span class="admin-product-table__thumb admin-product-table__thumb--empty"></span>
                @endif
            </td>
            <td>
                <strong>{{ $product->name }}</strong>
                <div class="admin-muted" style="font-size:0.78rem;">{{ $product->sku ?: 'No SKU' }}</div>
            </td>
            <td>{{ $product->brand?->name ?: '—' }}</td>
            <td>{{ $product->formattedMarketPrice() }}</td>
            <td>{{ $product->sale_price_paise ? '₹'.number_format($product->sale_price_paise / 100, 2) : '—' }}</td>
            <td>
                @if ($product->discountPercent() > 0)
                    <span class="badge">{{ $product->discountPercent() }}% OFF</span>
                @else
                    —
                @endif
            </td>
            <td>
                <div class="admin-product-toggles">
                    <form method="post" action="{{ route('admin.products.toggle-popular', $product) }}">
                        @csrf
                        <button
                            class="btn admin-toggle-btn {{ $product->is_featured ? 'admin-toggle-btn--on' : '' }}"
                            type="submit"
                            title="{{ $product->is_featured ? 'Remove from Popular' : 'Add to Popular' }}"
                        >{{ $product->is_featured ? 'Popular ✓' : 'Popular' }}</button>
                    </form>
                    <form method="post" action="{{ route('admin.products.toggle-super-saving', $product) }}">
                        @csrf
                        <button
                            class="btn admin-toggle-btn {{ $product->is_super_saving ? 'admin-toggle-btn--deal' : '' }}"
                            type="submit"
                            title="{{ $product->is_super_saving ? 'Remove from Super Saving' : 'Add to Super Saving' }}"
                        >{{ $product->is_super_saving ? 'Super Saving ✓' : 'Super Saving' }}</button>
                    </form>
                </div>
            </td>
            <td>{{ $product->stock_qty }}</td>
            <td><span class="badge">{{ $product->status }}</span></td>
            <td class="admin-actions">
                <a href="{{ route('admin.products.edit', $product) }}">Edit / adjust image</a>
                <form method="post" action="{{ route('admin.products.destroy', $product) }}" onsubmit="return confirm('Delete this product?');">
                    @csrf @method('DELETE')
                    <button class="btn btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr><td colspan="10">No products yet. Create one to publish on the shop.</td></tr>
    @endforelse
    </tbody>
</table>
</div>
<div style="margin-top:1rem;">{{ $products->links() }}</div>
@endsection
