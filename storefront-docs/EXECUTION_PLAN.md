# SkillForge Storefront — Execution Plan
**Version:** 1.1  
**Status:** Approved — Ready for Development  
**Date:** 2026-03-08  
**Author:** Crypto Master (AI Architect)

---

## Philosophy

- **Shipping > Perfection.** Each sprint ends with something testable.
- **API-first.** The Agent Publishing API is built before the storefront UI — SkillForge can start publishing before the front-end is pretty.
- **One branch per sprint feature.** `feature/sprint-X-description` → PR → `develop` → staging → `main` (production).
- **No sprint starts until the previous one is merged and staging is clean.**
- **Every sprint has a clear "done" definition.** No ambiguity.

---

## Branch Strategy

```
main                    ← Production (auto-deploys to skillforge.io)
│
└─ develop              ← Staging (auto-deploys to staging.skillforge.io)
       │
       ├─ feature/sprint-0-setup
       ├─ feature/sprint-1-database
       ├─ feature/sprint-2-agent-api
       ├─ feature/sprint-3-storefront-ui
       ├─ feature/sprint-4-checkout
       ├─ feature/sprint-5-delivery
       ├─ feature/sprint-6-admin
       ├─ feature/sprint-7-integration
       └─ hotfix/...    ← Emergency production fixes (branch from main, PR to main + develop)
```

