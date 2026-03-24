# HANDOFF.md — Agoran Session State

> **Repo location:** Place this file at the **root** of the `agoran` repo.
> Update this file at the **end of every session** — no exceptions.
> Read this file at the **start of every session** before touching any code.

---

## Current State

| Field | Value |
|---|---|
| **Active Sprint** | Sprint 5 — File Delivery COMPLETE |
| **Current Branch** | feature/sprint-5-delivery |
| **Last Task Completed** | Sprint 5 — Download page, download count limit, WelcomeBuyer email |
| **Next Task** | Sprint 6 — Admin Dashboard |
| **Blocking?** | No |

---

## Sprint 0 Checklist

> Definition of Done: `npm run dev` works locally · CI green · Hello World on staging Vercel URL · All env vars in `.env.example`

- [x] Create GitHub repo: `agoran`
- [x] Initialize Next.js 14 with TypeScript + App Router + Tailwind
- [x] Install and configure shadcn/ui
- [x] Configure ESLint + Prettier + TypeScript strict mode
- [x] Set up Prisma (install, init, connect to Supabase)
- [x] Copy planning docs into repo (`storefront-docs/`, `.claude/QUALITY_GATES.md`, `CLAUDE.md`, `HANDOFF.md`)
- [x] Copy `design-tokens.ts` to `app/src/styles/design-tokens.ts`
- [x] Create `.env.example` with all required vars documented
- [x] Create GitHub Actions `ci.yml` (lint + typecheck on every PR)
- [x] Deploy: Hello World page created
- [x] Document local dev setup in `README.md`
- [x] Create vercel.json
- [x] Push to GitHub (main + develop + feature/sprint-0-setup)

---

## Sprint 1 Checklist

> Definition of Done: `prisma migrate status` shows all migrations applied · Seed data visible in Supabase · Prisma client generates without errors · `prisma migrate deploy` works

- [x] Write full Prisma schema (from Architecture doc Section 4.1)
- [x] Run first migration: `prisma db push` + migration history tracked via `prisma migrate resolve`
- [x] Verify all tables created in Supabase (Product, ProductAsset, ApiKey, Order, PageView, PipelineRun)
- [x] Write seed script (`prisma/seed.ts`): 3 sample products (ai, finance, health), 1 API key, 1 pipeline run
- [x] Run seed: `prisma db seed` — all records inserted successfully
- [x] Create `lib/db/index.ts` with Prisma client singleton (global instance for dev hot-reload safety)
- [x] Update `.env.example` with all required vars including new DATABASE_URL/DIRECT_URL
- [x] Update `prisma.config.ts` to load `.env.local` and configure datasource URLs (Prisma v7 requirement)
- [x] Stage and commit all changes
- [x] Push branch and open PR to `develop`

### Prisma v7 Notes (Important for next agent)
- **Prisma v7 breaking change:** `url` and `directUrl` are NOT supported in `schema.prisma` — they must be in `prisma.config.ts`
- **Prisma v7 breaking change:** `PrismaClient` requires a driver adapter — use `@prisma/adapter-pg` with `pg@8.16.3`
- **`prisma migrate dev` in CI:** hangs waiting for stdin — use `prisma db push` + `prisma migrate resolve --applied` for non-interactive environments
- **Seed config:** In Prisma v7, seed command is in `prisma.config.ts` under `migrations.seed`, NOT in `package.json`
- **DATABASE_URL** uses pgbouncer (port 6543) — schema operations and seeds must use DIRECT_URL (port 5432)

---

## Sprint 2 Checklist

> Definition of Done: All Agent API endpoints implemented · TypeScript zero errors · curl test script passes · PR open to develop

