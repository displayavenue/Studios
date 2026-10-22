@extends('layouts.admin')
@section('title', $member->exists ? 'Edit team member' : 'Add team member')
@section('content')
<div class="admin-top"><h2>{{ $member->exists ? 'Edit team member' : 'Add team member' }}</h2></div>
<form method="post" action="{{ $member->exists ? route('admin.team.update', $member) : route('admin.team.store') }}" class="admin-form admin-card">
@csrf
@if($member->exists) @method('PUT') @endif
<label>Name <input name="name" value="{{ old('name', $member->name) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $member->slug) }}"></label>
<label>Designation <input name="designation" value="{{ old('designation', $member->designation) }}" required></label>
<label>Photo media
<select name="photo_media_id">
<option value="">—</option>
@foreach($media as $item)
<option value="{{ $item->id }}" @selected(old('photo_media_id', $member->photo_media_id)==$item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
</label>
<label>Biography <textarea name="biography">{{ old('biography', $member->biography) }}</textarea></label>
<label>Responsibilities <textarea name="responsibilities">{{ old('responsibilities', $member->responsibilities) }}</textarea></label>
<label>Qualifications <textarea name="qualifications">{{ old('qualifications', $member->qualifications) }}</textarea></label>
<label>Link URL <input type="url" name="link_url" value="{{ old('link_url', $member->link_url) }}"></label>
<label>Sort order <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $member->sort_order ?? 0) }}"></label>
<label>Status
<select name="status">
@foreach(['draft','published','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $member->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Started on <input type="date" name="started_on" value="{{ old('started_on', optional($member->started_on)->format('Y-m-d')) }}"></label>
<div class="admin-actions"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-secondary" href="{{ route('admin.team.index') }}">Cancel</a></div>
</form>
@endsection
