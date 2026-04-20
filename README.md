# Clasificados

Puerto Rico classifieds platform — Next.js 15 + Payload CMS 3.0 + PostgreSQL 16.

## Stack

| Layer | Tech |
|---|---|
| Frontend/Backend | Next.js 15 (App Router) + Payload CMS 3.0 |
| Database | PostgreSQL 16 |
| Search | Meilisearch |
| Cache | Redis |
| Images | Cloudflare R2 (S3-compatible) |
| Email | Resend |
| Payments | Stripe |
| Hosting | Hetzner CX23 via Coolify |

---

## Local Development

### 1. Prerequisites

- Node.js ≥ 20
- pnpm (`npm install -g pnpm`)
- Docker Desktop (for local services)

### 2. Start services (Postgres + Redis + Meilisearch)

```bash
docker compose up postgres redis meilisearch -d
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — at minimum set PAYLOAD_SECRET and DATABASE_URL
```

Minimum `.env` for local dev:
```
PAYLOAD_SECRET=any-long-random-string
DATABASE_URL=postgresql://clasificados:yourpassword@localhost:5432/clasificados
POSTGRES_PASSWORD=yourpassword
REDIS_PASSWORD=yourredispassword
MEILI_MASTER_KEY=any-hex-string
```

### 4. Install and run

```bash
pnpm install
pnpm dev
```

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

The first time you open `/admin`, Payload will prompt you to create an admin user.

---

## Coolify Deployment

### Infrastructure setup on Hetzner

1. Create a Hetzner CX23 VPS (Ubuntu 24.04)
2. Install Coolify: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`
3. Access Coolify at `http://YOUR_SERVER_IP:8000`

### Add services in Coolify

In your Coolify project, add the following services from the **Service** marketplace:

| Service | Version | Notes |
|---|---|---|
| PostgreSQL | 16 | Note the generated `DATABASE_URL` |
| Redis | 7 | Note the generated `REDIS_URL` |
| Meilisearch | latest | Set `MEILI_MASTER_KEY` env var |

### Deploy the app

1. In Coolify → **New Resource** → **Application** → **GitHub**
2. Select your repository and branch (`main`)
3. Set **Build Pack**: `Dockerfile`
4. Set **Dockerfile location**: `./Dockerfile`
5. Set **Port**: `3000`

### ⚠️ Port conflict — fix before deploying

Your existing Coolify Postgres service has its **external** port mapped as `3000:5432`.
Next.js also uses port `3000`. **One of these must change before the app deploys:**

- **Option A (recommended):** In Coolify → your Postgres service → Ports → change the external mapping from `3000` to `5432` (i.e. `5432:5432`). The app only needs the *internal* port anyway.
- **Option B:** Set the Next.js app port to `3001` in Coolify → your app → Port.

The internal Coolify container URL (used by your app container) is always port 5432 regardless of external mapping:
```
postgres://postgres:PASSWORD@postgresql-database-es369mpez7rw7w038wvlla9b:5432/postgres
```

### Environment variables to paste in Coolify

Go to your application → **Environment Variables** tab and add:

```
# Required
PAYLOAD_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_SERVER_URL=https://your-domain.com

# From Coolify's PostgreSQL service (internal URL — container name on same network)
DATABASE_URL=postgres://postgres:PASSWORD@postgresql-database-es369mpez7rw7w038wvlla9b:5432/postgres

# From Coolify's Redis service
REDIS_URL=redis://:password@redis-service-host:6379

# From Coolify's Meilisearch service
MEILI_URL=http://meilisearch-service-host:7700
MEILI_MASTER_KEY=<your master key>

# Cloudflare R2 (get from Cloudflare dashboard → R2 → Manage API Tokens)
R2_BUCKET=clasificados-media
R2_ACCESS_KEY_ID=<from Cloudflare>
R2_SECRET_ACCESS_KEY=<from Cloudflare>
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://media.clasificadospr.com

# Resend (resend.com)
RESEND_API_KEY=re_...

# Stripe (dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Build args (needed because Payload touches DB at build time)

In Coolify → Build → **Build Arguments**:
```
DATABASE_URL=<same as above>
PAYLOAD_SECRET=<same as above>
```

### Domain & SSL

1. In Coolify → your app → **Domains** → add `clasificadospr.com`
2. Coolify auto-provisions Let's Encrypt SSL
3. Point Cloudflare DNS: `A record @ → your Hetzner IP` (proxy enabled)

### Post-deploy

1. Open `https://clasificadospr.com/admin`
2. Create your first admin user
3. Verify all 9 collections appear in the sidebar

---

## Collections

| Collection | Slug | Description |
|---|---|---|
| Users | `users` | Auth + roles (admin, moderator, user) |
| Media | `media` | Images/files (local dev → R2 in prod) |
| Listings | `listings` | Classifieds listings |
| Categories | `categories` | Listing categories with subcategories |
| Businesses | `businesses` | Restaurant & business directory |
| Events | `events` | Event discovery with time-window auto-tagging |
| Deals | `deals` | Ofertas del Día with countdown |
| Pueblos | `pueblos` | Puerto Rico municipality pages |
| Guides | `guides` | Category and location guide articles |

---

## Docker Compose (full stack, for testing production build locally)

```bash
# Copy and fill .env
cp .env.example .env

# Build and run everything
docker compose up --build
```

App at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Useful commands

```bash
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm generate:types         # Regenerate TypeScript types from collections
pnpm generate:importmap     # Regenerate admin import map
```