- [x] Create branch `feature/sprint-2-agent-api` from `develop`
- [x] Install dependencies: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `stripe`, `@anthropic-ai/sdk`, `bcryptjs`
- [x] `src/lib/api/auth.ts` — API key auth middleware (SHA-256 hash lookup against ApiKey table)
- [x] `src/lib/api/errors.ts` — Typed error response utilities
- [x] `src/lib/api/slug.ts` — Slug generation with collision handling (-2, -3 suffix)
- [x] `src/app/api/v1/health/route.ts` — Health check endpoint (no auth)
- [x] `src/app/api/v1/products/route.ts` — POST (create) and GET (list with filters)
- [x] `src/app/api/v1/products/[id]/route.ts` — GET (single) and PUT (update)
- [x] `src/app/api/v1/products/[id]/assets/route.ts` — Multipart upload to R2, magic byte validation
- [x] `src/lib/r2/client.ts` — Cloudflare R2 client (upload + signed download URLs)
- [x] `src/lib/llm/landing-page.ts` — Anthropic landing page content generation
- [x] `src/lib/stripe/client.ts` — Stripe client with production guard
- [x] `src/app/api/v1/products/[id]/publish/route.ts` — LLM→Stripe→DB publish flow (F-008)
- [x] `src/app/api/v1/products/[id]/analytics/route.ts` — PageView + Order analytics
- [x] `scripts/test-api.sh` — curl end-to-end test script
- [x] Fixed pre-existing `prisma.config.ts` TypeScript error (`directUrl` not in Datasource type)
- [x] `npx tsc --noEmit` — zero errors
- [x] Push branch and open PR to `develop`

### Sprint 2 Notes (Important for next agent)
- **ApiKey model** (not AgentKey): `db.apiKey.findFirst({ where: { keyHash, isActive: true } })`
- **ProductAsset**: uses `sizeBytes` (not `fileSizeBytes`), `assetType` enum: MAIN/BONUS/PREVIEW
- **Product.sector**: plain `String` (not enum) — any string value accepted
- **Product.targetAudience**: `String[]` — must pass array, not single string
- **ProductType enum**: PDF_GUIDE, CHECKLIST, TEMPLATE, SWIPE_FILE, MINI_COURSE, TOOLKIT (not COURSE)
- **Stripe API version**: `2026-02-25.clover` (pinned to installed stripe package version)
- **Analytics**: uses `PageView` model (count) + `Order` model (completed orders sum)
- **maxDuration = 30**: set on publish route for Vercel (LLM call can take up to 30s)

---

## Sprint 3 Checklist

> Definition of Done: Homepage shows seed products · Sector pages filter correctly · Product page renders all generated content · Correct meta tags · Mobile layout clean · Sitemap.xml valid · TypeScript zero errors · PR open to develop

- [x] Create branch `feature/sprint-3-storefront-ui` from `develop`
- [x] `src/app/(storefront)/layout.tsx` — Storefront layout with glass navbar
- [x] `src/components/storefront/ProductCard.tsx` — sector badge, title, description, price, view button
- [x] `src/components/storefront/ProductGrid.tsx` — responsive 1→2→3 column grid
- [x] `src/components/storefront/SectorNav.tsx` — sector links with icons
- [x] `src/components/storefront/ProductFilters.tsx` — client filter sidebar (sector, type, price, keyword)
- [x] `src/components/storefront/PageViewTracker.tsx` — client component fires trackPageView on mount
- [x] `src/app/(storefront)/page.tsx` — Homepage: hero + sector nav + featured 6 LIVE products (ISR 3600)
- [x] `src/app/(storefront)/[sector]/page.tsx` — Sector pages filtered by sector, redirect unknown → home (ISR 3600)
- [x] `src/app/(storefront)/products/page.tsx` — All products with filter sidebar + keyword ILIKE search (SSR)
- [x] `src/app/(storefront)/products/[slug]/page.tsx` — Full landing page: hero, bullets, audience, buy button, related, SEO meta (ISR 300)
- [x] `src/app/actions/pageview.ts` — Non-blocking server action creates PageView record
- [x] `src/app/sitemap.ts` — Dynamic sitemap from all LIVE products
- [x] TypeScript zero errors (`tsc --noEmit`)
- [x] Push branch and open PR to `develop`

