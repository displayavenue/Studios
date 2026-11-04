@extends('layouts.admin')

@section('title', 'Health Explorer')
@section('content')

<div class="admin-top">
    <h2>Human Health Explorer</h2>
    <a class="btn btn-secondary" href="{{ route('health-explorer') }}" target="_blank" rel="noopener">Open explorer</a>
</div>

<p class="admin-card" style="margin-bottom:1rem;">
    Catalogue is stored as structured JSON (<code>public/data/health-explorer/catalog.json</code>) so medical content is not hardcoded in the UI.
    Database tables are also available for a future full DB migration. Always keep traditional homeopathy claims separate from evidence-based care notes.
</p>

<div class="admin-card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:0.75rem;margin-bottom:1rem;">
    <div><strong>{{ $counts['systems'] }}</strong><div>Systems</div></div>
    <div><strong>{{ $counts['organs'] }}</strong><div>Organs</div></div>
    <div><strong>{{ $counts['diseases'] }}</strong><div>Diseases</div></div>
    <div><strong>{{ $counts['mental'] }}</strong><div>Mental topics</div></div>
    <div><strong>{{ $counts['products'] }}</strong><div>Homeopathy products</div></div>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <h3 style="margin-top:0;">Disclaimer</h3>
    <p style="margin:0;color:#444;">{{ $disclaimer }}</p>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <h3 style="margin-top:0;">Organs</h3>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>System</th><th>Gender</th><th></th></tr></thead>
        <tbody>
        @foreach ($organs as $organ)
            <tr>
                <td>{{ $organ['name'] }}</td>
                <td>{{ $organ['system_id'] }}</td>
                <td>{{ $organ['gender'] }}</td>
                <td><a href="{{ route('admin.health-explorer.organs.edit', $organ['slug'] ?? $organ['id']) }}">Edit</a></td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>

<div class="admin-card" style="margin-bottom:1rem;">
    <h3 style="margin-top:0;">Homeopathy products</h3>
    <table class="admin-table">
        <thead><tr><th>Name</th><th>Manufacturer</th><th>Potency</th><th></th></tr></thead>
        <tbody>
        @foreach ($products as $product)
            <tr>
                <td>{{ $product['name'] }}</td>
                <td>{{ $product['manufacturer'] ?? '—' }}</td>
                <td>{{ $product['potency'] ?? '—' }}</td>
                <td><a href="{{ route('admin.health-explorer.products.edit', $product['slug'] ?? $product['id']) }}">Edit</a></td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>

<div class="admin-card">
    <h3 style="margin-top:0;">Mental health topics</h3>
    <ul>
        @foreach ($mental as $item)
            <li><strong>{{ $item['name'] }}</strong> — {{ $item['summary'] }}</li>
        @endforeach
    </ul>
</div>
@endsection
