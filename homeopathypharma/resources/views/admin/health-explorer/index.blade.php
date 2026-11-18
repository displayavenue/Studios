@extends('layouts.admin')

@section('title', 'Health Explorer')
@section('content')

<div class="admin-top">
    <h2>Human Health Explorer</h2>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a class="btn btn-primary" href="{{ route('admin.health-explorer.anatomy') }}">Anatomy editor</a>
        <a class="btn btn-secondary" href="{{ route('health-explorer') }}" target="_blank" rel="noopener">Open explorer</a>
    </div>
</div>

@if (session('status'))
    <p class="admin-card" style="border-color:#b7d9cf;background:#eef8f4;">{{ session('status') }}</p>
@endif

<p class="admin-card" style="margin-bottom:1rem;">
    Manage the full Health Explorer catalogue here — systems, organs, diseases, mental topics, and homeopathy products.
    Use the <a href="{{ route('admin.health-explorer.anatomy') }}"><strong>Anatomy editor</strong></a> to drag red dots on the same male/female figures as the live site (front, back, left, right) and edit each organ’s homeopathy info.
    Changes write to <code>public/data/health-explorer/catalog.json</code> and sync to the live explorer.
</p>

<div class="admin-card" style="margin-bottom:1rem;display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap;">
    <div>
        <h3 style="margin:0 0 0.35rem;">Anatomy map</h3>
        <p style="margin:0;color:#5b6b65;">Drag dots on Female/Male · Front/Back/Left/Right — preview matches the storefront explorer.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('admin.health-explorer.anatomy') }}">Open anatomy editor</a>
</div>

<div class="admin-card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:0.75rem;margin-bottom:1rem;">
    <div><strong>{{ $counts['systems'] }}</strong><div>Systems</div></div>
    <div><strong>{{ $counts['organs'] }}</strong><div>Organs</div></div>
    <div><strong>{{ $counts['diseases'] }}</strong><div>Diseases</div></div>
    <div><strong>{{ $counts['mental'] }}</strong><div>Mental topics</div></div>
    <div><strong>{{ $counts['products'] }}</strong><div>Homeopathy products</div></div>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <h3 style="margin-top:0;">Disclaimer</h3>
    <form method="post" action="{{ route('admin.health-explorer.disclaimer.update') }}" class="admin-form">
        @csrf
        @method('PUT')
        <label>Page disclaimer
            <textarea name="disclaimer" rows="4" required>{{ old('disclaimer', $disclaimer) }}</textarea>
        </label>
        <button class="btn btn-primary" type="submit">Save disclaimer</button>
    </form>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <div class="admin-top" style="margin:0 0 0.75rem;">
        <h3 style="margin:0;">Body systems</h3>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.systems.create') }}">Add system</a>
    </div>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>Id</th><th></th></tr></thead>
        <tbody>
        @foreach ($systems as $system)
            <tr>
                <td>{{ $system['name'] }}</td>
                <td><code>{{ $system['id'] }}</code></td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.systems.edit', $system['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.systems.destroy', $system['id']) }}" onsubmit="return confirm('Delete this system?');">
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

<div class="admin-card" style="margin-bottom:1rem;">
    <div class="admin-top" style="margin:0 0 0.75rem;">
        <h3 style="margin:0;">Organs</h3>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.organs.create') }}">Add organ</a>
    </div>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>System</th><th>Gender</th><th></th></tr></thead>
        <tbody>
        @foreach ($organs as $organ)
            <tr>
                <td>{{ $organ['name'] }}</td>
                <td>{{ $organ['system_id'] }}</td>
                <td>{{ $organ['gender'] }}</td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.organs.edit', $organ['slug'] ?? $organ['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.organs.destroy', $organ['slug'] ?? $organ['id']) }}" onsubmit="return confirm('Delete this organ?');">
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

<div class="admin-card" style="margin-bottom:1rem;">
    <div class="admin-top" style="margin:0 0 0.75rem;">
        <h3 style="margin:0;">Diseases / conditions</h3>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.diseases.create') }}">Add disease</a>
    </div>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>Organs</th><th></th></tr></thead>
        <tbody>
        @foreach ($diseases as $disease)
            <tr>
                <td>{{ $disease['name'] }}</td>
                <td>{{ implode(', ', $disease['organ_ids'] ?? []) ?: '—' }}</td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.diseases.edit', $disease['slug'] ?? $disease['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.diseases.destroy', $disease['slug'] ?? $disease['id']) }}" onsubmit="return confirm('Delete this disease?');">
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

<div class="admin-card" style="margin-bottom:1rem;">
    <div class="admin-top" style="margin:0 0 0.75rem;">
        <h3 style="margin:0;">Mental health topics</h3>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.mental.create') }}">Add topic</a>
    </div>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>Summary</th><th></th></tr></thead>
        <tbody>
        @foreach ($mental as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td>{{ \Illuminate\Support\Str::limit($item['summary'] ?? '', 90) }}</td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.mental.edit', $item['slug'] ?? $item['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.mental.destroy', $item['slug'] ?? $item['id']) }}" onsubmit="return confirm('Delete this topic?');">
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

<div class="admin-card">
    <div class="admin-top" style="margin:0 0 0.75rem;">
        <h3 style="margin:0;">Homeopathy products</h3>
        <a class="btn btn-secondary" href="{{ route('admin.health-explorer.products.create') }}">Add product</a>
    </div>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>Manufacturer</th><th>Potency</th><th></th></tr></thead>
        <tbody>
        @foreach ($products as $product)
            <tr>
                <td>{{ $product['name'] }}</td>
                <td>{{ $product['manufacturer'] ?? '—' }}</td>
                <td>{{ $product['potency'] ?? '—' }}</td>
                <td style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="{{ route('admin.health-explorer.products.edit', $product['slug'] ?? $product['id']) }}">Edit</a>
                    <form method="post" action="{{ route('admin.health-explorer.products.destroy', $product['slug'] ?? $product['id']) }}" onsubmit="return confirm('Delete this product?');">
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
