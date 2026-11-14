#!/usr/bin/env bash
# List HubSpot forms for DisplayAvenue portal using HUBSPOT_ACCESS_TOKEN.
set -euo pipefail
TOKEN="${HUBSPOT_ACCESS_TOKEN:-}"
if [[ -z "$TOKEN" && -f /workspace/agency/public/admin/.crm.secret.php ]]; then
  TOKEN="$(php -r '$c=include "/workspace/agency/public/admin/.crm.secret.php"; echo $c["hubspot_access_token"]??"";' 2>/dev/null || true)"
fi
if [[ -z "$TOKEN" ]]; then
  echo "Missing HUBSPOT_ACCESS_TOKEN. Add Cloud Agent secret or admin/.crm.secret.php"
  exit 1
fi

echo "Listing HubSpot forms…"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
CODE="$(curl -sS -o "$TMP" -w '%{http_code}' -H "Authorization: Bearer ${TOKEN}" \
  "https://api.hubapi.com/marketing/v3/forms/?limit=50" || true)"
if [[ "$CODE" != "200" ]]; then
  CODE="$(curl -sS -o "$TMP" -w '%{http_code}' -H "Authorization: Bearer ${TOKEN}" \
    "https://api.hubapi.com/forms/v2/forms" || true)"
fi
if [[ "$CODE" != "200" ]]; then
  echo "HubSpot API HTTP $CODE"
  head -c 500 "$TMP"; echo
  exit 2
fi
python3 - "$TMP" <<'PY'
import json,sys
path=sys.argv[1]
with open(path) as f:
  data=json.load(f)
rows=data.get("results") if isinstance(data,dict) else data
if not isinstance(rows,list):
  print("Unexpected response:", data)
  raise SystemExit(2)
print(f"{'FORM GUID':<40} NAME")
for f in rows:
  print(f"{(f.get('id') or f.get('guid') or ''):<40} {f.get('name','')}")
if not rows:
  print("(no forms — create one in HubSpot Marketing → Forms)")
PY
