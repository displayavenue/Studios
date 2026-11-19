@extends('layouts.admin')

@section('title', ($system ? 'Edit' : 'Add').' system')
@section('content')
@php
    $isEdit = (bool) $system;
    $overlays = $system['overlays'] ?? [];
@endphp

<div class="admin-top">
    <h2>{{ $isEdit ? 'Edit system — '.$system['name'] : 'Add body system' }}</h2>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.systems.index') }}">All systems</a>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Explorer hub</a>
    </div>
</div>

@if (session('status'))
    <p class="admin-card" style="border-color:#b7d9cf;background:#eef8f4;">{{ session('status') }}</p>
@endif

<p class="admin-card" style="margin-bottom:1rem;">
    Each body system is stored separately. Saving this form updates <strong>only this system</strong>
    — organs and other systems keep their own content. Live catalogue edits are kept in storage and
    are not reset when Health Explorer code is updated.
</p>

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
    <label>Short description (chip tooltip)
        <textarea name="description" rows="2">{{ old('description', $system['description'] ?? '') }}</textarea>
    </label>
    <label>Summary <textarea name="summary" rows="3">{{ old('summary', $system['summary'] ?? '') }}</textarea></label>
    <label>Function <textarea name="function" rows="3">{{ old('function', $system['function'] ?? '') }}</textarea></label>

    <label>Symptoms (one per line)
        <textarea name="symptoms" rows="4">{{ old('symptoms', implode("\n", $system['symptoms'] ?? [])) }}</textarea>
    </label>
    <label>Causes (one per line)
        <textarea name="causes" rows="4">{{ old('causes', implode("\n", $system['causes'] ?? [])) }}</textarea>
    </label>
    <label>Treatments (one per line)
        <textarea name="treatments" rows="4">{{ old('treatments', implode("\n", $system['treatments'] ?? [])) }}</textarea>
    </label>
    <label>Specialists (one per line)
        <textarea name="specialists" rows="3">{{ old('specialists', implode("\n", $system['specialists'] ?? [])) }}</textarea>
    </label>
    <label>Prevention (one per line)
        <textarea name="prevention" rows="3">{{ old('prevention', implode("\n", $system['prevention'] ?? [])) }}</textarea>
    </label>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;">
        <label>Sort order
            <input type="number" min="0" max="9999" name="sort_order" value="{{ old('sort_order', $system['sort_order'] ?? 100) }}">
        </label>
        <label>Overlay mode
            <select name="overlay_mode">
                @foreach (['none' => 'None', 'full_figure' => 'Full figure', 'vessels' => 'Vessels only'] as $value => $label)
                    <option value="{{ $value }}" @selected(old('overlay_mode', $system['overlay_mode'] ?? 'none') === $value)>{{ $label }}</option>
                @endforeach
            </select>
        </label>
    </div>

    @php
        $enabledChecked = old('enabled', !array_key_exists('enabled', $system ?? []) || !empty($system['enabled'] ?? true));
        $enabledChecked = $enabledChecked === true || $enabledChecked === 1 || $enabledChecked === '1';
    @endphp
    <input type="hidden" name="enabled" value="0">
    <label style="display:flex;align-items:center;gap:0.5rem;">
        <input type="checkbox" name="enabled" value="1" @checked($enabledChecked)>
        Show this system chip on the explorer
    </label>

    <h3>Anatomy overlays (optional, per view)</h3>
    <p style="margin-top:0;color:#5b6b65;">Paths relative to the site root. Leave blank for views without an overlay. Each system’s overlays are independent.</p>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;">
        <label>Female · Front
            <input name="overlay_female_front" value="{{ old('overlay_female_front', $overlays['female']['front'] ?? '') }}" placeholder="/images/health-explorer/overlays/...">
        </label>
        <label>Male · Front
            <input name="overlay_male_front" value="{{ old('overlay_male_front', $overlays['male']['front'] ?? '') }}" placeholder="/images/health-explorer/overlays/...">
        </label>
        <label>Female · Back
            <input name="overlay_female_back" value="{{ old('overlay_female_back', $overlays['female']['back'] ?? '') }}">
        </label>
        <label>Male · Back
            <input name="overlay_male_back" value="{{ old('overlay_male_back', $overlays['male']['back'] ?? '') }}">
        </label>
        <label>Female · Right (side)
            <input name="overlay_female_side" value="{{ old('overlay_female_side', $overlays['female']['side'] ?? '') }}">
        </label>
        <label>Male · Right (side)
            <input name="overlay_male_side" value="{{ old('overlay_male_side', $overlays['male']['side'] ?? '') }}">
        </label>
        <label>Female · Left
            <input name="overlay_female_side_left" value="{{ old('overlay_female_side_left', $overlays['female']['side-left'] ?? '') }}">
        </label>
        <label>Male · Left
            <input name="overlay_male_side_left" value="{{ old('overlay_male_side_left', $overlays['male']['side-left'] ?? '') }}">
        </label>
    </div>

    <label>SEO title <input name="seo_title" value="{{ old('seo_title', $system['seo_title'] ?? '') }}"></label>
    <label>SEO description <textarea name="seo_description" rows="2">{{ old('seo_description', $system['seo_description'] ?? '') }}</textarea></label>

    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">{{ $isEdit ? 'Save this system' : 'Create system' }}</button>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.systems.index') }}">Cancel</a>
    </div>
</form>

@if ($isEdit)
    <div class="admin-card" style="margin-top:1rem;">
        <div class="admin-top" style="margin:0 0 0.75rem;">
            <h3 style="margin:0;">Organs in this system ({{ count($organs) }})</h3>
            <a class="btn btn-secondary" href="{{ route('admin.health-explorer.organs.create') }}">Add organ</a>
        </div>
        @if (count($organs) === 0)
            <p style="margin:0;color:#5b6b65;">No organs linked yet. Create organs and set their system to <code>{{ $system['id'] }}</code>.</p>
        @else
            <table class="admin-table">
                <thead><tr><th>Name</th><th>Gender</th><th></th></tr></thead>
                <tbody>
                @foreach ($organs as $organ)
                    <tr>
                        <td>{{ $organ['name'] }}</td>
                        <td>{{ $organ['gender'] ?? '—' }}</td>
                        <td><a href="{{ route('admin.health-explorer.organs.edit', $organ['slug'] ?? $organ['id']) }}">Edit organ</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @endif
    </div>
@endif
@endsection
