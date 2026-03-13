# CLAUDE.md — Agoran Storefront

> **Repo location:** Place this file at the **root** of the `agoran` repo.  
> Any AI agent working in this repo MUST read this file first.

---

## ⚠️ MANDATORY — Read Before Any Work

1. **Read `HANDOFF.md`** — Know what sprint is active and what was last done before touching anything
2. **Read `.claude/QUALITY_GATES.md`** — Before writing any UI component, API route, or database migration
3. **Read `storefront-docs/ARCHITECTURE.md`** — Before adding any new table, service, or API endpoint
4. **Never start a sprint** without reading the Done Definition for that sprint in `storefront-docs/EXECUTION_PLAN.md`

Failure to follow these steps will result in drift, duplicated work, and wasted runs.

---

## Project Overview

**Agoran** (`agoran.ai`) is an agent-native digital product storefront. SkillForge (an autonomous AI pipeline) discovers trends, builds digital products, and publishes them here via API. Human buyers browse, purchase, and receive instant downloads.

**Why we built it:** Gumroad, Lemon Squeezy, and Ko-fi take 5–10%, own the customer data, and weren't built for agent-driven high-volume publishing. We own this.

**Stack:** Next.js 14 (App Router) · TypeScript · Supabase (PostgreSQL + Auth) · Prisma · Cloudflare R2 · Stripe · Resend · Vercel

---

## Repo Structure

```
agoran/
├── app/                        # Next.js application (WORK HERE)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (storefront)/   # Public-facing pages (home, product pages, checkout)
│   │   │   ├── (admin)/        # Admin dashboard (protected)
│   │   │   └── api/
│   │   │       ├── v1/         # Agent Publishing API
│   │   │       ├── webhooks/   # Stripe webhook handler
│   │   │       └── internal/   # Internal routes (pageview tracking, etc.)
│   │   ├── components/
│   │   │   ├── storefront/     # Buyer-facing components
│   │   │   ├── admin/          # Admin dashboard components
│   │   │   └── ui/             # Shared UI primitives
│   │   ├── lib/
│   │   │   ├── api/            # Auth middleware, error utilities
│   │   │   ├── db/             # Prisma client
│   │   │   ├── r2/             # Cloudflare R2 client + helpers
│   │   │   ├── stripe/         # Stripe client
│   │   │   ├── resend/         # Email templates + client
│   │   │   └── llm/            # Landing page generation (Anthropic)
│   │   ├── styles/
│   │   │   └── design-tokens.ts  # ⚠️ IMPORT FROM HERE — never write glass classes inline
│   │   └── types/              # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   ├── .env.example            # All required env vars documented here
│   └── package.json
├── storefront-docs/            # Planning docs (not deployed)
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── EXECUTION_PLAN.md
│   ├── QUALITY_GATES.md
│   └── UI-glass-design-guide.md
├── .claude/
│   ├── QUALITY_GATES.md        # ⚠️ MANDATORY — read before any code
│   └── active-sprint.md        # Live sprint tracker
├── CLAUDE.md                   # This file
└── HANDOFF.md                  # ⚠️ MANDATORY — read before any session
```

---

## Common Commands

> **All commands run from `/app` directory.**

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run type-check       # TypeScript check (no emit)
npm run lint             # ESLint
npm run lint:fix         # Fix ESLint issues

# Database
npx prisma migrate dev --name <name>   # New migration (dev only)
npx prisma migrate deploy              # Apply migrations (staging/prod)
npx prisma db seed                     # Seed database
npx prisma studio                      # Visual DB browser

# Testing
npm test                 # Vitest watch mode
npm run test:run         # Run once
npm run test:coverage    # Coverage report
```

---

## Architecture at a Glance

```
SkillForge Pipeline  ──→  Agent API (POST /api/v1/products/...)
                                  ↓
                          Supabase (Prisma ORM)
                                  ↓
           ┌──────────────────────┼────────────────────────┐
           ↓                      ↓                        ↓
     Cloudflare R2          Stripe (Checkout)          Resend (Email)
     (file storage)         (payments)                 (delivery)
           ↓                      ↓
     Signed URLs          Webhook → Order → Download Token
```

**Human buyer flow:** Browse storefront → Product page → Stripe Checkout → Webhook creates Order → Email with signed download link → Download page serves file from R2.

**Agent publish flow:** `POST /api/v1/products` → `POST /api/v1/products/:id/assets` → `POST /api/v1/products/:id/publish` (triggers LLM landing page generation + Stripe product creation) → product goes live.

---

## API Routes

### Agent Publishing API (`/api/v1/`) — requires `Authorization: Bearer <key>`
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Connectivity check (no auth) |
| POST | `/api/v1/products` | Create product (draft) |
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/products/:id` | Get product |
| PUT | `/api/v1/products/:id` | Update metadata |
| POST | `/api/v1/products/:id/assets` | Upload file to R2 |
| POST | `/api/v1/products/:id/publish` | Go live (triggers LLM + Stripe) |
| GET | `/api/v1/products/:id/analytics` | Metrics |

