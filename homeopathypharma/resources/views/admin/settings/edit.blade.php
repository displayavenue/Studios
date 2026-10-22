@extends('layouts.admin')
@section('title', 'Site settings')
@section('content')
<div class="admin-top"><h2>Site settings</h2></div>
<form method="post" action="{{ route('admin.settings.update') }}" class="admin-form admin-card">
@csrf @method('PUT')
@foreach (['brand_name','tagline','phone_display','phone_tel','address','currency','locale','timezone','announcement_text'] as $key)
<label>{{ str_replace('_',' ', ucfirst($key)) }}
@if ($key === 'address' || $key === 'announcement_text')
<textarea name="{{ $key }}">{{ old($key, $settings[$key]->value ?? '') }}</textarea>
@else
<input name="{{ $key }}" value="{{ old($key, $settings[$key]->value ?? '') }}" @required($key !== 'announcement_text')>
@endif
</label>
@endforeach
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="announcement_enabled" value="1" @checked(old('announcement_enabled', filter_var($settings['announcement_enabled']->value ?? false, FILTER_VALIDATE_BOOLEAN)))>
Announcement bar enabled
</label>
<button class="btn btn-primary" type="submit">Save settings</button>
</form>
@endsection
