<?php
/**
 * DisplayAvenue Studios — CMS config
 *
 * Never commit a real password here. Set ONE of these on the server only:
 *   - 'admin_password_hash' (recommended): generate with
 *       php -r "echo password_hash('YourLongPassword', PASSWORD_DEFAULT), PHP_EOL;"
 *   - environment variable DA_ADMIN_PASSWORD_HASH (same format)
 * If neither is set, admin login is disabled.
 */
return [
  // bcrypt/argon hash of the /admin login password (see note above)
  'admin_password_hash' => getenv('DA_ADMIN_PASSWORD_HASH') ?: '',

  // Brute-force protection: lock an IP after this many failed logins
  'login_max_attempts' => 5,
  'login_lockout_seconds' => 15 * 60,

  // Origins allowed to call the admin API from a browser (same-site only)
  'allowed_origins' => [
    'https://displayavenue.com',
    'https://www.displayavenue.com',
  ],

  // Session lifetime (seconds)
  'session_ttl' => 60 * 60 * 8,

  // Content directory (relative to this file's parent: /admin -> /content)
  'content_dir' => dirname(__DIR__) . '/content',

  // Uploaded images (stored under /content/uploads, always saved as WebP)
  'uploads' => [
    // 0 = no app-level size limit (still subject to PHP upload_max_filesize on the server)
    'max_bytes' => 0,
    'webp_quality' => 82,
    // 0 = keep original dimensions; set e.g. 6000 to cap longest edge for very large files
    'max_edge_px' => 0,
    'allowed_mimes' => [
      'image/jpeg' => 'jpg',
      'image/png' => 'png',
      'image/webp' => 'webp',
      'image/gif' => 'gif',
    ],
  ],

  // Allowed content files (without .json)
  'collections' => [
    'home' => 'Homepage',
    'company' => 'Company & Contact',
    'services' => 'Services',
    'packages' => 'Packages & Pricing',
    'portfolio' => 'Portfolio',
    'content' => 'FAQs, Blog, Team, Industries',
    'tracking' => 'Tracking & Pixels',
    'settings' => 'Settings',
  ],
];
