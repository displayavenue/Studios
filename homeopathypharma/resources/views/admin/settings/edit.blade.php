@extends('layouts.admin')
@section('title', 'Site settings')
@section('content')
<div class="admin-top"><h2>Site settings</h2></div>
<form method="post" action="{{ route('admin.settings.update') }}" class="admin-form admin-card">
@csrf @method('PUT')
@foreach (['brand_name','tagline','phone_display','phone_tel','address','currency','locale','timezone'] as $key)
<label>{{ str_replace('_',' ', ucfirst($key)) }}
@if ($key === 'address')
<textarea name="{{ $key }}">{{ old($key, $settings[$key]->value ?? '') }}</textarea>
@else
<input name="{{ $key }}" value="{{ old($key, $settings[$key]->value ?? '') }}" required>
@endif
</label>
@endforeach
<label>Consultation fee (INR)
<input type="number" step="1" min="0" name="consultation_fee_inr" value="{{ old('consultation_fee_inr', isset($settings['consultation_fee_paise']) ? (int) round(((int) $settings['consultation_fee_paise']->value)/100) : 999) }}" required>
</label>
<label>Facebook page URL <input type="url" name="facebook_url" value="{{ old('facebook_url', $settings['facebook_url']->value ?? '') }}" placeholder="https://facebook.com/..."></label>
<label>Instagram profile URL <input type="url" name="instagram_url" value="{{ old('instagram_url', $settings['instagram_url']->value ?? '') }}" placeholder="https://instagram.com/..."></label>
<label>Announcement text <textarea name="announcement_text">{{ old('announcement_text', $settings['announcement_text']->value ?? '') }}</textarea></label>
<label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
<input type="checkbox" name="announcement_enabled" value="1" @checked(old('announcement_enabled', filter_var($settings['announcement_enabled']->value ?? false, FILTER_VALIDATE_BOOLEAN)))>
Announcement bar enabled
</label>
<button class="btn btn-primary" type="submit">Save settings</button>
</form>
@endsection
