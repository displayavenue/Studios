@extends('layouts.admin')
@section('title', $testimonial->exists ? 'Edit testimonial' : 'Add testimonial')
@section('content')
<div class="admin-top"><h2>{{ $testimonial->exists ? 'Edit' : 'Add' }} testimonial</h2></div>
<form method="post" action="{{ $testimonial->exists ? route('admin.testimonials.update', $testimonial) : route('admin.testimonials.store') }}" class="admin-form admin-card">
@csrf
@if($testimonial->exists) @method('PUT') @endif
<label>Author name <input name="author_name" value="{{ old('author_name', $testimonial->author_name) }}" required></label>
<label>Author role / location <input name="author_role" value="{{ old('author_role', $testimonial->author_role) }}"></label>
<label>Quote <textarea name="quote" rows="5" required>{{ old('quote', $testimonial->quote) }}</textarea></label>
<label>Rating (1–5) <input type="number" min="1" max="5" name="rating" value="{{ old('rating', $testimonial->rating) }}"></label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $testimonial->sort_order ?? 0) }}"></label>
<label>Status <select name="status">@foreach(['draft','published','archived'] as $s)<option value="{{ $s }}" @selected(old('status', $testimonial->status)===$s)>{{ $s }}</option>@endforeach</select></label>
<label style="display:flex;gap:.5rem;align-items:center;font-weight:500;"><input type="checkbox" name="show_on_homepage" value="1" @checked(old('show_on_homepage', $testimonial->show_on_homepage))> Show on homepage</label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.testimonials.index') }}">Cancel</a></div>
</form>
@endsection
