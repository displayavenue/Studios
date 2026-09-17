<?php
/**
 * DisplayAvenue Agency - CMS config
 * Change admin_password after first login.
 */
return [
  'admin_password' => 'DisplayAgency@2026',
  'session_ttl' => 60 * 60 * 8,
  'session_name' => 'da_agency_admin',
  'content_dir' => dirname(__DIR__) . '/content',
  // Optional: Google Places API key (Places Details / Find Place) for live review sync
  'places_api_key' => getenv('GOOGLE_PLACES_API_KEY') ?: '',
  // Meta Conversions API — prefer admin/.meta-capi.secret.php (not in git)
  'meta_capi_access_token' => getenv('META_CAPI_ACCESS_TOKEN') ?: '',
  'meta_capi_pixel_id' => getenv('META_CAPI_PIXEL_ID') ?: '',
  'meta_capi_test_event_code' => getenv('META_CAPI_TEST_EVENT_CODE') ?: '',
  'meta_capi_api_version' => getenv('META_CAPI_API_VERSION') ?: 'v21.0',
  'collections' => [
    'company' => 'Header, Footer & Company',
    'home' => 'Homepage',
    'google-reviews' => 'Google Reviews (GMB)',
    'awards' => 'Awards',
    'certifications' => 'Certifications',
    'contact' => 'Contact Form',
    'combos' => 'Industry × Service Pages',
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
    'citations' => 'Citation Directory & Outreach',
    'backlinks' => 'Backlink & Outreach Tracker',
    'tracking' => 'Tracking & Pixels',
    'settings' => 'Settings',
  ],
];
