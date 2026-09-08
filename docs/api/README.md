# VELORA API Overview

Base URL: `/api`

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/signup` | Customer signup |
| POST | `/api/auth/logout` | Clear session |

## Cart & Checkout

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add item `{ productId, quantity }` |
| PATCH | `/api/cart` | Update/remove item |
| POST | `/api/checkout` | Create order |
| POST | `/api/payments/razorpay/confirm` | Verify payment |
| POST | `/api/payments/razorpay/webhook` | Razorpay webhooks (idempotent) |

## Catalog / Admin

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/products/import` | Batched supplier import |
| POST | `/api/products/discover` | Opportunity ranking |
| POST | `/api/suppliers` | Test/sync/disable supplier |
| GET | `/api/feeds/google` | Google Merchant TSV |
| GET | `/api/feeds/meta` | Meta catalog CSV |
| GET | `/api/serviceability?pincode=` | PIN serviceability |
| POST | `/api/admin/ai` | VELORA AI assistant |

All admin APIs require authenticated admin roles with RBAC permissions.