### Sprint 3 Notes (Important for next agent)
- **Route groups:** `(storefront)` layout wraps all public pages. Root `page.tsx` was deleted; storefront handles `/`
- **Price field:** `priceCents` (Int) — divide by 100 to display as dollars
- **ProductStatus:** `LIVE` is the active status. `DRAFT`, `UNPUBLISHED`, `ARCHIVED` are not shown on storefront
- **Sector filter:** case-insensitive `mode: 'insensitive'` used in all Prisma queries
- **PageView tracking:** non-blocking — `PageViewTracker` client component fires server action on mount, errors swallowed
- **ISR:** Homepage + sector pages revalidate every 3600s; product pages every 300s. `revalidatePath` on publish (Sprint 2) handles immediate invalidation
- **Buy Now button:** disabled placeholder — Sprint 4 wires up Stripe Checkout

---

## Sprint 5 Checklist

> Definition of Done: Download link from email works · File served via R2 signed URL · Expired/invalid tokens handled gracefully · Download count tracked, max 5 enforced · TypeScript zero errors · lint clean · PR open to develop

- [x] Create branch `feature/sprint-5-delivery` from `feature/sprint-4-checkout` (Sprint 4 not yet merged to develop)
- [x] `src/app/(storefront)/download/[token]/page.tsx` — Download page: validates token, checks expiry + count, increments count, redirects to R2 signed URL (15 min)
- [x] Download count limit: max 5 (configurable via `DOWNLOAD_MAX_COUNT` env var)
- [x] Expired token: shows user-friendly error page with support contact
- [x] Limit reached: shows user-friendly error page with support contact
- [x] Invalid/not found token: 404
- [x] `WelcomeBuyer` email template built (Sprint 4); wired in `src/lib/resend/emails.ts` to send alongside order confirmation on first purchase
- [x] `.env.example` updated with `DOWNLOAD_MAX_COUNT`
- [x] `eslint.config.mjs` updated to ignore `src/generated/**` (Prisma generated files)
- [x] TypeScript zero errors (`npm run type-check`)
- [x] `npm run lint` — zero errors, zero warnings
- [x] HANDOFF.md updated
- [x] Push branch and open PR to `develop`

### Sprint 5 Notes (Important for next agent)
- **Download page:** server component at `(storefront)/download/[token]/page.tsx` — validates Order by `downloadToken`, checks status=COMPLETED, expiry, and count limit before redirecting to R2 signed URL
- **Signed URL expiry:** 900 seconds (15 minutes) — generated fresh on each valid download request
- **Download count limit:** controlled by `DOWNLOAD_MAX_COUNT` env var (default 5); increment happens before redirect
- **WelcomeBuyer email:** sent as separate email (alongside OrderConfirmation) when `isFirstPurchase === true` in `sendOrderConfirmationEmail()`
- **Sprint 4 email templates** (`src/emails/`): use inline HTML (not `@react-email/components`) — different from `emails/` directory which has older versions
- **ESLint:** `src/generated/**` added to ignore list — Prisma generated files contain `require()` calls that would otherwise fail the `@typescript-eslint/no-require-imports` rule

---

## Recent Work Log

### 2026-03-24 — Sprint 5 File Delivery (Claude Agent)
- Created branch `feature/sprint-5-delivery` from `feature/sprint-4-checkout` (Sprint 4 not merged to develop yet)
- Built download page `(storefront)/download/[token]/page.tsx`: looks up Order by `downloadToken`, validates status=COMPLETED + not expired + count < MAX, increments `downloadCount`, generates 15-min R2 signed URL, redirects buyer directly to R2
- Expired token shows user-friendly error page; download limit reached shows separate error page; invalid token returns 404
- `DOWNLOAD_MAX_COUNT` env var (default 5) controls max downloads per token
- Wired `WelcomeBuyer` email (built in Sprint 4) into `sendOrderConfirmationEmail()` — sent as separate Resend email alongside OrderConfirmation on first purchase
- Fixed ESLint: added `src/generated/**` to ignore list (Prisma generated files); fixed `react/no-unescaped-entities` in Sprint 4 email templates; removed stale `eslint-disable` comments
- TypeScript zero errors; lint zero errors/warnings

