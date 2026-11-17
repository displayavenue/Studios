@extends('layouts.admin')

@section('title', ($system ? 'Edit' : 'Add').' system')
@section('content')
@php $isEdit = (bool) $system; @endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit system — '.$system['name'] : 'Add body system' }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form
    method="post"
    action="{{ $isEdit ? route('admin.health-explorer.systems.update', $system['id']) : route('admin.health-explorer.systems.store') }}"
    class="admin-form admin-card"
>
    @csrf
    @if ($isEdit) @method('PUT') @endif
    @unless ($isEdit)
        <label>Id (optional) <input name="id" value="{{ old('id') }}" placeholder="auto-from-name"></label>
    @endunless
    <label>Name <input name="name" value="{{ old('name', $system['name'] ?? '') }}" required></label>
    <label>Description <textarea name="description" rows="3">{{ old('description', $system['description'] ?? '') }}</textarea></label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save' : 'Create' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
