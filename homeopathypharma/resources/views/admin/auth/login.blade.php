<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin login — HOMEOPATHY PHARMA</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="admin">
<div class="admin-login">
    <div class="admin-card">
        <h1 style="margin-top:0;color:#0B5143;">Admin login</h1>
        <p style="color:#68746D;">Authorized administrators only.</p>
        @if ($errors->any())
            <div class="admin-errors">{{ $errors->first() }}</div>
        @endif
        <form method="post" action="{{ route('admin.login.submit') }}" class="admin-form">
            @csrf
            <label>Email
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="username">
            </label>
            <label>Password
                <input type="password" name="password" required autocomplete="current-password">
            </label>
            <label style="display:flex;gap:0.5rem;align-items:center;font-weight:500;">
                <input type="checkbox" name="remember" value="1"> Remember me
            </label>
            <button class="btn btn-primary" type="submit">Sign in</button>
        </form>
    </div>
</div>
</body>
</html>
