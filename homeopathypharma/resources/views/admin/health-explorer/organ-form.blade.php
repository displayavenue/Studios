@extends('layouts.admin')

@section('title', ($organ ? 'Edit' : 'Add').' organ')
@section('content')
@php
    $isEdit = (bool) $organ;
    $front = $organ['hotspots']['female']['front'] ?? $organ['hotspots']['male']['front'] ?? ['cx' => 50, 'cy' => 40];
    $side = $organ['hotspots']['female']['side'] ?? $organ['hotspots']['male']['side'] ?? ['cx' => 50, 'cy' => 40];
    $back = $organ['hotspots']['female']['back'] ?? $organ['hotspots']['male']['back'] ?? ['cx' => 50, 'cy' => 40];
@endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit organ — '.$organ['name'] : 'Add organ' }}</h2>
    <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Back</a>
</div>

<form
    method="post"
    action="{{ $isEdit ? route('admin.health-explorer.organs.update', $organ['slug'] ?? $organ['id']) : route('admin.health-explorer.organs.store') }}"
    class="admin-form admin-card"
>
    @csrf
    @if ($isEdit) @method('PUT') @endif

    @unless ($isEdit)
        <label>Slug (optional) <input name="slug" value="{{ old('slug') }}" placeholder="auto-from-name"></label>
    @endunless
    <label>Name <input name="name" value="{{ old('name', $organ['name'] ?? '') }}" required></label>
    @php
        $selectedSystems = old('system_ids', $organ['system_ids'] ?? (isset($organ['system_id']) ? [$organ['system_id']] : []));
        if (! is_array($selectedSystems)) {
            $selectedSystems = [$selectedSystems];
        }
    @endphp
    <label style="display:flex;gap:0.45rem;align-items:flex-start;font-weight:600;">
        <input
            type="checkbox"
            name="show_in_all"
            value="1"
            @checked(old('show_in_all', ! empty($organ['show_in_all'])))
        >
        <span>Show in All systems <span style="font-weight:500;color:#5b6b65;">(separate overview — not automatic from body systems)</span></span>
    </label>
    <fieldset style="border:1px solid #e3e8e1;border-radius:0.5rem;padding:0.75rem;">
        <legend>Body systems (select one or more, optional if shown in All)</legend>
        <div style="display:grid;gap:0.35rem;">
            @foreach ($systems as $system)
                @continue(($system['id'] ?? '') === 'mental')
                <label style="display:flex;gap:0.45rem;align-items:center;font-weight:500;">
                    <input
                        type="checkbox"
                        name="system_ids[]"
                        value="{{ $system['id'] }}"
                        @checked(in_array($system['id'], $selectedSystems, true))
                    >
                    <span>{{ $system['name'] }}</span>
                </label>
            @endforeach
        </div>
    </fieldset>
    <label>Gender
        <select name="gender" required>
            @foreach (['both','female','male'] as $g)
                <option value="{{ $g }}" @selected(old('gender', $organ['gender'] ?? 'both') === $g)>{{ $g }}</option>
            @endforeach
        </select>
    </label>
    <label>Summary <textarea name="summary" rows="3">{{ old('summary', $organ['summary'] ?? '') }}</textarea></label>
    <label>Function <textarea name="function" rows="3">{{ old('function', $organ['function'] ?? '') }}</textarea></label>
    <label>Description <textarea name="description" rows="5">{{ old('description', $organ['description'] ?? '') }}</textarea></label>
    <label>Symptoms (one per line)
        <textarea name="symptoms" rows="4">{{ old('symptoms', implode("\n", $organ['symptoms'] ?? [])) }}</textarea>
    </label>

    <h3>Red dot positions (percent of figure)</h3>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;">
        <fieldset style="border:1px solid #e3e8e1;border-radius:0.5rem;padding:0.75rem;">
            <legend>Front</legend>
            <label>X% <input type="number" step="0.1" min="0" max="100" name="hotspot_front_cx" value="{{ old('hotspot_front_cx', $front['cx'] ?? 50) }}"></label>
            <label>Y% <input type="number" step="0.1" min="0" max="100" name="hotspot_front_cy" value="{{ old('hotspot_front_cy', $front['cy'] ?? 40) }}"></label>
        </fieldset>
        <fieldset style="border:1px solid #e3e8e1;border-radius:0.5rem;padding:0.75rem;">
            <legend>Side</legend>
            <label>X% <input type="number" step="0.1" min="0" max="100" name="hotspot_side_cx" value="{{ old('hotspot_side_cx', $side['cx'] ?? 50) }}"></label>
            <label>Y% <input type="number" step="0.1" min="0" max="100" name="hotspot_side_cy" value="{{ old('hotspot_side_cy', $side['cy'] ?? 40) }}"></label>
        </fieldset>
        <fieldset style="border:1px solid #e3e8e1;border-radius:0.5rem;padding:0.75rem;">
            <legend>Back</legend>
            <label>X% <input type="number" step="0.1" min="0" max="100" name="hotspot_back_cx" value="{{ old('hotspot_back_cx', $back['cx'] ?? 50) }}"></label>
            <label>Y% <input type="number" step="0.1" min="0" max="100" name="hotspot_back_cy" value="{{ old('hotspot_back_cy', $back['cy'] ?? 40) }}"></label>
        </fieldset>
    </div>

    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $organ['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $organ['seo_description'] ?? '') }}</textarea></label>

    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save' : 'Create' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Cancel</a>
    </div>
</form>
@endsection
