@extends('layouts.admin')
@section('title', $doctor->exists ? 'Edit doctor' : 'Add doctor')
@section('content')
<div class="admin-top"><h2>{{ $doctor->exists ? 'Edit doctor' : 'Add doctor' }}</h2></div>
<form method="post" action="{{ $doctor->exists ? route('admin.doctors.update', $doctor) : route('admin.doctors.store') }}" class="admin-form admin-card">
@csrf
@if($doctor->exists) @method('PUT') @endif
<label>Full name <input name="full_name" value="{{ old('full_name', $doctor->full_name) }}" required></label>
<label>Slug <input name="slug" value="{{ old('slug', $doctor->slug) }}"></label>
<label>Designation <input name="designation" value="{{ old('designation', $doctor->designation) }}"></label>
<label>Photo media
<select name="photo_media_id">
<option value="">—</option>
@foreach($media as $item)
<option value="{{ $item->id }}" @selected(old('photo_media_id', $doctor->photo_media_id)==$item->id)>#{{ $item->id }} {{ $item->original_name }}</option>
@endforeach
</select>
</label>
<label>Years experience <input type="number" min="0" name="years_experience" value="{{ old('years_experience', $doctor->years_experience) }}"></label>
<label>Languages (comma-separated) <input name="languages" value="{{ old('languages', implode(', ', $doctor->languages ?? [])) }}"></label>
<label>Specializations (comma-separated) <input name="specializations" value="{{ old('specializations', implode(', ', $doctor->specializations ?? [])) }}"></label>
<label style="font-weight:600;">Consultation modes</label>
<label style="display:flex;gap:0.4rem;font-weight:500;"><input type="checkbox" name="consultation_modes[]" value="online" @checked(in_array('online', old('consultation_modes', $doctor->consultation_modes ?? []), true))> Online</label>
<label style="display:flex;gap:0.4rem;font-weight:500;"><input type="checkbox" name="consultation_modes[]" value="clinic" @checked(in_array('clinic', old('consultation_modes', $doctor->consultation_modes ?? []), true))> Clinic</label>
<label>Fee (INR) <input type="number" step="0.01" min="0" name="fee_inr" value="{{ old('fee_inr', $doctor->fee_paise !== null ? number_format($doctor->fee_paise/100, 2, '.', '') : '') }}"></label>
<label>City <input name="city" value="{{ old('city', $doctor->city) }}"></label>
<label>Locality <input name="locality" value="{{ old('locality', $doctor->locality) }}"></label>
<label>Bio <textarea name="bio">{{ old('bio', $doctor->bio) }}</textarea></label>
<label>Verification status
<select name="verification_status">
@foreach(['unverified','pending','verified','rejected'] as $s)
<option value="{{ $s }}" @selected(old('verification_status', $doctor->verification_status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<label>Status
<select name="status">
@foreach(['draft','published','suspended','archived'] as $s)
<option value="{{ $s }}" @selected(old('status', $doctor->status)===$s)>{{ $s }}</option>
@endforeach
</select>
</label>
<button class="btn btn-primary" type="submit">Save profile</button>
</form>

@if ($doctor->exists)
<div class="admin-card" style="margin-top:1rem;">
<h3>Credentials</h3>
@foreach ($doctor->credentials as $cred)
<p>#{{ $cred->id }} {{ $cred->credential_type }} — {{ $cred->review_status }}</p>
@endforeach
<form method="post" action="{{ route('admin.doctors.credentials.store', $doctor) }}" class="admin-form">
@csrf
<label>Type <input name="credential_type" required></label>
<label>Number <input name="credential_number"></label>
<label>Issuing body <input name="issuing_body"></label>
<label>Review status
<select name="review_status">
<option value="pending">pending</option>
<option value="verified">verified</option>
<option value="rejected">rejected</option>
</select>
</label>
<button class="btn btn-secondary" type="submit">Add credential</button>
</form>
</div>

<div class="admin-card" style="margin-top:1rem;">
<h3>Weekly availability</h3>
@foreach ($doctor->availabilities as $slot)
<p>Weekday {{ $slot->weekday }} · {{ substr($slot->start_time,0,5) }}–{{ substr($slot->end_time,0,5) }} · {{ $slot->slot_minutes }}m · {{ $slot->mode }}</p>
@endforeach
<form method="post" action="{{ route('admin.doctors.availability.store', $doctor) }}" class="admin-form">
@csrf
<label>Weekday (0=Sun … 6=Sat) <input type="number" min="0" max="6" name="weekday" required></label>
<label>Start (HH:MM) <input name="start_time" placeholder="10:00" required></label>
<label>End (HH:MM) <input name="end_time" placeholder="13:00" required></label>
<label>Slot minutes <input type="number" min="15" name="slot_minutes" value="30" required></label>
<label>Mode
<select name="mode"><option value="online">online</option><option value="clinic">clinic</option></select>
</label>
<button class="btn btn-secondary" type="submit">Add availability</button>
</form>
</div>

<div class="admin-card" style="margin-top:1rem;">
<h3>Leave dates</h3>
@foreach ($doctor->leaves as $leave)
<p>{{ $leave->leave_date->toDateString() }} {{ $leave->reason }}</p>
@endforeach
<form method="post" action="{{ route('admin.doctors.leaves.store', $doctor) }}" class="admin-form">
@csrf
<label>Date <input type="date" name="leave_date" required></label>
<label>Reason <input name="reason"></label>
<button class="btn btn-secondary" type="submit">Add leave</button>
</form>
</div>
@endif
@endsection
