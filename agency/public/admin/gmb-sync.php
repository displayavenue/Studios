<?php
declare(strict_types=1);

/**
 * Sync Google Business Profile reviews into content/google-reviews.json
 * using the Google Places API (Find Place + Place Details).
 *
 * Requires places_api_key in config.php or GOOGLE_PLACES_API_KEY env.
 */

function da_http_get_json(string $url): array {
  $ctx = stream_context_create([
    'http' => [
      'method' => 'GET',
      'timeout' => 20,
      'header' => "Accept: application/json\r\nUser-Agent: DisplayAvenue-CMS/1.0\r\n",
    ],
  ]);
  $raw = @file_get_contents($url, false, $ctx);
  if ($raw === false) {
    return ['ok' => false, 'error' => 'Network request failed'];
  }
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    return ['ok' => false, 'error' => 'Invalid API response'];
  }
  return ['ok' => true, 'data' => $data];
}

function da_find_place_id(string $apiKey, string $query): array {
  $url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' . http_build_query([
    'input' => $query,
    'inputtype' => 'textquery',
    'fields' => 'place_id,name,formatted_address',
    'key' => $apiKey,
  ]);
  $res = da_http_get_json($url);
  if (!$res['ok']) return $res;
  $data = $res['data'];
  if (($data['status'] ?? '') !== 'OK' || empty($data['candidates'][0]['place_id'])) {
    return [
      'ok' => false,
      'error' => 'Place not found (' . ($data['status'] ?? 'UNKNOWN') . '). Check placeQuery or set placeId manually.',
    ];
  }
  return [
    'ok' => true,
    'place_id' => (string)$data['candidates'][0]['place_id'],
    'name' => (string)($data['candidates'][0]['name'] ?? ''),
  ];
}

function da_place_details(string $apiKey, string $placeId): array {
  $url = 'https://maps.googleapis.com/maps/api/place/details/json?' . http_build_query([
    'place_id' => $placeId,
    'fields' => 'name,rating,user_ratings_total,url,reviews,formatted_address',
    'reviews_sort' => 'newest',
    'key' => $apiKey,
  ]);
  $res = da_http_get_json($url);
  if (!$res['ok']) return $res;
  $data = $res['data'];
  if (($data['status'] ?? '') !== 'OK' || empty($data['result'])) {
    return [
      'ok' => false,
      'error' => 'Place details failed (' . ($data['status'] ?? 'UNKNOWN') . ')',
    ];
  }
  return ['ok' => true, 'result' => $data['result']];
}

/**
 * @param array $config CMS config
 * @param array $current Existing google-reviews.json
 * @return array{ok:bool,data?:array,error?:string,message?:string}
 */
function da_sync_google_reviews(array $config, array $current): array {
  $apiKey = trim((string)($config['places_api_key'] ?? ''));
  if ($apiKey === '') {
    return [
      'ok' => false,
      'error' => 'Add a Google Places API key to admin/config.php (places_api_key) or set GOOGLE_PLACES_API_KEY, then click Sync again.',
    ];
  }

  $placeId = trim((string)($current['placeId'] ?? ''));
  $query = trim((string)($current['placeQuery'] ?? 'Display Avenue Mumbai'));

  if ($placeId === '') {
    $found = da_find_place_id($apiKey, $query);
    if (!$found['ok']) return $found;
    $placeId = $found['place_id'];
  }

  $details = da_place_details($apiKey, $placeId);
  if (!$details['ok']) return $details;
  $result = $details['result'];

  $reviews = [];
  foreach (($result['reviews'] ?? []) as $review) {
    $reviews[] = [
      'author' => (string)($review['author_name'] ?? 'Google user'),
      'rating' => (int)($review['rating'] ?? 5),
      'relativeTime' => (string)($review['relative_time_description'] ?? ''),
      'text' => (string)($review['text'] ?? ''),
      'profilePhotoUrl' => (string)($review['profile_photo_url'] ?? ''),
      'authorUrl' => (string)($review['author_url'] ?? ''),
    ];
  }

  if (!$reviews) {
    return [
      'ok' => false,
      'error' => 'Google returned no reviews for this place yet. Place ID was saved so you can retry later.',
      'data' => array_merge($current, [
        'placeId' => $placeId,
        'businessName' => (string)($result['name'] ?? $current['businessName'] ?? 'Display Avenue'),
        'rating' => (float)($result['rating'] ?? $current['rating'] ?? 0),
        'reviewCount' => (int)($result['user_ratings_total'] ?? $current['reviewCount'] ?? 0),
        'lastSyncedAt' => gmdate('c'),
        'syncSource' => 'places-api',
      ]),
    ];
  }

  $mapsUrl = (string)($result['url'] ?? $current['mapsUrl'] ?? '');
  $data = array_merge($current, [
    'enabled' => true,
    'businessName' => (string)($result['name'] ?? $current['businessName'] ?? 'Display Avenue'),
    'placeId' => $placeId,
    'rating' => (float)($result['rating'] ?? 0),
    'reviewCount' => (int)($result['user_ratings_total'] ?? count($reviews)),
    'mapsUrl' => $mapsUrl ?: ($current['mapsUrl'] ?? ''),
    'profileUrl' => $mapsUrl ?: ($current['profileUrl'] ?? ''),
    'writeReviewUrl' => $current['writeReviewUrl'] ?? $mapsUrl,
    'lastSyncedAt' => gmdate('c'),
    'syncSource' => 'places-api',
    'reviews' => $reviews,
  ]);

  return [
    'ok' => true,
    'message' => 'Synced ' . count($reviews) . ' Google reviews (rating ' . $data['rating'] . ', ' . $data['reviewCount'] . ' total).',
    'data' => $data,
  ];
}