### 2026-03-24 — Sprint 3 Storefront UI (Claude Agent)
- Created branch `feature/sprint-3-storefront-ui` from `develop`
- Removed placeholder root `page.tsx`; added `(storefront)` route group with glass navbar layout
- Built `ProductCard`, `ProductGrid`, `SectorNav`, `ProductFilters`, `PageViewTracker` components (all using design tokens, zero inline glass classes)
- Homepage: hero tagline, sector nav (dynamic from DB), featured 6 LIVE products grid (ISR 3600)
- Sector pages: dynamic `[sector]/page.tsx`, unknown sectors redirect → homepage (ISR 3600)
- Products listing: SSR with `?q=`, `?sector=`, `?type=`, `?minPrice=`, `?maxPrice=` filters via Prisma ILIKE
- Product landing page: heroHeadline, heroSubheadline, bulletPoints, audienceStatement, SEO meta (og:image, twitter card), related products, Buy Now (disabled), `generateStaticParams` (ISR 300)
- Non-blocking pageview tracking: server action + client `PageViewTracker` component
- `sitemap.ts`: all LIVE product URLs + homepage + /products
- TypeScript zero errors

### 2026-03-23 — Sprint 2 Agent API (Claude Agent)
- Created branch `feature/sprint-2-agent-api` from `develop`
- Installed npm packages: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `stripe`, `@anthropic-ai/sdk`, `bcryptjs`, `@types/bcryptjs`
- Created `src/lib/api/auth.ts`: SHA-256 hash lookup against ApiKey table, updates `lastUsedAt` on each authenticated request
- Created `src/lib/api/errors.ts`: typed error codes and response helpers
- Created `src/lib/api/slug.ts`: slug generation with collision handling (appends -2, -3, etc.)
- Created `src/app/api/v1/health/route.ts`: health check (no auth required)
- Created `src/app/api/v1/products/route.ts`: POST (create with slug, validates ProductType enum) and GET (list with sector/status/agent_id filters)
- Created `src/app/api/v1/products/[id]/route.ts`: GET (with assets included) and PUT (partial update, guards LIVE products)
- Created `src/lib/r2/client.ts`: Cloudflare R2 client using AWS SDK v3, stores r2Key not signed URL (F-005)
- Created `src/app/api/v1/products/[id]/assets/route.ts`: multipart upload, validates size (100MB), extension, and magic bytes (F-007)
- Created `src/lib/llm/landing-page.ts`: Anthropic claude-haiku with 30s timeout, generates JSON landing page content
- Created `src/lib/stripe/client.ts`: Stripe client pinned to `2026-02-25.clover` with production key guard
- Created `src/app/api/v1/products/[id]/publish/route.ts`: LLM→Stripe→DB ordering (F-008), idempotent Stripe create, maxDuration=30
- Created `src/app/api/v1/products/[id]/analytics/route.ts`: PageView count + completed Order sum
- Created `scripts/test-api.sh`: curl end-to-end test script
- Fixed pre-existing `prisma.config.ts` TypeScript error: `directUrl` not a valid property in `Datasource` type
- All TypeScript checks pass: `npx tsc --noEmit` — zero errors

