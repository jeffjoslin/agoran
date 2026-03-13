# Agoran — Quality Gates & Failure Prevention Document
**Version:** 1.0  
**Last Updated:** 2026-03-08  
**Author:** Crypto Master (AI Architect)

---

## Purpose

This document is **read before every sprint begins and before any PR is merged to develop or main.**

It captures every known class of failure — from prior SkillForge development and from the Agoran stack specifically — with root causes and concrete prevention steps. The goal: never hit the same wall twice.

This is a living document. After every resolved issue, a new entry is added. No exceptions.

---

## 🚦 Pre-Sprint Checklist (Run This Every Time)

Before writing a single line of code for a new sprint:

- [ ] Read this entire document
- [ ] Verify all environment variables are set for the target environment (.env.local, Vercel staging, Vercel prod)
- [ ] Run `prisma migrate status` — confirm no pending migrations
- [ ] Run `npm run typecheck` — zero errors before sprint starts
- [ ] Run `npm run lint` — zero warnings before sprint starts
- [ ] Confirm Stripe is in correct mode (test for staging, live for prod)
- [ ] Confirm R2 bucket name matches env var (separate buckets for staging/prod)
- [ ] Confirm Supabase project matches env var (separate projects for staging/prod)
- [ ] Review the open "Watch Carefully" list at the bottom of this doc

---

## 🔴 Known Failure Classes

Each entry includes: **What happened → Root cause → Prevention**

---

### F-001: Stripe Webhook Signature Verification Fails
**Category:** Payments / Webhooks  
**Severity:** Critical — orders never created, buyers don't get downloads

**Root Cause:**
- Stripe sends a raw body; if the framework buffers/parses it before the webhook handler sees it, the signature check fails
- Next.js App Router parses request bodies by default
- Using the wrong webhook secret (test secret in production, or vice versa)
- Ngrok or proxy adding headers that corrupt the raw body during local dev

**Prevention:**
- In the webhook route, use `request.text()` NOT `request.json()` to get the raw body
- Set `export const runtime = 'nodejs'` in the webhook route file (disables Edge runtime body handling)
- Use `stripe.webhooks.constructEvent(rawBody, sig, secret)` — never parse JSON first
- Maintain SEPARATE webhook secrets for test and live environments
- Add an idempotency check on `stripeSessionId` before creating an Order — handle duplicate webhook deliveries gracefully
- In local dev, use Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) NOT ngrok

**Test:** After implementing, verify by manually triggering `stripe trigger checkout.session.completed` via Stripe CLI.

---

### F-002: Supabase Row Level Security (RLS) Blocking Prisma
**Category:** Database  
**Severity:** High — queries silently return empty or throw permission errors

**Root Cause:**
- Supabase enables RLS by default on all tables
- Prisma uses the pooled connection URL with the anon key → RLS blocks all access
- Service role key bypasses RLS, but must never be used client-side

**Prevention:**
- Prisma ALWAYS uses `DATABASE_URL` (pooled) with the **service role** connection string, NOT the anon key URL
- `DIRECT_URL` (for migrations) also uses service role
- Double-check by querying a table via Prisma in a test script immediately after schema deploy
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client — it must only live in server-side code and environment variables
- Add a sanity test in Sprint 1: `prisma.product.count()` should return 0 (not throw)

---

### F-003: Environment Variables Missing in Vercel
**Category:** Deployment  
**Severity:** High — silent runtime failures, features appear broken in staging/prod

**Root Cause:**
- Env vars set in `.env.local` are not automatically pushed to Vercel
- Variables added late in development get missed when setting up staging/production
- `NEXT_PUBLIC_*` vars must be set in Vercel to be available client-side at build time

