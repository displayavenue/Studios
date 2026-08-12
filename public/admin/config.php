<?php
/**
 * DisplayAvenue Studios — CMS config
 * Change ADMIN_PASSWORD below, then delete or protect this file's visibility.
 */
return [
  // Login password for /admin
  'admin_password' => 'DisplayAdmin@2026',

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
