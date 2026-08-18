<?php
/**
 * Copy to social-local.php on the server (do not commit secrets).
 *
 * Recommended path for 10+ platforms with one key:
 *   https://www.ayrshare.com/  → set ayrshare_api_key
 *
 * Direct APIs (optional extras):
 *   Meta Graph (Facebook Page + Instagram Business)
 *   LinkedIn Organization
 *   Google Business Profile (localPosts)
 *
 * AI captions (optional — falls back to template engine):
 *   Reuse Gemini/OpenAI key here or leave blank to use chat-local.php
 */
return [
  // Shared secret for social-cron.php?key=...
  'cron_key' => 'change-me-to-a-long-random-string',

  // Unified multi-platform publisher (Facebook, Instagram, LinkedIn, GMB, X, TikTok, Pinterest, Threads, Reddit, Telegram, YouTube…)
  'ayrshare_api_key' => '',
  // Optional profile key if using Ayrshare user profiles
  'ayrshare_profile_key' => '',

  // Meta (Facebook Page + Instagram)
  'meta_page_id' => '',
  'meta_page_access_token' => '',
  'meta_ig_user_id' => '',

  // LinkedIn
  'linkedin_access_token' => '',
  'linkedin_author_urn' => '', // urn:li:organization:XXXX or urn:li:person:XXXX

  // Google Business Profile
  'gbp_access_token' => '',
  'gbp_account_name' => '', // accounts/XXXX
  'gbp_location_name' => '', // accounts/XXXX/locations/YYYY

  // AI
  'ai_provider' => 'gemini', // gemini | openai | groq | ''
  'ai_api_key' => '',
  'ai_model' => 'gemini-2.0-flash',

  // Webhook fallback (Make.com / n8n / Buffer custom)
  'publish_webhook_url' => '',
];
