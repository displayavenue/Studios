@extends('layouts.admin')
@section('title', $item->exists ? 'Edit gallery item' : 'Add gallery item')
@section('content')
<div class="admin-top"><h2>{{ $item->exists ? 'Edit' : 'Add' }} gallery item</h2></div>
<form method="post" action="{{ $item->exists ? route('admin.gallery.update', $item) : route('admin.gallery.store') }}" class="admin-form admin-card">
@csrf
@if($item->exists) @method('PUT') @endif
<label>Caption <textarea name="caption">{{ old('caption', $item->caption) }}</textarea></label>
<label>Permalink URL <input name="permalink" value="{{ old('permalink', $item->permalink) }}"></label>
<label>Remote media URL <input name="remote_media_url" value="{{ old('remote_media_url', $item->remote_media_url) }}"></label>
<label>Media library
<select name="media_asset_id"><option value="">—</option>
@foreach($media as $m)<option value="{{ $m->id }}" @selected(old('media_asset_id', $item->media_asset_id)==$m->id)>#{{ $m->id }} {{ $m->original_name }}</option>@endforeach
</select></label>
<label>Type <select name="media_type">@foreach(['image','video','carousel'] as $t)<option value="{{ $t }}" @selected(old('media_type', $item->media_type)===$t)>{{ $t }}</option>@endforeach</select></label>
<label>Sort <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $item->sort_order ?? 0) }}"></label>
<label>Status <select name="status">@foreach(['draft','published','archived'] as $s)<option value="{{ $s }}" @selected(old('status', $item->status)===$s)>{{ $s }}</option>@endforeach</select></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.gallery.index') }}">Cancel</a></div>
</form>
@endsection