### 2026-03-23 — Sprint 1 Database (Claude Agent)
- Created branch `feature/sprint-1-database` from `develop`
- Wrote `.env.local` with all production credentials
- Updated `prisma/schema.prisma` with full schema: Product, ProductAsset, ApiKey, Order, PageView, PipelineRun + all enums
- Updated `prisma.config.ts` for Prisma v7: moved URL config from schema to config file, added dotenv loading for `.env.local`
- Applied schema to Supabase using `prisma db push` (DIRECT_URL) — all 6 tables + indexes created
- Generated Prisma client: `prisma generate` → `src/generated/prisma/`
- Created migration SQL file manually: `prisma/migrations/20260323000000_init/migration.sql`
- Marked migration as applied: `prisma migrate resolve --applied 20260323000000_init`
- Installed `@prisma/adapter-pg`, `pg@8.16.3`, `@types/pg@8.11.11`, `ts-node` for seed script
- Wrote `prisma/seed.ts` with 3 LIVE products (AI: $17, Finance: $27, Health: $37), 1 API key, 1 pipeline run
- Ran seed successfully: all records inserted via `prisma db seed`
- Created `src/lib/db/index.ts` with global Prisma client singleton using pg adapter
- Created `app/.env.example` with all required vars (no actual values)
- Updated `package.json` with `prisma.seed` script (for legacy compatibility)
- Updated `HANDOFF.md` (this file) with Sprint 1 completion

### 2026-03-13 — Sprint 0 Foundation (Claude Agent)
- Created GitHub repo `jeffjoslin/agoran` (private)
- Initialized Next.js 16 with TypeScript + App Router + Tailwind CSS
- Installed and configured shadcn/ui (New York style, Zinc base color)
- Installed Prisma + @prisma/client, ran `prisma init --datasource-provider postgresql`
- Configured TypeScript strict mode (noUnusedLocals, noUnusedParameters, noUncheckedIndexedAccess)
- Installed Prettier + eslint-config-prettier, created .prettierrc
- Copied all planning docs to repo (storefront-docs/, CLAUDE.md, HANDOFF.md, .claude/QUALITY_GATES.md)
- Copied design-tokens.ts to app/src/styles/design-tokens.ts
- Created Hello World page using Liquid Glass design tokens
- Created .env.example with all required env vars
- Created .github/workflows/ci.yml
- Created vercel.json, README.md, .gitignore
- Added glass shadow extensions to tailwind.config.ts
- Added type-check script to package.json
- Build verified: npm run type-check and npm run build both pass
- Pushed to GitHub: main, develop, feature/sprint-0-setup branches

### 2026-03-08 — Pre-Sprint Planning (Crypto Master)
- Authored full PRD, Architecture doc, Execution Plan (8 sprints), Quality Gates
- Authored Liquid Glass UI design guide
- Created CLAUDE.md (agent entry point with mandatory directives)
- Created HANDOFF.md (this file)
- Created design-tokens.ts (Liquid Glass design constants)
- All docs in `/opt/openclaw/agent/storefront-docs/` — ready to be committed to repo at Sprint 0

---

## Key Decisions (Locked)

| Decision | Value |
|---|---|
| Domain | agoran.ai |
| Brand | Agoran |
| Admin email | admin@bizooku.com |
| Design system | Liquid Glass |
| Pricing | Agent sets freely (dynamic) |
| Build order | Local first → Vercel staging → production |
| Repo name | `agoran` (GitHub: jeffjoslin/agoran) |
| Sectors | AI, Finance, Health, Marketing, Productivity (expandable) |

---

## Open Questions

- **CI workflow:** Token lacks `workflow` scope — `.github/workflows/ci.yml` needs to be added via GitHub web UI. Go to github.com/jeffjoslin/agoran → Actions → "set up a workflow yourself" → paste the YAML below:
```yaml
name: CI
on:
  pull_request:
    branches: [main, develop]
jobs:
  ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: app
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: app/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
```
- **Vercel:** Connect repo at vercel.com → Import → jeffjoslin/agoran → set env vars from `.env.example` → deploy

---

## How to Update This File

At the end of every session, update:
1. **Current State table** — branch, last task, next task, blocking?
2. **Sprint checklist** — tick completed items
3. **Recent Work Log** — one paragraph per session, dated
4. **Open Questions** — add any unresolved blockers or decisions needed from Jeff

---

*Last updated: 2026-03-23 | Updated by: Claude Agent (Sprint 1)*
