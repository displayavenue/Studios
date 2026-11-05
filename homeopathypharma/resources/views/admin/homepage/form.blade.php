@extends('layouts.admin')
@section('title', 'Edit '.$label)
@section('content')
<div class="admin-top">
    <div>
        <h2>Edit: {{ $label }}</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Key <code>{{ $section->key }}</code> — changes publish to the homepage when status is Published and Enabled.</p>
    </div>
</div>
<form method="post" action="{{ route('admin.homepage.update', $section) }}" class="admin-form admin-card">
    @csrf @method('PUT')

    <label>Section title
        <input name="title" value="{{ old('title', $section->title) }}">
    </label>
    <label>Section subtitle
        <textarea name="subtitle" rows="2">{{ old('subtitle', $section->subtitle) }}</textarea>
    </label>
    <label>Sort order
        <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $section->sort_order) }}">
    </label>
    <label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
        <input type="checkbox" name="is_enabled" value="1" @checked(old('is_enabled', $section->is_enabled))> Enabled on homepage
    </label>
    <label>Status
        <select name="status">
            @foreach (['draft', 'published'] as $s)
                <option value="{{ $s }}" @selected(old('status', $section->status) === $s)>{{ $s }}</option>
            @endforeach
        </select>
    </label>

    @if (count($fields))
        <hr style="border:0;border-top:1px solid #e6e0d6;margin:1rem 0;">
        <h3 style="margin:0 0 0.75rem;font-size:1rem;">Section fields</h3>
        @foreach ($fields as $key => $field)
            @php($value = old('payload.'.$key, $payload[$key] ?? ''))
            <label>
                {{ $field['label'] }}
                @if (($field['type'] ?? 'text') === 'textarea')
                    <textarea name="payload[{{ $key }}]" rows="{{ $field['rows'] ?? 4 }}">{{ $value }}</textarea>
                @else
                    <input type="text" name="payload[{{ $key }}]" value="{{ $value }}">
                @endif
                @if (!empty($field['help']))
                    <small class="admin-muted">{{ $field['help'] }}</small>
                @endif
            </label>
        @endforeach
    @endif

    <details style="margin-top:1rem;">
        <summary style="cursor:pointer;font-weight:600;">Advanced: raw payload JSON</summary>
        <label style="margin-top:0.75rem;">Payload JSON
            <textarea name="payload_json" style="min-height:10rem;font-family:ui-monospace,monospace;">{{ old('payload_json', '') }}</textarea>
            <small class="admin-muted">Leave blank to keep the fields above. If filled, this JSON replaces the payload.</small>
        </label>
    </details>

    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save section</button>
        <a class="btn btn-secondary" href="{{ route('admin.homepage.index') }}">Cancel</a>
        <a class="btn btn-secondary" href="{{ route('home') }}#{{ $section->key === 'consult' ? 'consult-doctors' : ($section->key === 'doctor_lead' ? 'talk-to-doctor' : '') }}" target="_blank" rel="noopener">Preview site</a>
    </div>
</form>
@endsection
