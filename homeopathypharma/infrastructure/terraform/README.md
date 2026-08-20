# Terraform — infrastructure as code outline

Future IaC layout for HomeopathyPharma.com AWS (or cloud-agnostic) provisioning. Modules are **not implemented** — this README defines the target structure for Phase 6.

## Repository layout (planned)

```
infrastructure/terraform/
├── README.md                 # this file
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
└── modules/
    ├── network/              # VPC, subnets, NAT
    ├── postgres/             # RDS PostgreSQL 16
    ├── redis/                # ElastiCache Redis 7
    ├── opensearch/           # OpenSearch 2 domain
    ├── s3/                   # buckets + IAM policies
    ├── eks/                  # cluster + node groups
    ├── dns/                  # Route53 records
    └── secrets/              # Secrets Manager entries
```

## State management

| Environment | Backend |
|-------------|---------|
| Staging | S3 bucket + DynamoDB lock table |
| Production | Separate state bucket; restricted IAM |

Tag all resources: `Project=homeopathypharma`, `Environment=staging|production`.

## Core modules

### `network`

- VPC with public (ingress) and private (data, apps) subnets across 2+ AZs
- NAT gateway for outbound API integrations (Razorpay, Shiprocket, Google)

### `postgres`

- RDS PostgreSQL 16, Multi-AZ in production
- Automated backups (7–35 days per compliance)
- Parameter group tuned for Prisma connection pooling via PgBouncer sidecar or RDS Proxy

### `redis`

- ElastiCache Redis 7 cluster mode disabled initially (single shard)
- Encryption in transit + at rest

### `opensearch`

- OpenSearch 2.x domain — 3 data nodes production minimum
- Fine-grained access control enabled (unlike local docker compose)

### `s3`

| Bucket | Purpose |
|--------|---------|
| `hp-{env}-assets` | Public catalog images (CloudFront OAI) |
| `hp-{env}-private` | Doctor verification docs, exports |
| `hp-{env}-backups` | DB/log backups |

Lifecycle rules: transition infrequent assets to IA; expire temp upload prefixes after 7 days.

### `eks`

- Managed node groups or Fargate for web apps
- IRSA roles for API/worker → S3 access without static keys
- Cluster autoscaler

### `dns`

- `homeopathypharma.com` zone
- A/AAAA or CNAME to load balancer
- Subdomains: `api.`, `doctor.`, `admin.`

## Variables (examples)

| Variable | Description |
|----------|-------------|
| `environment` | `staging` \| `production` |
| `domain_name` | Root domain |
| `db_instance_class` | RDS size |
| `opensearch_instance_type` | Search capacity |

Secrets (Razorpay, session secret) are **not** in tfvars — reference Secrets Manager ARNs.

## CI integration

- `terraform plan` on PR (staging workspace)
- `terraform apply` on merge to release branch with manual approval for production
- Policy checks (tfsec/checkov) in CI

## Bootstrap order

1. `network`
2. `postgres`, `redis`, `opensearch`, `s3`
3. `eks`
4. `dns` + ACM certificates
5. Deploy k8s manifests (Helm or kubectl) referencing terraform outputs

## Cost controls

- Staging: single-AZ, smaller instances, scheduled shutdown for non-business hours
- Production: reserved instances for RDS/OpenSearch after steady state

## Related

- [../k8s/README.md](../k8s/README.md)
- [../docker/README.md](../docker/README.md)
- [../../docs/ASSUMPTIONS.md](../../docs/ASSUMPTIONS.md)
