@extends('layouts.admin')
@section('title', 'A–Z Diseases')
@section('content')
<div class="admin-top">
    <div>
        <h2>A–Z Diseases</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Editable condition pages shown under Conditions → A to Z Diseases. Use the letter bar to stay on one section while editing.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('admin.conditions.create', array_filter(['letter' => $letter ?: null])) }}">Add disease</a>
</div>

<form method="get" class="admin-actions" style="margin-bottom:1rem;gap:0.5rem;flex-wrap:wrap;">
    @if ($letter !== '')
        <input type="hidden" name="letter" value="{{ $letter }}">
    @endif
    <input type="search" name="q" value="{{ $q }}" placeholder="Search title / category">
    <select name="status" onchange="this.form.submit()">
        <option value="">All statuses</option>
        @foreach (['draft','published','archived'] as $s)
            <option value="{{ $s }}" @selected($status === $s)>{{ $s }}</option>
        @endforeach
    </select>
    <button class="btn btn-secondary" type="submit">Filter</button>
</form>

<nav class="admin-az-rail" aria-label="Filter diseases by letter">
    <div class="admin-az-rail__label">
        <strong>A–Z</strong>
        <span class="admin-muted">
            @if ($letter !== '')
                Showing <strong>{{ $letter }}</strong> — stays selected until you change it
            @else
                All letters
            @endif
        </span>
    </div>
    <div class="admin-az-rail__letters">
        <a
            class="admin-az-rail__btn{{ $letter === '' ? ' is-active' : '' }}"
            href="{{ route('admin.conditions.index', ['letter' => ''] + array_filter(['q' => $q ?: null, 'status' => $status ?: null])) }}"
        >All</a>
        @foreach ($alphabet as $alpha)
            @php($count = (int) ($letterCounts[$alpha] ?? 0))
            <a
                class="admin-az-rail__btn{{ $letter === $alpha ? ' is-active' : '' }}{{ $count === 0 ? ' is-empty' : '' }}"
                href="{{ route('admin.conditions.index', array_filter(['letter' => $alpha, 'q' => $q ?: null, 'status' => $status ?: null])) }}"
                @if ($count === 0) aria-disabled="true" title="No diseases for {{ $alpha }}" @endif
            >
                <span>{{ $alpha }}</span>
                @if ($count > 0)<small>{{ $count }}</small>@endif
            </a>
        @endforeach
    </div>
</nav>

<div class="admin-card">
<table class="admin-table">
<thead>
<tr>
    <th></th>
    <th>Title</th>
    <th>Category</th>
    <th>Status</th>
    <th></th>
</tr>
</thead>
<tbody>
@forelse ($conditions as $condition)
<tr>
    <td style="width:3.5rem;">
        <img src="{{ $condition->imageUrl() }}" alt="" width="44" height="44" style="object-fit:cover;border-radius:0.35rem;background:#eee;">
    </td>
    <td><strong>{{ $condition->title }}</strong><div class="admin-muted"><code>{{ $condition->slug }}</code></div></td>
    <td>{{ $condition->category }}</td>
    <td><span class="badge">{{ $condition->status }}</span></td>
    <td style="white-space:nowrap;">
        <a href="{{ route('admin.conditions.edit', ['condition' => $condition, 'letter' => $letter ?: null]) }}">Edit</a>
        · <a href="{{ route('conditions.show', $condition->slug) }}" target="_blank" rel="noopener">View</a>
    </td>
</tr>
@empty
<tr><td colspan="5">
    @if ($letter !== '')
        No diseases under letter <strong>{{ $letter }}</strong>. Pick another letter or
        <a href="{{ route('admin.conditions.index', ['letter' => '']) }}">show all</a>.
    @else
        No diseases yet. Seed the catalogue or add one.
    @endif
</td></tr>
@endforelse
</tbody>
</table>
</div>
{{ $conditions->links() }}
@endsection
