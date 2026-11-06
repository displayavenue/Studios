#!/usr/bin/env bash
# Add Hostinger DNS A records for strategy.displayavenue.com + data.displayavenue.com
# Same API as hostinger-api-mcp dns_records_update (PUT /api/dns/v1/zones/{domain}).
#
# Required env:
#   HOSTINGER_API_TOKEN  (preferred)  OR  API_TOKEN (deprecated alias)
# Optional:
#   DNS_DOMAIN           default: displayavenue.com
#   DNS_TTL              default: 300
#   DNS_TARGET_IP        if set, use this single A target; else copy apex A records
#   DRY_RUN=1            print payload only

set -euo pipefail

TOKEN="${HOSTINGER_API_TOKEN:-${API_TOKEN:-}}"
if [[ -z "$TOKEN" ]]; then
  echo "Missing HOSTINGER_API_TOKEN (or API_TOKEN)." >&2
  echo "Create one in hPanel → Profile → API, then export it." >&2
  exit 1
fi

DOMAIN="${DNS_DOMAIN:-displayavenue.com}"
TTL="${DNS_TTL:-300}"
API_BASE="${HOSTINGER_API_BASE:-https://developers.hostinger.com}"
AUTH=( -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" -H "Accept: application/json" )

echo "== Current public DNS =="
dig +short "${DOMAIN}" A || true
dig +short "strategy.${DOMAIN}" A || true
dig +short "data.${DOMAIN}" A || true

echo "== Fetch zone =="
ZONE_JSON="$(curl -sS -m 30 "${AUTH[@]}" "${API_BASE}/api/dns/v1/zones/${DOMAIN}")"
echo "$ZONE_JSON" | head -c 400; echo

if echo "$ZONE_JSON" | grep -qi 'Unauthenticated\|unauthenticated\|Invalid\|401'; then
  echo "Hostinger API rejected the token." >&2
  exit 1
fi

if [[ -n "${DNS_TARGET_IP:-}" ]]; then
  TARGETS=("$DNS_TARGET_IP")
else
  mapfile -t TARGETS < <(dig +short "${DOMAIN}" A | grep -E '^[0-9.]+$' | sort -u)
fi

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "No apex A records found for ${DOMAIN}; set DNS_TARGET_IP." >&2
  exit 1
fi

echo "== Targets for strategy + data A records: ${TARGETS[*]} =="

RECORDS_JSON="$(python3 - <<PY
import json, os
targets = """${TARGETS[*]}""".split()
ttl = int(${TTL})
zone = []
for name in ("strategy", "data"):
    zone.append({
        "name": name,
        "type": "A",
        "ttl": ttl,
        "records": [{"content": ip} for ip in targets],
    })
print(json.dumps({"overwrite": False, "zone": zone}))
PY
)"

echo "== PUT payload (overwrite=false) =="
echo "$RECORDS_JSON"

if [[ "${DRY_RUN:-}" == "1" ]]; then
  echo "DRY_RUN=1 — not applying."
  exit 0
fi

echo "== Applying =="
RESP="$(curl -sS -m 45 -X PUT "${AUTH[@]}" \
  -d "$RECORDS_JSON" \
  -w "\nHTTP:%{http_code}\n" \
  "${API_BASE}/api/dns/v1/zones/${DOMAIN}")"
echo "$RESP"

echo "== Waiting briefly, then re-check =="
sleep 5
for host in "strategy.${DOMAIN}" "data.${DOMAIN}"; do
  echo -n "$host: "
  dig +short "$host" A | tr '\n' ' '
  echo
done

echo "Done. SSL on Hostinger CDN may take a few minutes after DNS propagates."
