<?php
/**
 * Optional LLM upgrade for DA Growth AI.
 * Copy to chat-local.php on the server (do not commit secrets).
 *
 * Free options:
 * - Gemini: https://aistudio.google.com/apikey  (provider: gemini)
 * - Groq:   https://console.groq.com/keys       (provider: groq)
 */
return [
  'provider' => 'gemini', // gemini | openai | groq | rules
  'api_key' => '', // paste key here
  'model' => 'gemini-2.0-flash',
  'whatsapp' => 'https://wa.me/919222122333',
  'phone' => 'tel:+919222122333',
  'strategy' => 'https://displayavenue.com/strategy/',
  'data' => 'https://displayavenue.com/data/',
  'contact' => 'https://displayavenue.com/contact',
  'catalogue' => 'https://displayavenue.com/catalogue/DisplayAvenue-Catalogue.pdf',
];