**Rules:**
- Never commit directly to `main` or `develop`
- Every feature branch is a PR into `develop`
- `develop → main` is a manual merge (Jeff approves / we agree it's ready)
- Hotfixes branch from `main`, not `develop`

---

## Sprint Overview

| Sprint | Name | Duration | Deliverable |
|---|---|---|---|
| 0 | Foundation | 1 day | Repo + tooling + env + CI live |
| 1 | Database | 1–2 days | Schema deployed, seed data, migrations working |
| 2 | Agent API | 2–3 days | Full API live, SkillForge can publish to staging |
| 3 | Storefront UI | 2–3 days | Homepage, sector pages, product pages live |
| 4 | Checkout | 1–2 days | Stripe checkout working end-to-end on staging |
| 5 | Delivery | 1–2 days | File upload, R2 storage, download flow |
| 6 | Admin Dashboard | 2 days | Jeff can see products, revenue, pipeline runs |
| 7 | Integration & Polish | 2 days | SkillForge wired to storefront, full end-to-end test |
| 8 | Launch | 1 day | Production deploy, monitoring, go live |

**Estimated total:** 13–18 working days (with a focused coding agent)

---

## Sprint 0 — Foundation
**Branch:** `feature/sprint-0-setup`  
**Goal:** Empty project that deploys successfully. CI green. All env vars documented.

### Tasks
- [ ] Create GitHub repo: `skillforge-storefront`
- [ ] Initialize Next.js 14 project with TypeScript + App Router + Tailwind
- [ ] Install and configure shadcn/ui
- [ ] Configure ESLint + Prettier + TypeScript strict mode
- [ ] Set up Prisma (install, init, connect to Supabase)
- [ ] Create `.env.example` with all required vars documented
- [ ] Set up Vercel project, connect to GitHub repo
- [ ] Configure preview deployments (feature branches) + staging (develop) + prod (main)
- [ ] Create GitHub Actions `ci.yml`: lint + typecheck on every PR
- [ ] Deploy: a "Hello World" Next.js page live at staging URL
- [ ] Document local dev setup in `README.md`

### Done When
✅ `npm run dev` works locally  
✅ Push to `feature/sprint-0-setup` triggers CI (lint + typecheck pass)  
✅ Merge to `develop` → staging URL shows Hello World page  
✅ All env var names documented in `.env.example`

---

## Sprint 1 — Database
**Branch:** `feature/sprint-1-database`  
**Goal:** Full schema deployed to Supabase. Seed data. Migration workflow established.

### Tasks
- [ ] Write full Prisma schema (from Architecture doc Section 4.1)
- [ ] Run first migration: `prisma migrate dev --name init`
- [ ] Verify all tables created in Supabase dashboard
- [ ] Write seed script (`prisma/seed.ts`):
  - 3 sample products in LIVE status (one per sector: ai, finance, health)
  - 1 API key record
  - 1 pipeline run record
- [ ] Run seed: `prisma db seed`
- [ ] Test basic Prisma queries in a test script
- [ ] Set up `lib/supabase/server.ts` and `lib/supabase/client.ts`
- [ ] Verify Row Level Security doesn't block Prisma (use service role key)
- [ ] Document: how to run migrations in staging vs production

### Done When
✅ `prisma migrate status` shows all migrations applied on staging  
✅ Seed data visible in Supabase Table Editor  
✅ Prisma client generates without errors  
✅ `prisma migrate deploy` works for production deployment  

---

## Sprint 2 — Agent Publishing API
**Branch:** `feature/sprint-2-agent-api`  
**Goal:** Full Agent API live on staging. SkillForge can create, upload, and publish a product.

### Tasks
- [ ] Build API key authentication middleware (`lib/api/auth.ts`)
- [ ] Build standardized error response utility (`lib/api/errors.ts`)
- [ ] `GET /api/v1/health` — no auth, returns `{ status: "ok" }`
- [ ] `POST /api/v1/products` — create product, return product_id
  - Input validation (title, price, sector, product_type required)
  - Auto-generate slug from title
  - Status defaults to DRAFT
- [ ] `GET /api/v1/products` — list with filters (sector, status, agent_id)
- [ ] `GET /api/v1/products/:id` — single product
- [ ] `PUT /api/v1/products/:id` — partial update
- [ ] Set up Cloudflare R2 client (`lib/r2/client.ts`)
  - S3-compatible client pointed at R2 endpoint
  - Helper: `uploadToR2(key, buffer, mimeType)`
  - Helper: `getSignedDownloadUrl(key, expiresIn)`
- [ ] `POST /api/v1/products/:id/assets` — multipart upload → R2
  - Parse multipart form (use `formidable` or Next.js built-in)
  - Stream file to R2
  - Create `ProductAsset` record
- [ ] Set up Anthropic client for landing page generation (`lib/llm/landing-page.ts`)
  - Input: title, description, sector, target_audience
  - Output: heroHeadline, heroSubheadline, bulletPoints[], audienceStatement, metaTitle, metaDescription
- [ ] Set up Stripe client (`lib/stripe/client.ts`)
- [ ] `POST /api/v1/products/:id/publish`
  - Validate: has title, description, price, main asset
  - Call LLM → generate landing page content
  - Create Stripe Product + Price
  - Update product: status=LIVE, generated content, Stripe IDs, publishedAt
  - Call `revalidatePath('/products/:slug')` for ISR
  - Return storefront_url
- [ ] `GET /api/v1/products/:id/analytics`
- [ ] Write API test script (not a full test suite — a manual curl script to exercise all endpoints)
- [ ] Document API in `docs/API.md` with example curl commands

### Done When
✅ All 7 endpoint groups return correct responses  
✅ API key auth blocks unauthenticated requests  
✅ Can create → upload → publish a product via curl  
✅ Published product visible in Supabase with status=LIVE  
✅ File visible in R2 bucket  
✅ Stripe shows product created  
✅ Manual curl test script passes all checks  

---

## Sprint 3 — Storefront UI
**Branch:** `feature/sprint-3-storefront-ui`  
**Goal:** Buyers can browse products. No checkout yet — just the browsing experience.

### Tasks
- [ ] Homepage (`app/(storefront)/page.tsx`)
  - Hero section with tagline
  - "Featured Products" grid (latest 6 LIVE products)
  - Sector navigation links
- [ ] Build `ProductCard` component
- [ ] Build `ProductGrid` component
- [ ] Build `SectorNav` component
- [ ] Sector page (`app/(storefront)/[sector]/page.tsx`)
  - Lists all LIVE products in that sector
  - ISR with 1-hour revalidation
  - Handles unknown sector gracefully (redirect to homepage)
- [ ] Products listing page (`app/(storefront)/products/page.tsx`)
  - Grid with filter sidebar (sector, product type, price range)
  - Basic keyword search (Postgres full-text search via Prisma)
- [ ] Product landing page (`app/(storefront)/products/[slug]/page.tsx`)
  - Renders all generated content (hero, bullets, audience statement)
  - "Buy Now" button (disabled/placeholder until Sprint 4)
  - Related products section
  - Proper meta tags (SEO)
  - `generateStaticParams` for build-time generation of known products
- [ ] Page view tracking: fire `POST /api/internal/pageview` on product page load
  - Server action, non-blocking
  - Creates `PageView` record
- [ ] 404 page for unknown slugs
- [ ] Auto-generate sitemap (`app/sitemap.ts`) from LIVE products
- [ ] Responsive design: mobile + desktop

### Done When
✅ Homepage shows products from seed data  
✅ Sector page filters correctly  
✅ Product page shows all generated content  
✅ Correct meta tags in `<head>` (verify with View Source)  
✅ Mobile layout looks clean  
✅ Sitemap.xml returns valid XML with product URLs  

---

## Sprint 4 — Checkout & Payments
**Branch:** `feature/sprint-4-checkout`  
**Goal:** Buyer can purchase a product. Money hits Stripe. Order created. Success page shows.

### Tasks
- [ ] "Buy Now" → Server action → Create Stripe Checkout Session
  - Use `stripe_price_id` from product record
  - Set `success_url` and `cancel_url`
  - Collect email in Stripe checkout config
- [ ] Stripe webhook handler (`app/api/webhooks/stripe/route.ts`)
  - Verify signature (`stripe.webhooks.constructEvent`)
  - Handle `checkout.session.completed`:
    - Extract buyer email, payment amount
    - Find product by `stripe_price_id`
    - Create `Order` record with `downloadToken`, `downloadExpiresAt`
    - Update order status to COMPLETED
  - Return 200 fast (process async if needed)
- [ ] Order confirmation page (`app/(storefront)/checkout/success/page.tsx`)
  - Fetch order by `session_id` query param
  - Show: "Your purchase is confirmed. Check your email for your download link."
  - Do NOT show the download link directly here (email is the delivery)
- [ ] Cancel page (`app/(storefront)/checkout/cancel/page.tsx`)
  - "No charge was made. Return to [product]?"
- [ ] Set up Resend client (`lib/resend/emails.ts`)
- [ ] Build `OrderConfirmation` React Email template
  - Order summary, product name, price paid
  - Download link: `https://skillforge.io/download/:token`
  - Expiry notice: "Link expires in 24 hours"
- [ ] Send confirmation email from webhook handler
- [ ] Test full purchase flow with Stripe test card (4242 4242 4242 4242)

### Done When
✅ Click "Buy Now" → Stripe checkout page opens  
✅ Complete purchase with test card → redirected to success page  
✅ Order record created in DB with status=COMPLETED  
✅ Confirmation email arrives with download link  
✅ Webhook handles `checkout.session.completed` reliably  
✅ Cancel returns to product page cleanly  

---

## Sprint 5 — File Delivery
**Branch:** `feature/sprint-5-delivery`  
**Goal:** Buyer can download their product. File served securely from R2.

### Tasks
- [ ] Download page (`app/(storefront)/download/[token]/page.tsx`)
  - Look up Order by `downloadToken`
  - Check: order exists, status=COMPLETED, not expired
  - If valid: generate R2 signed URL (15-min expiry), increment `downloadCount`
  - Redirect to signed URL (buyer downloads from R2 directly)
  - If expired: "Your link has expired. Email [support] to request a new one."
  - If invalid: 404
- [ ] Add download count limit (max 5 downloads per token — configurable)
- [ ] Build `WelcomeBuyer` email template (first purchase only)
  - Sent alongside order confirmation if it's buyer's first order
  - Brief welcome, what SkillForge is, what's coming
- [ ] Test: download link from email works and serves correct file
- [ ] Test: expired token shows error page
- [ ] Test: link after 5 downloads shows limit-reached page

### Done When
✅ Download link in email → downloads correct PDF  
✅ File served from R2 (verify URL is signed, expires)  
✅ Expired/invalid tokens handled gracefully  
✅ Download count tracked in DB  

---

## Sprint 6 — Admin Dashboard
**Branch:** `feature/sprint-6-admin`  
**Goal:** Jeff can log in and see everything.

### Tasks
- [ ] Admin auth: Supabase Auth, email+password, restricted to `ADMIN_EMAIL`
- [ ] Admin layout with sidebar nav (`app/(admin)/layout.tsx`)
- [ ] Overview page (`/admin`)
  - Today's revenue + sales count
  - Last 7 days chart (simple bar chart)
  - Total products (LIVE / DRAFT / UNPUBLISHED)
  - Last 5 pipeline runs
- [ ] Products table (`/admin/products`)
  - All products, all statuses
  - Columns: Title, Sector, Status, Price, Views, Purchases, Revenue
  - Sort by any column
  - Quick actions: Edit, Publish/Unpublish
- [ ] Product detail + edit (`/admin/products/:id`)
  - Edit: title, description, price, sector, tags, status
  - View: all generated content, asset list, full analytics
  - Danger zone: Archive product
- [ ] Analytics page (`/admin/analytics`)
  - Revenue over time (last 30 days)
  - Top 10 products by revenue
  - Top sectors by sales
  - Conversion rate by sector
- [ ] Pipeline runs log (`/admin/pipeline`)
  - List of all SkillForge runs
  - Per-run: products published, cost, timestamp
- [ ] Protect all admin routes (redirect to login if not authenticated)

### Done When
✅ Jeff can log in at `/admin/login`  
✅ All pages load with real data from DB  
✅ Can edit a product and see changes on storefront  
✅ Can unpublish a product and verify it's gone from storefront  
✅ Non-admin users see 403  

---

## Sprint 7 — SkillForge Integration & End-to-End Test
**Branch:** `feature/sprint-7-integration`  
**Goal:** SkillForge pipeline publishes to the storefront. Full end-to-end works.

### Tasks
- [ ] Generate production API key for SkillForge (store in SkillForge credentials file)
- [ ] Update SkillForge Phase 10 (Publisher):
  - Replace Gumroad/LS/Ko-fi calls with `POST /api/v1/products` flow
  - Implement full publish sequence (create → upload → publish)
  - Map SkillForge product metadata to API request fields
  - Parse `storefront_url` from publish response → use in Phase 11 (Distributor)
- [ ] Update SkillForge Phase 11 (Distributor):
  - Discord announcement uses storefront URL
  - Beehiiv newsletter uses storefront URL
- [ ] Update SkillForge Phase 14 (Preflight):
  - Replace Gumroad/LS/Ko-fi health checks with `GET /api/v1/health`
- [ ] Run SkillForge dry run against staging storefront
  - Verify product appears on staging storefront
  - Verify landing page looks correct
  - Verify Discord announcement fires with correct URL
- [ ] Run full SkillForge live run against staging storefront
  - Real product, real publish, real announcement
  - Test purchase flow on the published product (test card)
  - Verify download works
- [ ] Fix anything broken (expected — integration always surfaces edge cases)

### Done When
✅ SkillForge `preflight.py` — storefront health check green  
✅ SkillForge dry run: product published to staging storefront  
✅ Product page looks correct (generated content, correct sector)  
✅ Purchase → delivery → download works end-to-end  
✅ Discord announcement has correct storefront URL  
✅ Admin dashboard shows the product and the test purchase  

---

## Sprint 8 — Launch
**Branch:** `develop → main`  
**Goal:** Storefront is live at production URL. SkillForge runs against production.

### Tasks
- [ ] Domain setup: configure `skillforge.io` in Vercel (or new domain — confirm with Jeff)
- [ ] Set all production environment variables in Vercel dashboard
- [ ] Run `prisma migrate deploy` against production Supabase
- [ ] Set up Stripe production keys (switch from test to live)
- [ ] Set up Cloudflare R2 production bucket
- [ ] Configure Stripe webhook endpoint for production URL
- [ ] Merge `develop → main` → production deploy triggers
- [ ] Smoke test production (browse storefront, test purchase with real card — refund immediately)
- [ ] Update SkillForge credentials with production API key
- [ ] Run first real SkillForge overnight run → publishes to production
- [ ] Monitor: Vercel logs, Supabase, Stripe dashboard
- [ ] Set up Vercel error alerting (email on 5xx errors)

### Done When
✅ `skillforge.io` loads the storefront  
✅ SkillForge publishes to production  
✅ First real product live and purchasable  
✅ Monitoring in place  

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| R2 signed URL complexity | Low | Medium | Tested in Sprint 2; well-documented |
| Stripe webhook reliability | Low | High | Idempotency key on Order creation; verify signature |
| LLM landing page generation slow/fails | Medium | Low | 10s timeout; `publish` returns 422 on LLM failure; agent retries |
| Slug collision (two products same title) | Low | Low | Add suffix counter: `title-2`, `title-3` |
| Supabase connection limits | Low | Medium | Use connection pooling URL; Prisma connection limit config |
| SkillForge integration breaks existing flow | Medium | Medium | Test on staging first; keep old publishers as fallback in Sprint 7 |
| Vercel cold starts on API routes | Low | Low | API routes stay warm; add `export const runtime = 'nodejs'` |

---

## All Decisions Locked ✅

| Decision | Locked Value |
|---|---|
| Domain | agoran.ai |
| Brand | Agoran |
| Pricing | Agent sets freely (dynamic) |
| Guarantee | Per-product (has_guarantee + guarantee_days fields) |
| Sectors | Open — start with AI, Finance, Health, Marketing, Productivity |
| Design | Liquid Glass (see UI-glass-design-guide.md) |
| Admin email | admin@bizooku.com |
| Build | Local first, Vercel later |
| Repo | agoran (GitHub — needs token with repo:write scope) |

---

## Post-MVP Roadmap (Not in This Plan — But Designed For)

- **v2:** Multi-brand sector storefronts (subdomains per sector)
- **v2:** Affiliate/referral system
- **v2:** Bundle engine (buy 3, save 30%)
- **v3:** Blockchain product provenance layer
- **v3:** Agent royalty attribution and tracking
- **v3:** 100k-agent catalog ingestion at scale
- **v4:** Dynamic pricing intelligence
- **v4:** Personalized recommendation engine
