@extends('layouts.admin')
@section('title', $brand->exists ? 'Edit brand' : 'Add brand')
@section('content')
<div class="admin-top"><h2>{{ $brand->exists ? 'Edit brand' : 'Add brand' }}</h2></div>
<form method="post" action="{{ $brand->exists ? route('admin.brands.update', $brand) : route('admin.brands.store') }}" class="admin-form admin-card">
@csrf
@if($brand->exists) @method('PUT') @endif
<label>Name <input name="name" value="{{ old('name', $brand->name) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $brand->slug) }}"></label>
<label>Description <textarea name="description">{{ old('description', $brand->description) }}</textarea></label>
<label>Logo media ID
<select name="logo_media_id">
<option value="">—</option>
@foreach($media as $item)
<option value="{{ $item->id }}" @selected(old('logo_media_id', $brand->logo_media_id)==$item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
</label>
<label>Status
<select name="status">
@foreach(['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $brand->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $brand->sort_order ?? 0) }}"></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.brands.index') }}">Cancel</a></div>
</form>
@endsection
