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
  'admin_password_hash' => '$2y$10$Pc9nj9lSnMKKW8E7eaVxMev4hA4s6Po5IhhIKitECrwxJyh18cFhK',
  'session_ttl' => 60 * 60 * 4, // 4 hours
  'session_name' => 'da_agency_admin',
  'login_max_attempts' => 8,
  'login_lockout_seconds' => 900, // 15 minutes
  'notify_email' => 'info@displayavenue.com',
  'leads_file' => __DIR__ . '/data/leads.json',
  'content_dir' => dirname(__DIR__) . '/content',
  'collections' => [
    'company' => 'Header & Footer',
    'home' => 'Homepage Builder',
    'services' => 'Services Pages',
    'industries' => 'Industries',
    'packages' => 'Packages',
    'solutions' => 'Solutions',
    'ai' => 'AI Platform',
    'tools' => 'Free Tools',
    'cases' => 'Case Studies',
    'projects' => 'Portfolio',
    'resources' => 'Resources / Blog',
    'content' => 'Testimonials',
    'tracking' => 'Pixels & Tracking',
    'chatbot' => 'Website Chatbot',
    'catalogue' => 'PDF Catalogue',
    'shop' => 'Shop & Orders',
    'landings' => 'Ads Landing Pages',
    'settings' => 'Site Settings',
  ],
  // Optional: set an OpenAI key for smarter chatbot replies.
  // Leave empty to use built-in answers from website + CMS chatbot content.
  'openai_api_key' => '',
  'openai_model' => 'gpt-4o-mini',
  'uploads_dir' => dirname(__DIR__) . '/uploads',
  'catalogue_max_bytes' => 30 * 1024 * 1024, // 30 MB
  'image_max_bytes' => 12 * 1024 * 1024, // 12 MB raw upload (browser compresses first)
  // Razorpay — paste keys from https://dashboard.razorpay.com/app/keys
  // Leave blank until ready; shop checkout will show a setup message.
  'razorpay_key_id' => '',
  'razorpay_key_secret' => '',
  'shop_orders_file' => __DIR__ . '/data/shop-orders.json',
];
