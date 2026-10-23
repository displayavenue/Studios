@extends('layouts.admin')
@section('title', 'Brands')
@section('content')
<div class="admin-top"><h2>Brands</h2><a class="btn btn-primary" href="{{ route('admin.brands.create') }}">Add brand</a></div>
<div class="admin-card">
<table class="admin-table">
<thead><tr><th>Name</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse ($brands as $brand)
<tr>
<td>{{ $brand->name }}</td>
<td><span class="badge">{{ $brand->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.brands.edit', $brand) }}">Edit</a>
<form method="post" action="{{ route('admin.brands.destroy', $brand) }}" onsubmit="return confirm('Delete brand?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty
<tr><td colspan="3">No brands yet.</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $brands->links() }}
@endsection
