<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Local/dev admin only — not a real business email.
        // Override with ADMIN_EMAIL / ADMIN_PASSWORD in .env when deploying.
        $email = env('ADMIN_EMAIL', 'admin@localhost.invalid');
        $password = env('ADMIN_PASSWORD', 'ChangeMeNow!123');

        if (app()->environment('production')
            && (str_contains($email, 'localhost.invalid') || $password === 'ChangeMeNow!123')) {
            throw new \RuntimeException(
                'Refusing to seed default admin credentials in production. Set ADMIN_EMAIL and ADMIN_PASSWORD first.'
            );
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Site Administrator',
                'password' => Hash::make($password),
                'is_admin' => true,
            ]
        );
    }
}
