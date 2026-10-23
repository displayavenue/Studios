# Docker Compose — local infrastructure

Runs backing services for HomeopathyPharma local development. Application processes (Next.js, NestJS, worker) run on the host via `pnpm dev`.

## Quick start

```bash
# From homeopathypharma/ root
pnpm docker:up

# Or directly
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Tear down (volumes persist)
pnpm docker:down
```

Full bootstrap (env + docker + install + migrate + seed):

```bash
./scripts/dev-bootstrap.sh
```

## Services & ports

| Service | Image | Host port | Purpose |
|---------|-------|-----------|---------|
| **postgres** | `postgres:16-alpine` | **5432** | Primary database (`homeopathypharma`) |
| **redis** | `redis:7-alpine` | **6379** | Sessions, BullMQ, idempotency |
| **opensearch** | `opensearchproject/opensearch:2.19.0` | **9200** (HTTP), **9600** (perf analyzer) | Product/content search |
| **minio** | `minio/minio:latest` | **9000** (S3 API), **9001** (web console) | Object storage (S3-compatible) |
| **minio-init** | `minio/mc:latest` | — | One-shot bucket bootstrap |

### Credentials (development only)

| Service | User | Password / secret |
|---------|------|-------------------|
| Postgres | `hp` | `hp_dev_password` |
| Postgres DB name | `homeopathypharma` | — |
| MinIO | `minio` | `minio_secret` |
| MinIO bucket | `homeopathypharma` | auto-created by `minio-init` |

Match these values in `.env` / `.env.example` (`DATABASE_URL`, `REDIS_URL`, `S3_*`, `OPENSEARCH_NODE`).

## Health checks

All long-running services define Docker healthchecks:

- **Postgres:** `pg_isready`
- **Redis:** `PING`
- **OpenSearch:** cluster health `green` or `yellow`
- **MinIO:** `/minio/health/live`

Wait for healthy status before migrations:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

## Volumes

Named volumes persist data across restarts:

| Volume | Mount |
|--------|-------|
| `hp_postgres_data` | PostgreSQL data directory |
| `hp_redis_data` | Redis AOF |
| `hp_opensearch_data` | OpenSearch indices |
| `hp_minio_data` | Uploaded objects |

Reset all local data:

```bash
docker compose -f infrastructure/docker/docker-compose.yml down -v
```

## OpenSearch notes

- Security plugin **disabled** for local dev (`plugins.security.disabled=true`).
- JVM heap set to 512 MB — increase for large bulk reindex tests.
- Production clusters must enable TLS and fine-grained access control.

## MinIO console

Open http://localhost:9001 and log in with `minio` / `minio_secret`.

Public catalog assets should use the `public/` prefix inside the bucket; private doctor documents stay in a private prefix with presigned access only.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 5432 already in use | Stop local Postgres or change compose port mapping |
| OpenSearch fails to start | Ensure `vm.max_map_count >= 262144` on Linux host |
| MinIO bucket missing | Re-run `docker compose ... up minio-init` |
| Connection refused from API | Confirm `DATABASE_URL` host is `localhost` not `postgres` when API runs on host |

## Related

- [../nginx/README.md](../nginx/README.md) — production edge
- [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
