<?php
/**
 * DisplayAvenue Agency — CMS config
 * Change admin_password after first login.
 */
return [
  'admin_password' => 'DisplayAgency@2026',
  'session_ttl' => 60 * 60 * 8,
  'session_name' => 'da_agency_admin',
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