### Storefront / Checkout
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/checkout` | Create Stripe Checkout Session |
| POST | `/api/webhooks/stripe` | Stripe event handler |
| GET | `/api/internal/pageview` | Track product page views |

---

## Design System — CRITICAL

> **Agoran uses the Liquid Glass design system.**  
> Full reference: `storefront-docs/UI-glass-design-guide.md`

### ⚠️ Rule: Never write glass styles inline

```typescript
// ✅ CORRECT — import from design-tokens
import { GLASS_CARD, GLASS_BUTTON_PRIMARY, GLASS_INPUT } from '@/styles/design-tokens';

<div className={GLASS_CARD}>...</div>

// ❌ BANNED — never do this
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
```

**Why:** Inline glass classes drift across components. One `bg-white/10` vs `bg-white/8` difference and the UI looks broken. The token file is the single source of truth.

**Before building any UI component:**
1. Check `design-tokens.ts` for an existing token
2. If none fits, add a new named token to `design-tokens.ts` first, then use it
3. Never invent a one-off class

---

## Key Patterns

### Prisma Client (server-side only)
```typescript
import { db } from '@/lib/db';
const product = await db.product.findUnique({ where: { id } });
```

### API Auth Middleware
```typescript
import { requireApiKey } from '@/lib/api/auth';
export async function POST(req: Request) {
  const agent = await requireApiKey(req);
  if (!agent) return unauthorized();
  // ...
}
```

### Standardized Error Responses
```typescript
import { apiError, notFound, unauthorized, validationError } from '@/lib/api/errors';
return apiError('MISSING_ASSET', 'Product must have at least one main asset', 400);
```

### R2 File Handling
```typescript
import { uploadToR2, getSignedDownloadUrl } from '@/lib/r2/client';
const key = `products/${productId}/main/${filename}`;
await uploadToR2(key, buffer, 'application/pdf');
const url = await getSignedDownloadUrl(key, 3600); // 1hr expiry
```

### LLM Landing Page Generation
```typescript
import { generateLandingPage } from '@/lib/llm/landing-page';
const content = await generateLandingPage({ title, description, sector, targetAudience });
// Returns: { heroHeadline, heroSubheadline, bulletPoints, audienceStatement, metaTitle, metaDescription }
```

---

## Environment Variables

See `.env.example` for full list. Required at minimum:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only — never expose to client
DATABASE_URL=                        # Prisma connection (pooler URL)
DIRECT_URL=                          # Prisma direct URL (for migrations)

# Stripe
STRIPE_SECRET_KEY=                   # sk_test_... (dev) / sk_live_... (prod)
STRIPE_WEBHOOK_SECRET=               # whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=                       # For admin/analytics only — not buyer downloads

# Resend
RESEND_API_KEY=

# Anthropic (LLM for landing page generation)
ANTHROPIC_API_KEY=

# Agent API
AGENT_API_SECRET=                    # Used to hash/validate API keys

# App
NEXT_PUBLIC_APP_URL=                 # https://agoran.ai (prod) / https://staging.agoran.ai (staging)
ADMIN_EMAIL=admin@bizooku.com
```

> **⚠️ Stripe:** NEVER use `sk_live_` keys in development. Boot-time check in `lib/stripe/client.ts` enforces this.

---

## TypeScript

Strict mode enabled. All of these will fail CI:
- `noUnusedLocals` / `noUnusedParameters`
- `noUncheckedIndexedAccess` — array access returns `Type | undefined`, always guard it
- `strictNullChecks`

Path alias: `@/*` → `./src/*`

---

## Branch Strategy

```
main          ← Production (agoran.ai) — manual merge only
develop       ← Staging — feature branches merge here
feature/...   ← One branch per sprint
hotfix/...    ← Branch from main, PR to main + develop
```

**Rules:**
- Never commit directly to `main` or `develop`
- Every feature branch → PR into `develop`
- `develop → main` = Jeff approves, we agree it's ready
- No new sprint branch until previous sprint is merged and staging is green

---

## Development Workflow

1. Read `HANDOFF.md` — know the current state
2. Check `.claude/active-sprint.md` — know the current task
3. Run `npm run dev` to start dev server
4. Make changes
5. Run `npm run type-check` — must pass
6. Run `npm run lint:fix`
7. Run `npm run test:run` — must pass
8. Update `.claude/active-sprint.md` with completed task
9. Update `HANDOFF.md` with current branch + next task

---

## Implementation Status

See `HANDOFF.md` for current sprint.  
See `storefront-docs/EXECUTION_PLAN.md` for full sprint definitions.

| Sprint | Goal | Status |
|---|---|---|
| 0 | Repo + CI + Vercel | ⬜ |
| 1 | Database schema | ⬜ |
| 2 | Agent API | ⬜ |
| 3 | Storefront UI | ⬜ |
| 4 | Checkout | ⬜ |
| 5 | File delivery | ⬜ |
| 6 | Admin dashboard | ⬜ |
| 7 | SkillForge integration | ⬜ |
| 8 | Launch | ⬜ |

---

*Last updated: 2026-03-08 | Author: Crypto Master*
