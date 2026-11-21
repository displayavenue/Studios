@extends('layouts.admin')
@section('title', $entry->exists ? 'Edit Myths vs Facts entry' : 'Add Myths vs Facts entry')
@section('content')
<div class="admin-top">
    <h2>{{ $entry->exists ? 'Edit' : 'Add' }} Myths vs Facts entry</h2>
</div>
<form method="post" action="{{ $entry->exists ? route('admin.myth-vs-facts.update', $entry) : route('admin.myth-vs-facts.store') }}" class="admin-form admin-card">
    @csrf
    @if ($entry->exists)
        @method('PUT')
    @endif
    <label>Myth title
        <input name="myth_title" value="{{ old('myth_title', $entry->myth_title) }}" required maxlength="255">
    </label>
    <label>Fact title
        <input name="fact_title" value="{{ old('fact_title', $entry->fact_title) }}" required maxlength="255">
    </label>
    <label>Fact explanation
        <textarea name="fact_body" rows="5" required maxlength="4000">{{ old('fact_body', $entry->fact_body) }}</textarea>
    </label>
    <label>Sort order
        <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $entry->sort_order ?? 0) }}">
    </label>
    <label>Status
        <select name="status">
            @foreach (['draft', 'published', 'archived'] as $status)
                <option value="{{ $status }}" @selected(old('status', $entry->status) === $status)>{{ $status }}</option>
            @endforeach
        </select>
    </label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save</button>
        <a class="btn btn-secondary" href="{{ route('admin.myth-vs-facts.index') }}">Cancel</a>
    </div>
</form>
@if ($entry->exists)
    <form method="post" action="{{ route('admin.myth-vs-facts.destroy', $entry) }}" style="margin-top:1rem;" onsubmit="return confirm('Delete this entry permanently?');">
        @csrf
        @method('DELETE')
        <button class="btn btn-danger" type="submit">Delete entry</button>
    </form>
@endif
@endsection
