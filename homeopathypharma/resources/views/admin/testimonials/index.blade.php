@extends('layouts.admin')
@section('title', 'Testimonials')
@section('content')
<div class="admin-top"><h2>Testimonials</h2><a class="btn btn-primary" href="{{ route('admin.testimonials.create') }}">Add testimonial</a></div>
<div class="admin-card"><table class="admin-table">
<thead><tr><th>Author</th><th>Homepage</th><th>Status</th><th></th></tr></thead>
<tbody>
@forelse($testimonials as $item)
<tr>
<td>{{ $item->author_name }}</td>
<td>{{ $item->show_on_homepage ? 'Yes' : 'No' }}</td>
<td><span class="badge">{{ $item->status }}</span></td>
<td class="admin-actions">
<a href="{{ route('admin.testimonials.edit', $item) }}">Edit</a>
<form method="post" action="{{ route('admin.testimonials.destroy', $item) }}" onsubmit="return confirm('Delete?');">@csrf @method('DELETE')<button class="btn btn-danger" type="submit">Delete</button></form>
</td>
</tr>
@empty<tr><td colspan="4">No testimonials yet.</td></tr>@endforelse
</tbody></table></div>
{{ $testimonials->links() }}
@endsection
