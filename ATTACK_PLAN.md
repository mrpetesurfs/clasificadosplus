# Clasificados Plus — Attack Plan

## Current State (as of April 2026)

### What's working
- Payload CMS installed and configured (v3.33.0) with 14 collections defined
- PostgreSQL database connected on Coolify (shared between app deployments)
- Next.js 15 App Router with `next-intl` locale routing (es/en)
- Home page renders at `/es` and `/en` with translation support
- Footer with branding

### What's broken (being fixed)
- `/admin` throws `42P01 relation "users" does not exist` — the DB schema was never created
- Root cause: `push: true` doesn't run in production standalone builds
- **Fix in this PR**: switched to Payload migrations, new `start.sh` generates + runs schema on first boot

### Infrastructure
- Hosted on Coolify (self-hosted PaaS) at `178.104.194.172`
- Domain: `clasificadosplus.com` (App B in Coolify — this is the one we fix)
- Separate orphan deployment at sslip.io URL (App A) — stop this in Coolify after /admin is confirmed working
- Postgres 16 shared database

---

## Step 1 — Get /admin Working (do this now)

1. **Push this branch to git** and trigger a redeploy in Coolify for App B (clasificadosplus.com)
2. On first boot, `start.sh` will:
   - Detect the DB is fresh (no `payload_migrations` table)
   - Run `payload migrate:create --name initial` to generate schema SQL from the collection definitions
   - Run `payload migrate` to create all 14 collection tables + Payload internals
   - Start the Next.js server
3. Visit `https://clasificadosplus.com/admin` — it should load the Payload admin login
4. **Create the first admin user** via the admin setup screen
5. Stop the orphan App A (sslip.io) in Coolify — one click, just stop it

---

## Content Inventory

### Where the bot-written content is NOT
The git repo contains zero content. No MDX files, no JSON seeds, no `/content/` directory. The 14 Payload collections are schema-only (empty tables).

### Where the content likely is
Pete has described bot-written content for:
- Pueblo/town pages (78 municipalities in Puerto Rico)
- Guides and articles
- Category/listing descriptions

This content needs to be located (local folder, Google Docs, another repo, Notion) and imported. **Confirm with Pete where these files live before building import tooling.**

---

## Site Structure Proposal

### Page Types & Routes

```
/                          → redirect to /es (default locale)
/es                        → Home (listings feed, featured pueblos, guides)
/en                        → Home (English)

/es/pueblos                → Pueblo directory (all 78 municipalities)
/es/pueblos/[slug]         → Individual pueblo page (content, local listings, guides)

/es/guias                  → Guide/article index
/es/guias/[slug]           → Individual guide

/es/clasificados           → Listings feed (paginated, filterable)
/es/clasificados/[slug]    → Individual listing detail

/es/negocios               → Business directory
/es/negocios/[slug]        → Business profile

/es/eventos                → Events calendar
/es/eventos/[slug]         → Event detail

/es/p/[slug]               → Flat content pages (about, contact, etc.)
```

### Data Model (Collections Already Defined)

| Collection | Purpose | Priority |
|------------|---------|---------|
| Pueblos | Town pages — the SEO backbone of the site | 1 |
| Guides | Long-form articles/guides | 2 |
| Pages | Flat CMS pages (About, etc.) | 3 |
| Listings | Classified ads | 4 |
| Businesses | Business directory | 5 |
| Categories | Taxonomy for listings | 5 |
| Events | Event calendar | 6 |
| Media | Image uploads (all collections reference this) | — |
| Users | Auth (admin + organizer roles) | — |

---

## Prioritized Build Order

### Phase 1 — Admin working + content import (now)
- [x] Fix DB schema creation (this PR)
- [ ] Redeploy and verify /admin loads
- [ ] Create first admin user
- [ ] Stop orphan sslip.io app
- [ ] Locate bot-written content files and determine import path
- [ ] Import pueblo content into Payload (via admin UI or API seed script)
- [ ] Import guides/articles into Payload

### Phase 2 — Public routes for content (week 1)
- [ ] `app/[locale]/pueblos/page.tsx` — pueblo directory listing
- [ ] `app/[locale]/pueblos/[slug]/page.tsx` — individual pueblo page
- [ ] `app/[locale]/guias/page.tsx` — guide index
- [ ] `app/[locale]/guias/[slug]/page.tsx` — individual guide
- [ ] Navigation header component (link to pueblos, guias, clasificados)
- [ ] Home page updated to feature real content (hero, featured pueblos, recent guides)

### Phase 3 — Classified listings core (week 2)
- [ ] Expand `Listings` collection fields (price, category, pueblo, contact, images)
- [ ] `app/[locale]/clasificados/page.tsx` — paginated listings feed with filters
- [ ] `app/[locale]/clasificados/[slug]/page.tsx` — listing detail
- [ ] Category taxonomy wired to listings
- [ ] Search bar (client-side filter or Payload API query)

### Phase 4 — Businesses & events (week 3)
- [ ] Expand `Businesses` and `Events` collection fields
- [ ] Business directory pages
- [ ] Event calendar pages
- [ ] Organizer profile + event saves (already have collections for this)

### Phase 5 — Polish & launch (week 4)
- [ ] SEO: sitemap.xml, robots.txt, canonical tags
- [ ] Image optimization (Sharp is already in deps)
- [ ] Open Graph images for pueblos and guides
- [ ] Mobile layout pass
- [ ] Performance audit (Lighthouse)
- [ ] DNS / domain final check

---

## Technical Notes

### Collection field gaps to fix before Phase 3
The current `Listings`, `Businesses`, `Events` collections only have `title`, `slug`, `description`. Before building listing pages, expand these with real fields (price, location, images, contact info, category relationship). Do this via a Payload migration.

### Localization
Pueblos, Guides, and Pages collections are fully localized (es/en). Listings and Events are not — classified ads in PR don't need translation. This is the right split.

### Image handling
`Media` collection has `upload: true`. All image uploads go through Payload's admin UI. Make sure the upload directory is persisted in Coolify (mount a volume to `/app/public/media` or use S3).

### Environment variables needed (set in Coolify App B)
```
DATABASE_URI=postgresql://user:pass@host:5432/clasificados
PAYLOAD_SECRET=long-random-string
NEXT_PUBLIC_SERVER_URL=https://clasificadosplus.com
```

---

## The Two Sites Are Separate

Clasificados Plus (`clasificadosplus.com`) and the SBS site run on different Coolify servers. No shared infra, no shared DB, no shared code. Build them independently.
