# Coolify Deployment Checklist

This file is the exact paste-guide for Pete to configure Clasificados in Coolify.

---

## ⚠️ Fix port conflict first

Your Postgres service external port is mapped as `3000:5432`. The Next.js app also needs
external port `3000`. **You must change one before deploying.**

**Quickest fix:** In Coolify → your Postgres service → Ports → change `3000` → `5432`
(i.e., `5432:5432`). The *internal* port for your app stays `5432` either way.

---

## App configuration in Coolify

### Resource type
**Application → Docker**

### Build settings
| Field | Value |
|---|---|
| Build Pack | `Dockerfile` |
| Dockerfile location | `./Dockerfile` |
| Publish directory | (leave empty) |
| Port | `3000` |
| Domain | `clasificadosplus.com` |

### Build arguments
These are passed into the Dockerfile at build time (Payload touches the DB during build):

| Key | Value |
|---|---|
| `DATABASE_URL` | *(same as the env var below)* |
| `PAYLOAD_SECRET` | *(same as the env var below)* |

---

## Environment variables to paste in Coolify → App → Environment Variables

```
# ── Required ──────────────────────────────────────────────────────────────────
PAYLOAD_SECRET=<generate: openssl rand -base64 32>
NEXT_PUBLIC_SERVER_URL=https://clasificadosplus.com
NODE_ENV=production

# ── Database (Coolify internal URL) ───────────────────────────────────────────
DATABASE_URL=postgres://postgres:<YOUR_POSTGRES_PASSWORD>@postgresql-database-es369mpez7rw7w038wvlla9b:5432/postgres

# ── Redis (add Redis service in Coolify, use its internal URL) ────────────────
REDIS_URL=redis://:REDIS_PASSWORD@redis-service-hostname:6379

# ── Meilisearch (add Meilisearch service in Coolify, use its internal URL) ────
MEILI_URL=http://meilisearch-service-hostname:7700
MEILI_MASTER_KEY=<generate: openssl rand -hex 16>

# ── Cloudflare R2 ─────────────────────────────────────────────────────────────
# Leave blank to use local /public/media until R2 is ready
R2_BUCKET=clasificados-media
R2_ACCESS_KEY_ID=<from Cloudflare dashboard>
R2_SECRET_ACCESS_KEY=<from Cloudflare dashboard>
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://media.clasificadosplus.com

# ── Resend ────────────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...

# ── Stripe ────────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Minimum viable deploy (get /admin live fast)

If you want to ship now and add Stripe/Resend/R2/Redis/Meili later, these are the only
vars required to boot:

```
PAYLOAD_SECRET=<any long random string>
DATABASE_URL=postgres://postgres:<PASSWORD>@postgresql-database-es369mpez7rw7w038wvlla9b:5432/postgres
NEXT_PUBLIC_SERVER_URL=https://clasificadosplus.com
NODE_ENV=production
```

The app will boot and `/admin` will work. Uploads will fall back to local filesystem
(in-container, not persistent) until R2 is configured. That's fine for initial setup.

---

## About the existing crash-looping deploy

The existing Coolify app has **158+ restarts** from the previous failed setup.
Once you push the new scaffold to `main`, Coolify will auto-detect the push and
kick off a fresh build using the new Dockerfile. **The crash loop will stop** once
the new image successfully builds and starts. You do not need to manually stop or
delete the existing deployment — Coolify replaces it in-place on successful build.

---

## Post-deploy verification

1. Open `https://clasificadosplus.com/admin`
2. Payload will prompt: **Create first admin user** (email + password)
3. After login, verify the sidebar shows all 9 collections:
   - Users, Media, Listings, Categories, Businesses, Events, Deals, Pueblos, Guides

---

## DNS (Cloudflare)

Add an `A` record in Cloudflare:
| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `<Hetzner VPS IP>` | Proxied (orange cloud) |
| A | `www` | `<Hetzner VPS IP>` | Proxied |

Coolify auto-provisions Let's Encrypt SSL — keep Cloudflare SSL mode set to **Full (strict)**.
