#!/usr/bin/env bash
# Add Google Search Console DNS TXT verification for displayavenuerealty.com
# via Hostinger DNS API.
#
# Usage:
#   HOSTINGER_API_TOKEN='...' ./scripts/add-gsc-txt-dns.sh
# Optional:
#   DOMAIN=displayavenuerealty.com
#   GSC_TXT='google-site-verification=4tMpO9M2uzQl_AN3Ohnt3H4zRSWl80mx5UQ2crNZMdQ'
set -euo pipefail

TOKEN="${HOSTINGER_API_TOKEN:?Set HOSTINGER_API_TOKEN from hPanel → Account → API}"
DOMAIN="${DOMAIN:-displayavenuerealty.com}"
GSC_TXT="${GSC_TXT:-google-site-verification=4tMpO9M2uzQl_AN3Ohnt3H4zRSWl80mx5UQ2crNZMdQ}"
API="https://developers.hostinger.com/api/dns/v1/zones/${DOMAIN}"

echo "Checking current DNS zone for ${DOMAIN}…"
HTTP=$(curl -sS -o /tmp/hostinger-dns-zone.json -w '%{http_code}' \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Accept: application/json' \
  "${API}")
echo "GET zone HTTP ${HTTP}"
if [[ "${HTTP}" != "200" ]]; then
  echo "API auth/zone failed. Body:"
  head -c 500 /tmp/hostinger-dns-zone.json; echo
  exit 1
fi

echo "Adding TXT @ → ${GSC_TXT} (overwrite=false, keeps existing TXT)…"
HTTP=$(curl -sS -o /tmp/hostinger-dns-put.json -w '%{http_code}' \
  -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d "$(python3 - <<PY
import json
print(json.dumps({
  "overwrite": False,
  "zone": [{
    "name": "@",
    "type": "TXT",
    "ttl": 300,
    "records": [{"content": """${GSC_TXT}"""}]
  }]
}))
PY
)" \
  "${API}")
echo "PUT zone HTTP ${HTTP}"
head -c 500 /tmp/hostinger-dns-put.json; echo
[[ "${HTTP}" == "200" ]] || exit 1

echo "Waiting briefly, then querying public TXT…"
sleep 3
dig TXT "${DOMAIN}" +short || true
dig TXT @"8.8.8.8" "${DOMAIN}" +short || true
echo "Done. If dig is empty, wait for DNS propagation then re-verify in Search Console."
