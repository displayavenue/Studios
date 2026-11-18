@extends('layouts.admin')

@section('title', 'Body systems')
@section('content')

<div class="admin-top">
    <h2>Body systems</h2>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a class="btn btn-primary" href="{{ route('admin.health-explorer.systems.create') }}">Add system</a>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.index') }}">Explorer hub</a>
    </div>
</div>

@if (session('status'))
    <p class="admin-card" style="border-color:#b7d9cf;background:#eef8f4;">{{ session('status') }}</p>
@endif

<p class="admin-card" style="margin-bottom:1rem;">
    Edit each system on its own page (Cardiovascular, Respiratory, etc.). Systems do not overwrite each other,
    and your catalogue edits are stored in server storage so code deploys do not reset them to defaults.
</p>

<div class="admin-card">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Id</th>
                <th>Organs</th>
                <th>Overlay</th>
                <th>Order</th>
                <th>Enabled</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        @foreach ($systems as $system)
            <tr>
                <td>{{ $system['name'] }}</td>
                <td><code>{{ $system['id'] }}</code></td>
                <td>{{ $organCountsBySystem[$system['id']] ?? 0 }}</td>
                <td>{{ ($system['overlay_mode'] ?? 'none') === 'none' ? '—' : ($system['overlay_mode'] ?? '—') }}</td>
                <td>{{ $system['sort_order'] ?? 100 }}</td>
                <td>{{ !empty($system['enabled']) || !array_key_exists('enabled', $system) ? 'Yes' : 'No' }}</td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.systems.edit', $system['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.systems.destroy', $system['id']) }}" onsubmit="return confirm('Delete this system? Organs must be reassigned first.');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-secondary" style="padding:0.2rem 0.55rem;">Delete</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
@endsection
