# nginx — edge / TLS termination

Production edge configuration placeholder. Local development hits Next.js and NestJS directly; nginx sits in front in staging and production.

## Responsibilities

1. **TLS termination** — HTTPS for all public hostnames
2. **Reverse proxy** — route to web, doctor, admin, and API upstreams
3. **Security headers** — baseline hardening for all responses
4. **Rate limiting** — optional edge throttling (API also rate-limits in Redis)
5. **Static asset caching** — long cache for hashed Next.js assets; no cache on HTML/API

## Suggested hostnames

| Host | Upstream | Notes |
|------|----------|-------|
| `homeopathypharma.com` | `web:3000` | Storefront |
| `doctor.homeopathypharma.com` | `doctor:3001` | Doctor portal |
| `admin.homeopathypharma.com` | `admin:3002` | Admin (IP allowlist recommended) |
| `api.homeopathypharma.com` | `api:4000` | JSON API (`/v1`) |

Use separate origins for admin/doctor to simplify cookie scope and CSP.

## TLS

- Certificates via Let's Encrypt (certbot) or cloud load balancer managed certs.
- TLS 1.2 minimum; prefer TLS 1.3.
- HSTS after HTTPS verified: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (submit preload only when stable).
- Redirect HTTP → HTTPS at edge.

## Security headers (recommended)

Apply to HTML responses; adjust CSP per app after auditing inline scripts:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;
```

API responses:

```nginx
add_header Cache-Control "no-store" always;
add_header X-Content-Type-Options "nosniff" always;
```

## Proxy settings

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_http_version 1.1;
proxy_set_header Connection "";
```

For Next.js HMR in dev, do not route through this config — use direct ports.

## Webhook routes

Expose `POST /v1/webhooks/*` on the API hostname only. Optional IP allowlisting for Razorpay/Shiprocket source ranges — **do not** rely on IP alone; signature verification is mandatory (see [SECURITY_THREAT_MODEL.md](../../docs/SECURITY_THREAT_MODEL.md)).

## Body size limits

| Route | Limit |
|-------|-------|
| JSON API | 1 MB default |
| Upload initiation | 10 MB metadata |
| Direct upload | Use presigned S3 URLs — not through nginx |

## Future artifacts

When ready for production, add versioned configs here:

- `nginx.conf` — main config
- `snippets/security-headers.conf`
- `sites/homeopathypharma.conf` — server blocks

## Related

- [../docker/README.md](../docker/README.md)
- [../k8s/README.md](../k8s/README.md)
- [../../docs/SECURITY_THREAT_MODEL.md](../../docs/SECURITY_THREAT_MODEL.md)
