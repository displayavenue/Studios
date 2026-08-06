<?php
/**
 * DisplayAvenue Agency - CMS config
 *
 * Password is stored as a bcrypt hash only. To rotate:
 *   php -r "echo password_hash('YOUR_NEW_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
 * then replace admin_password_hash below.
 */
declare(strict_types=1);

// Block direct HTTP access (include/require from api.php still works).
if (PHP_SAPI !== 'cli') {
  $script = realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) ?: '';
  if ($script !== '' && realpath(__FILE__) === $script) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo 'Forbidden';
    exit;
  }
}

return [
  // bcrypt hash — never store plaintext passwords here
  'admin_password_hash' => '$2y$10$eoOA816R3D2Bacfmzl3a..JD/qH2yqPtmETucI0XQ1NlJbw/vRKK6',
  'session_ttl' => 60 * 60 * 4, // 4 hours
  'session_name' => 'da_agency_admin',
  'login_max_attempts' => 8,
  'login_lockout_seconds' => 900, // 15 minutes
  'content_dir' => dirname(__DIR__) . '/content',
  'collections' => [
    'company' => 'Header, Footer & Company',
    'home' => 'Homepage',
    'services' => 'Services (all pages)',
    'industries' => 'Industries',
    'packages' => 'Packages',
    'solutions' => 'Solutions',
    'ai' => 'AI Platform Suites',
    'tools' => 'Free Tools',
    'cases' => 'Case Studies',
    'projects' => 'Portfolio Projects',
    'resources' => 'Resources',
    'content' => 'Testimonials & Extras',
    'tracking' => 'Tracking & Pixels',
    'settings' => 'Settings',
  ],
];
