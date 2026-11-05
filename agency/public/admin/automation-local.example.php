<?php
/**
 * Copy to automation-local.php on the server (not in git).
 * Fill at least ONE WhatsApp and/or SMS channel so contact leads alert you.
 *
 * CallMeBot (easiest WhatsApp owner alerts):
 *   1. Add +34 644 66 64 35 in WhatsApp and send: I allow callmebot to send me messages
 *   2. Bot replies with your apikey
 *   3. Set whatsapp_provider = callmebot and fill phone + apikey
 *
 * Meta Cloud API: create a WhatsApp Business app, then fill meta_* fields.
 * MSG91 SMS (India): set sms_provider = msg91 + authkey + sender + template_id (optional).
 */
return [
  // callmebot | meta | webhook | ''
  'whatsapp_provider' => 'callmebot',
  'whatsapp_phone' => '919222122333', // owner phone, country code, no +
  'callmebot_apikey' => '',

  // Meta WhatsApp Cloud API
  'meta_token' => '',
  'meta_phone_number_id' => '',
  // Optional approved template for first outreach; leave blank to send plain text (works for own number testing)
  'meta_template_name' => '',
  'meta_template_lang' => 'en',

  // Generic webhook (Interakt / Wati / n8n / Make.com)
  'whatsapp_webhook_url' => '',
  'whatsapp_webhook_token' => '',

  // msg91 | twilio | webhook | ''
  'sms_provider' => '',
  'sms_phone' => '919222122333',
  'msg91_authkey' => '',
  'msg91_sender' => 'DISPAY',
  'msg91_template_id' => '',
  'twilio_sid' => '',
  'twilio_token' => '',
  'twilio_from' => '',
  'sms_webhook_url' => '',
];
