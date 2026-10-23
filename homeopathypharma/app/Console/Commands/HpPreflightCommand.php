<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Local/production readiness checks. Does not deploy or touch remote hosts.
 */
class HpPreflightCommand extends Command
{
    protected $signature = 'hp:preflight {--strict : Fail on warnings as well as errors}';

    protected $description = 'Run HOMEOPATHY PHARMA launch readiness checks (no remote deploy)';

    public function handle(): int
    {
        $errors = [];
        $warnings = [];

        // Prefer getenv/$_ENV — Laravel's env() helper is null after `config:cache`.
        $env = static function (string $key, ?string $default = null): ?string {
            $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
            if ($value === false || $value === null || $value === '') {
                return $default;
            }

            return (string) $value;
        };

        if (! config('app.key')) {
            $errors[] = 'APP_KEY is empty. Run php artisan key:generate.';
        }

        if (config('app.debug') && app()->environment('production')) {
            $errors[] = 'APP_DEBUG must be false in production.';
        } elseif (config('app.debug')) {
            $warnings[] = 'APP_DEBUG is true (ok for local; must be false on Hostinger).';
        }

        if (app()->environment('production') && config('app.url') && str_starts_with((string) config('app.url'), 'http://')) {
            $warnings[] = 'APP_URL uses http:// — prefer https:// behind Hostinger SSL.';
        }

        $allowSqlite = filter_var($env('ALLOW_SQLITE_PRODUCTION', 'false'), FILTER_VALIDATE_BOOLEAN);
        if (config('database.default') === 'sqlite' && app()->environment('production')) {
            if ($allowSqlite) {
                $warnings[] = 'Production is using SQLite (ALLOW_SQLITE_PRODUCTION=true). Migrate to MySQL in hPanel when ready.';
            } else {
                $errors[] = 'Production should use MySQL (DB_CONNECTION=mysql), not SQLite.';
            }
        }

        $adminEmail = (string) $env('ADMIN_EMAIL', 'admin@localhost.invalid');
        $adminPassword = (string) $env('ADMIN_PASSWORD', 'ChangeMeNow!123');
        if (str_contains($adminEmail, 'localhost.invalid') || $adminPassword === 'ChangeMeNow!123') {
            if (app()->environment('production')) {
                $errors[] = 'Replace default ADMIN_EMAIL / ADMIN_PASSWORD before production.';
            } else {
                $warnings[] = 'Default local admin credentials are in use — change them before Hostinger deploy.';
            }
        }

        if (! $env('RAZORPAY_KEY_ID') || ! $env('RAZORPAY_KEY_SECRET')) {
            if (app()->environment('production')) {
                $warnings[] = 'Razorpay not configured — online checkout is disabled in production until keys are set.';
            } else {
                $warnings[] = 'Razorpay not configured — checkout will use clearly marked test payment mode.';
            }
        } elseif (! $env('RAZORPAY_WEBHOOK_SECRET')) {
            $warnings[] = 'RAZORPAY_WEBHOOK_SECRET is empty — webhooks cannot be verified safely.';
        }

        if (! is_writable(storage_path()) || ! is_writable(storage_path('logs'))) {
            $errors[] = 'storage/ must be writable by the PHP process.';
        }

        if (! is_writable(base_path('bootstrap/cache'))) {
            $errors[] = 'bootstrap/cache must be writable.';
        }

        if (! is_link(public_path('storage')) && ! is_dir(public_path('storage'))) {
            $warnings[] = 'public/storage link missing — create a symlink to storage/app/public (Hostinger may block artisan storage:link).';
        }

        $this->info('HOMEOPATHY PHARMA preflight ('.app()->environment().')');
        foreach ($errors as $error) {
            $this->error('✗ '.$error);
        }
        foreach ($warnings as $warning) {
            $this->warn('! '.$warning);
        }

        if ($errors === [] && $warnings === []) {
            $this->info('✓ No issues found.');
        }

        if ($errors !== [] || ($this->option('strict') && $warnings !== [])) {
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