**Prevention:**
- `.env.example` is the canonical list — update it EVERY time a new env var is introduced (same commit, no exceptions)
- Before first staging deploy, do a side-by-side comparison of `.env.example` vs Vercel dashboard
- `NEXT_PUBLIC_*` vars must be added to Vercel BEFORE the build runs (they're baked in at build time, not runtime)
- Add a startup validation in `app/layout.tsx` (or a separate `lib/env.ts`) that checks all required env vars on boot and throws a readable error if any are missing

---

### F-004: Prisma Migration Conflicts Between Environments
**Category:** Database / Migrations  
**Severity:** High — production deploy fails or schema is out of sync

**Root Cause:**
- Running `prisma migrate dev` on local creates migration files; if they're not in sync with staging/prod, `prisma migrate deploy` fails
- Editing a migration file after it's been applied breaks the migration history checksum
- Force-resetting a migration in local dev that has already run in staging

**Prevention:**
- **Never edit a migration file after it has been applied anywhere** (local, staging, or prod)
- If a migration needs fixing: create a new migration with the correction
- `prisma migrate dev` for local development only
- `prisma migrate deploy` for staging and production (no interactive prompts)
- Run `prisma migrate status` at the start of every sprint to confirm all environments are in sync
- Migration files are committed to git — never gitignore them

---

### F-005: Cloudflare R2 Signed URL Expiry / Invalid URLs
**Category:** File Delivery  
**Severity:** High — buyers can't download their purchases

**Root Cause:**
- R2 signed URLs expire (default: 15 minutes for downloads, 1 hour for uploads)
- Generating a signed URL and storing it in the DB (instead of the R2 key) → URL expires
- Using the wrong endpoint URL (R2 uses `https://<account-id>.r2.cloudflarestorage.com` not AWS)
- Clock skew between server and R2 causing "request time too skewed" errors

**Prevention:**
- NEVER store signed URLs in the database — always store the `r2Key` (path) and generate signed URLs on demand
- Generate the signed URL at request time (in the download route handler), not at order creation time
- R2 client endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` — double-check this
- Test signed URLs by fetching them immediately after generation in a test script
- For upload URLs (presigned PUT), set expiry to 1 hour maximum; regenerate if upload fails and user retries

---

### F-006: Next.js ISR Not Revalidating After Publish
**Category:** Frontend / Caching  
**Severity:** Medium — published product doesn't appear live until cache expires

**Root Cause:**
- ISR caches pages at build time or after first request + revalidation interval
- Publishing a product via API doesn't automatically invalidate the cached page
- `revalidatePath` must be called explicitly from a Server Action or Route Handler

**Prevention:**
- In `POST /api/v1/products/:id/publish` route handler, always call:
  - `revalidatePath('/products/[slug]', 'page')` for the new product page
  - `revalidatePath('/')` for homepage (featured products)
  - `revalidatePath(`/[sector]`)` for the relevant sector page
- Test revalidation in Sprint 3: publish a product via API, then verify the storefront page updates within 5 seconds
- Set `revalidate = 300` (5 minutes) as a safety net on product pages in case manual revalidation misses

---

### F-007: File Upload Size / Type Not Validated Server-Side
**Category:** API / Security  
**Severity:** Medium — oversized or malicious files get stored in R2

**Root Cause:**
- Client-side validation is bypassable — always validate on the server
- Multipart form parsing in Next.js App Router requires careful handling; default body size limits apply

**Prevention:**
- Set `export const config = { api: { bodyParser: false } }` or use streaming for file uploads
- Validate: file size ≤ 100MB, MIME type in allowlist (`application/pdf`, `application/zip`, `application/vnd.openxmlformats-officedocument.*`)
- Check file magic bytes, not just the MIME type header (easily spoofed)
- Reject and delete immediately if validation fails — never store an invalid file
- Add `Content-Type` check before streaming to R2

---

### F-008: LLM Landing Page Generation Timeout / Failure Leaves Product in Broken State
**Category:** API / LLM  
**Severity:** Medium — product stuck in limbo (not LIVE, not cleanly DRAFT)

**Root Cause:**
- Claude API call during `publish` takes 5–15 seconds; can timeout
- If the LLM call fails mid-publish, product may have been partially updated
- Agent retries the publish call, creating a second Stripe Product (duplicate billing objects)

**Prevention:**
- Wrap the entire publish sequence in a database transaction where possible
- LLM call must happen BEFORE any Stripe or DB writes in the publish flow
- If LLM fails: return `422 LLM_GENERATION_FAILED`, leave product in DRAFT state (no partial writes)
- Stripe Product creation must be idempotent: check if `stripeProductId` already exists on the product before creating a new one (prevents duplicates on retry)
- Set a 30-second timeout on the LLM call (not the default which may be longer)
- Log every LLM call with the full prompt + response for debugging

---

### F-009: Slug Collision on Identical Product Titles
**Category:** Database  
**Severity:** Low-Medium — product creation fails with unique constraint error

**Root Cause:**
- SkillForge may publish multiple products with the same or very similar titles (e.g., two guides both called "The AI Productivity Guide")
- Slug generated from title hits the unique constraint

**Prevention:**
- Slug generation function must handle collisions: check if slug exists, append `-2`, `-3`, etc.
- Slugs should be stored lowercase, URL-safe (alphanumeric + hyphens only)
- Test: attempt to create two products with identical titles — second should get `-2` suffix, not throw

---

### F-010: TypeScript Build Errors Only Caught at Deploy Time
**Category:** Development Process  
**Severity:** Medium — sprint looks done locally but CI fails

**Root Cause:**
- Running `npm run dev` does not enforce TypeScript strict mode — errors only surface at `npm run build`
- Prisma-generated types may differ from manually written types

**Prevention:**
- `npm run typecheck` (`tsc --noEmit`) must pass before any PR is opened
- CI enforces this — but run it locally first to catch it before CI
- Enable `"strict": true` in `tsconfig.json` from day one — never disable
- Run `prisma generate` after any schema change; commit the generated types

---

### F-011: Admin Dashboard Accessible Without Authentication
**Category:** Security  
**Severity:** Critical — anyone can view revenue, edit products, unpublish

**Root Cause:**
- Forgetting to add auth middleware to admin routes
- Next.js App Router doesn't protect routes by default
- Supabase session not checked server-side (only client-side check)

**Prevention:**
- Admin layout (`app/(admin)/layout.tsx`) must check auth server-side using `supabase.auth.getUser()` (not `getSession()` — which can be spoofed client-side)
- If not authenticated: `redirect('/admin/login')`
- If authenticated but not `ADMIN_EMAIL`: `redirect('/')` with 403
- Test: attempt to access `/admin` in a private browser window without logging in — must redirect to login
- Middleware file (`middleware.ts`) should protect `/admin/*` as a second layer of defense

---

### F-012: Playwright / Browser Automation Failures (SkillForge History)
**Category:** Browser Automation  
**Severity:** High (when used)  
**Note:** Agoran doesn't use Playwright, but SkillForge still does. Documented here for cross-project awareness.

**Root Cause (from prior SkillForge incidents):**
- Chromium not found at expected path
- Missing `--disable-dev-shm-usage` flag causing crashes in containerized environments
- Login redirect going to unexpected URL post-auth
- Hidden file inputs not accepting `.setInputFiles()` via Playwright

**Prevention (for any future browser automation):**
- Always specify `executable_path` explicitly — never rely on auto-detection
- Always pass `--disable-dev-shm-usage`, `--no-sandbox` in non-desktop environments
- Add explicit wait for post-login URL before proceeding
- For hidden file inputs: use `page.evaluate()` to make visible first, then `setInputFiles()`

---

### F-013: Stripe Test/Live Mode Mismatch
**Category:** Payments  
**Severity:** Critical — test charges hit production, or live charges don't go through

**Root Cause:**
- Using `sk_test_*` key in production or `sk_live_*` in staging
- Stripe webhook secret from test mode used to verify live mode webhooks (fails signature check)
- Test Price IDs from staging used in production Stripe API calls

**Prevention:**
- Vercel environment variables: staging uses `STRIPE_SECRET_KEY=sk_test_...`, production uses `sk_live_...`
- Webhook secrets are environment-specific — set separately per environment in Vercel
- Products and Prices created in Stripe are mode-specific — staging creates test objects, production creates live objects
- Add a boot-time check: if `NODE_ENV=production` and `STRIPE_SECRET_KEY` starts with `sk_test_`, throw an error and refuse to start
- Before launch: verify production Stripe webhook endpoint is configured at `https://agoran.ai/api/webhooks/stripe` (not staging URL)

---

### F-014: R2 Bucket Permissions — Public vs Private Confusion
**Category:** File Storage / Security  
**Severity:** Critical — purchased files accessible without payment

**Root Cause:**
- R2 bucket accidentally set to public access → anyone with the file URL can download
- Signed URLs generated with wrong permissions

**Prevention:**
- R2 bucket MUST be created with public access disabled — verify this in Cloudflare dashboard before any files are uploaded
- Add a smoke test: upload a test file to R2, attempt to access it without a signed URL → must return 403
- Signed URL generation must specify `getObject` not `putObject` for download URLs
- Never log or expose the R2 key (path) in API responses — only expose signed download URLs when appropriate

---

### F-015: Download Token Brute Force / Enumeration
**Category:** Security  
**Severity:** Medium — non-buyers can guess download tokens

**Root Cause:**
- If download tokens are sequential or short, they're guessable
- No rate limiting on the download endpoint

**Prevention:**
- Download tokens are generated with `crypto.randomUUID()` — 128 bits of entropy, not guessable
- Add rate limiting to `/download/[token]`: max 10 attempts per IP per minute (use Vercel Edge middleware or Upstash)
- Log all failed download token lookups (invalid token, expired, over-limit)

---

### F-016: Inline Glass / Design Token Drift
**Category:** UI / Design System  
**Severity:** Medium — visual inconsistency across components, hard to refactor later

**Root Cause:**
- Writing `backdrop-blur-xl bg-white/10 border border-white/20` inline in a component instead of importing from `design-tokens.ts`
- One component uses `bg-white/8`, another uses `bg-white/10` — subtle drift that looks broken at scale
- Refactoring a design token requires finding every inline occurrence instead of changing one value

**Prevention:**
- ALL Liquid Glass styling MUST use named tokens from `@/styles/design-tokens.ts`
- Before building any UI component: scan `design-tokens.ts` for an existing token that fits
- If no token fits: add a new named export to `design-tokens.ts` FIRST, then use it — never write a one-off
- Code review trigger: any PR containing `backdrop-blur`, `bg-white/`, or `border-white/` inline must be rejected and refactored to use tokens

**Banned patterns:**
```tsx
// ❌ NEVER DO THIS
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">

// ✅ ALWAYS DO THIS
import { GLASS_CARD } from '@/styles/design-tokens';
<div className={GLASS_CARD}>
```

---

### F-017: API Key Exposed in Logs or Error Responses
**Category:** Security  
**Severity:** Critical — SkillForge API key compromised

**Root Cause:**
- Logging the full request headers (including Authorization: Bearer key)
- Returning the API key in an error response

**Prevention:**
- Never log the `Authorization` header in full
- Error responses must never include any part of the API key
- API keys stored as bcrypt hashes in DB — even if DB is compromised, keys aren't exposed
- Rotate keys if any doubt about exposure — key rotation must be possible without downtime

---

## 📋 Sprint Sign-Off Criteria

A sprint is **not done** until ALL of the following are true:

### Code Quality
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings (or all suppressed with justification)
- [ ] No `any` types added without a comment explaining why
- [ ] No hardcoded secrets, URLs, or environment-specific values in code

### Testing
- [ ] All new API endpoints tested manually (curl script or Postman)
- [ ] Happy path verified end-to-end in staging environment
- [ ] At least one error case tested per endpoint (missing field, invalid auth, etc.)
- [ ] If payments: tested with Stripe test card 4242 4242 4242 4242

### Security
- [ ] No new routes added without verifying auth requirements
- [ ] No new env vars added without updating `.env.example`
- [ ] No files committed that shouldn't be (secrets, local configs, build artifacts)

### Database
- [ ] `prisma migrate status` shows clean on staging
- [ ] Any new indexes added for new query patterns
- [ ] No raw SQL queries without justification

### Deployment
- [ ] Branch merged to `develop` (not directly to `main`)
- [ ] Staging deployment successful (Vercel preview green)
- [ ] No regressions on previously working features

---

## 🔭 Watch Carefully (Ongoing Risks)

These are not historical failures but known risk areas to monitor throughout the project:

| Risk | What to Watch |
|---|---|
| Supabase connection limits | Monitor active connections; Prisma connection pool config |
| Vercel function timeout (10s default) | `/publish` endpoint calls LLM — may need `maxDuration: 30` in route config |
| R2 egress costs | Monitor download volume; consider download count limits per order |
| Stripe API version | Pin the Stripe SDK version; don't auto-update without testing |
| Claude API changes | Pin `anthropic` SDK version; LLM output format may change |
| Next.js breaking changes | Pin Next.js version; only upgrade intentionally between sprints |
| `agoran.ai` DNS propagation | After domain config, allow 24-48h for full propagation before going live |

---

## 📝 Issue Log (Add Every Resolved Issue Here)

| Date | Sprint | Component | Issue | Root Cause | Solution |
|---|---|---|---|---|---|
| — | — | — | (none yet — this project is new) | — | — |

*Format for new entries:*  
`| YYYY-MM-DD | Sprint N | Component | Brief description | Root cause | What fixed it |`
