<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — HOMEOPATHY PHARMA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="admin">
@php($route = request()->route()?->getName() ?? '')
<div class="admin-shell">
    <aside class="admin-sidebar">
        <h1>HP Admin</h1>
        <nav aria-label="Admin">
            <a href="{{ route('admin.dashboard') }}" class="{{ str_starts_with($route, 'admin.dashboard') ? 'is-active' : '' }}">Overview</a>
            <a href="{{ route('admin.products.index') }}" class="{{ str_starts_with($route, 'admin.products') ? 'is-active' : '' }}">Products</a>
            <a href="{{ route('admin.categories.index') }}" class="{{ str_starts_with($route, 'admin.categories') ? 'is-active' : '' }}">Categories</a>
            <a href="{{ route('admin.brands.index') }}" class="{{ str_starts_with($route, 'admin.brands') ? 'is-active' : '' }}">Brands</a>
            <a href="{{ route('admin.media.index') }}" class="{{ str_starts_with($route, 'admin.media') ? 'is-active' : '' }}">Media Library</a>
            <a href="{{ route('admin.orders.index') }}" class="{{ str_starts_with($route, 'admin.orders') ? 'is-active' : '' }}">Orders</a>
            <a href="{{ route('admin.doctors.index') }}" class="{{ str_starts_with($route, 'admin.doctors') ? 'is-active' : '' }}">Doctors</a>
            <a href="{{ route('admin.appointments.index') }}" class="{{ str_starts_with($route, 'admin.appointments') ? 'is-active' : '' }}">Appointments</a>
            <a href="{{ route('admin.articles.index') }}" class="{{ str_starts_with($route, 'admin.articles') || str_starts_with($route, 'admin.article-categories') ? 'is-active' : '' }}">Health Library</a>
            <a href="{{ route('admin.policies.index') }}" class="{{ str_starts_with($route, 'admin.policies') ? 'is-active' : '' }}">Policies</a>
            <a href="{{ route('admin.team.index') }}" class="{{ str_starts_with($route, 'admin.team') ? 'is-active' : '' }}">Founders &amp; Team</a>
            <a href="{{ route('admin.homepage.index') }}" class="{{ str_starts_with($route, 'admin.homepage') ? 'is-active' : '' }}">Homepage</a>
            <a href="{{ route('admin.reports.index') }}" class="{{ str_starts_with($route, 'admin.reports') ? 'is-active' : '' }}">Reports</a>
            <a href="{{ route('admin.audit-logs.index') }}" class="{{ str_starts_with($route, 'admin.audit-logs') ? 'is-active' : '' }}">Audit log</a>
            <a href="{{ route('admin.settings.edit') }}" class="{{ str_starts_with($route, 'admin.settings') ? 'is-active' : '' }}">Site Settings</a>
            <a href="{{ route('home') }}" target="_blank" rel="noopener">View site</a>
        </nav>
        <form method="post" action="{{ route('admin.logout') }}" style="margin-top:1.5rem;">
            @csrf
            <button class="btn btn-secondary" type="submit" style="width:100%;">Log out</button>
        </form>
    </aside>
    <div class="admin-main">
        @if (session('status'))
            <div class="admin-status" role="status">{{ session('status') }}</div>
        @endif
        @if ($errors->any())
            <div class="admin-errors" role="alert">
                <ul style="margin:0;padding-left:1.1rem;">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        @yield('content')
    </div>
</div>
</body>
</html>
