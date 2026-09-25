<?php
/**
 * Copy to config.php on the server (deploy script does this from env).
 * Never commit real secrets.
 */
return [
  'key_id' => 'rzp_test_REPLACE',
  'key_secret' => 'REPLACE',
  'currency' => 'INR',
  // Set true only for local/dev emergency fallback
  'allow_demo' => false,
];
