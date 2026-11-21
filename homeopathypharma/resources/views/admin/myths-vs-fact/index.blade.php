@extends('layouts.admin')
@section('title', 'Myths vs Facts')
@section('content')
<div class="admin-top">
    <div>
        <h2>Myths vs Facts</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Editable entries shown under Conditions → Myths vs Facts. Add, reorder, draft, or publish anytime.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('admin.myth-vs-facts.create') }}">Add entry</a>
</div>
<div class="admin-card">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Order</th>
                <th>Myth</th>
                <th>Fact</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @forelse ($entries as $entry)
                <tr>
                    <td>{{ $entry->sort_order }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($entry->myth_title, 70) }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($entry->fact_title, 60) }}</td>
                    <td><span class="badge">{{ $entry->status }}</span></td>
                    <td class="admin-actions">
                        <a href="{{ route('admin.myth-vs-facts.edit', $entry) }}">Edit</a>
                        <form method="post" action="{{ route('admin.myth-vs-facts.destroy', $entry) }}" onsubmit="return confirm('Delete this entry?');">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger" type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="5">No Myths vs Facts entries yet. <a href="{{ route('admin.myth-vs-facts.create') }}">Add the first one</a>.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
{{ $entries->links() }}
<p class="admin-muted" style="margin-top:1rem;">Public page: <a href="{{ route('myths-vs-fact') }}" target="_blank" rel="noopener">{{ url('/myths-vs-fact') }}</a></p>
@endsection
