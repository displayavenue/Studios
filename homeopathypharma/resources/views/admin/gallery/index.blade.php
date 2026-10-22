@extends('layouts.admin')
@section('title', 'Gallery')
@section('content')
<div class="admin-top">
<h2>Gallery</h2>
<div class="admin-actions">
<form method="post" action="{{ route('admin.gallery.sync-instagram') }}">@csrf<button class="btn btn-secondary" type="submit">Sync Instagram</button></form>
<a class="btn btn-primary" href="{{ route('admin.gallery.create') }}">Add item</a>
</div>
</div>
<p style="color:#68746D;">Instagram sync {{ $instagramConfigured ? 'is configured' : 'needs INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_USER_ID on the server' }}.</p>
<div class="admin-card"><table class="admin-table">
<thead><tr><th>Source</th><th>Caption</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse($items as $item)
<tr>
<td>{{ $item->source }}</td>
<td>{{ \Illuminate\Support\Str::limit($item->caption, 60) }}</td>
<td><span class="badge">{{ $item->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.gallery.edit', $item) }}">Edit</a>
<form method="post" action="{{ route('admin.gallery.destroy', $item) }}" onsubmit="return confirm('Delete?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty<tr><td colspan="4">No gallery items.</td></tr>@endforelse
</tbody></table></div>
{{ $items->links() }}
@endsection
