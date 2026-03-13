# SkillForge Storefront — Architecture Document
**Version:** 1.1  
**Status:** Approved — Ready for Development  
**Date:** 2026-03-08  
**Author:** Crypto Master (AI Architect)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SKILLFORGE STOREFRONT                  │
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │   Frontend    │    │   API Layer  │    │   Admin    │  │
│  │  (Next.js)   │    │  (API Routes)│    │  Dashboard │  │
│  └──────┬───────┘    └──────┬───────┘    └─────┬──────┘  │
│         │                   │                   │         │
│  ┌──────▼───────────────────▼───────────────────▼──────┐  │
│  │                    Supabase                          │  │
│  │         (PostgreSQL + Auth + Realtime)               │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                  │
│       ┌─────────────────┼──────────────────┐               │
│       │                 │                  │               │
│  ┌────▼────┐    ┌───────▼───┐    ┌────────▼────┐          │
│  │Stripe   │    │Cloudflare │    │   Resend    │          │
│  │Payments │    │    R2     │    │   Email     │          │
│  └─────────┘    └───────────┘    └─────────────┘          │
└─────────────────────────────────────────────────────────┘

        ▲                           ▲
        │                           │
┌───────┴──────┐          ┌─────────┴──────┐
│  SkillForge  │          │  Human Buyer   │
│  Pipeline    │          │  (Browser)     │
│  (Agent API) │          │                │
└──────────────┘          └────────────────┘
```

---

## 2. Technology Stack

### 2.1 Decision Matrix

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR/SSG for SEO, API routes in same project, React ecosystem, Vercel-native |
| **Language** | TypeScript | Type safety across frontend + API, catches errors at compile time |
| **Styling** | Tailwind CSS + shadcn/ui + Liquid Glass design system | See `UI-glass-design-guide.md` — Apple-inspired translucent surfaces, backdrop-filter, glass cards throughout |
| **Database** | Supabase (PostgreSQL) | Already provisioned, Supabase Auth built-in, Row Level Security, realtime capable |
| **ORM** | Prisma | Type-safe DB access, migrations, works perfectly with Supabase PostgreSQL |
| **Payments** | Stripe | Industry standard, hosted checkout (PCI offloaded), webhook system, Stripe Products for catalog |
| **File Storage** | Cloudflare R2 | S3-compatible, free egress, cheap storage, global CDN, private bucket support |
| **Email** | Resend | Modern API, React Email templates, reliable deliverability, generous free tier |
| **LLM (landing pages)** | Anthropic Claude via API | Best-in-class copy generation, already integrated in SkillForge pipeline |
| **Hosting** | Vercel | Zero-config Next.js deployment, edge functions, global CDN, preview deployments per branch |
| **Repo** | GitHub | Branch/PR workflow, CI/CD via GitHub Actions → Vercel |

### 2.2 Why Not Alternatives
- **Not Express/FastAPI as separate backend:** Keeps everything in one repo, fewer moving parts, Next.js API routes are production-grade
- **Not PlanetScale/Neon:** Already have Supabase, no reason to add another DB provider
- **Not AWS S3:** Cloudflare R2 is cheaper (free egress), no bandwidth costs when serving downloads
- **Not SendGrid:** Resend has better DX and React Email templates are excellent
- **Not Railway/Render:** Vercel is purpose-built for Next.js, preview deployments are invaluable for testing

---

## 3. Repository Structure

```
skillforge-storefront/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + typecheck + test on PR
│       └── deploy-preview.yml  # Preview deploys on feature branches
│
├── app/                        # Next.js App Router
│   ├── (storefront)/           # Public buyer-facing routes
│   │   ├── page.tsx            # Homepage
│   │   ├── [sector]/
│   │   │   └── page.tsx        # Sector landing page
│   │   ├── products/
│   │   │   ├── page.tsx        # All products / search
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual product page
│   │   └── checkout/
│   │       ├── success/page.tsx
│   │       └── cancel/page.tsx
│   │
│   ├── (admin)/                # Admin dashboard (auth-gated)
│   │   ├── layout.tsx          # Admin layout + auth check
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── products/
│   │   │   ├── page.tsx        # All products table
│   │   │   └── [id]/page.tsx   # Product detail + edit
│   │   └── analytics/
│   │       └── page.tsx        # Revenue + conversion stats
│   │
│   ├── api/
│   │   ├── v1/                 # Agent Publishing API
│   │   │   ├── health/route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts          # GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET, PUT
│   │   │   │       ├── assets/route.ts
│   │   │   │       ├── publish/route.ts
│   │   │   │       └── analytics/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts  # Stripe webhook handler
│   │
│   ├── layout.tsx              # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── storefront/             # Buyer-facing components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── SectorNav.tsx
│   │   ├── HeroSection.tsx
│   │   └── CheckoutButton.tsx
│   └── admin/                  # Admin components
│       ├── ProductTable.tsx
│       ├── StatsCard.tsx
│       └── RevenueChart.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server-side Supabase client
│   ├── stripe/
│   │   ├── client.ts
│   │   └── webhooks.ts
│   ├── r2/
│   │   └── client.ts           # Cloudflare R2 S3 client
│   ├── resend/
│   │   └── emails.ts           # Email send functions
│   ├── llm/
│   │   └── landing-page.ts     # Claude API for page generation
│   └── api/
│       ├── auth.ts             # API key validation middleware
│       └── errors.ts           # Standardized error responses
│
├── prisma/
│   ├── schema.prisma           # DB schema
│   └── migrations/             # Migration history
│
├── emails/                     # React Email templates
│   ├── OrderConfirmation.tsx
│   └── WelcomeBuyer.tsx
│
├── types/
│   └── index.ts                # Shared TypeScript types
│
├── .env.example                # All required env vars documented
├── .env.local                  # Local dev (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 4. Database Schema

### 4.1 Full Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── PRODUCTS ────────────────────────────────────────────

model Product {
  id               String        @id @default(cuid())
  slug             String        @unique
  title            String
  description      String        // Full description (agent-provided)
  shortDescription String?       // One-liner for cards
  
  // Taxonomy
  sector           String        // "ai", "finance", "health", etc.
  subNiche         String?
  productType      ProductType
  targetAudience   String[]      // Array of audience tags
  tags             String[]
  
  // Pricing
  priceCents       Int           // Price in cents (e.g. 1700 = $17.00)
  currency         String        @default("usd")
  
  // Status
  status           ProductStatus @default(DRAFT)
  publishedAt      DateTime?
  
  // Stripe
  stripeProductId  String?
  stripePriceId    String?
  
  // Generated landing page content
  heroHeadline     String?       // LLM-generated at publish time
  heroSubheadline  String?
  bulletPoints     String[]      // "What you'll get" bullets
  audienceStatement String?      // "This is for you if..."
  
  // SEO
  metaTitle        String?
  metaDescription  String?
  ogImageUrl       String?
  
  // Agent attribution
  agentId          String?       // Which agent/run published this
  runMetadata      Json?         // Trend score, quality score, run ID, etc.
  
  // Relations
  assets           ProductAsset[]
  orders           Order[]
  pageViews        PageView[]
  
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  @@index([sector, status])
  @@index([status, publishedAt])
  @@index([agentId])
  @@index([slug])
}

enum ProductStatus {
  DRAFT
  LIVE
  UNPUBLISHED
  ARCHIVED
}

enum ProductType {
  PDF_GUIDE
  CHECKLIST
  TEMPLATE
  SWIPE_FILE
  MINI_COURSE
  TOOLKIT
}

// ─── ASSETS ──────────────────────────────────────────────

model ProductAsset {
  id          String    @id @default(cuid())
  productId   String
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  assetType   AssetType @default(MAIN)
  filename    String
  r2Key       String    // Path in R2 bucket
  sizeBytes   Int
  mimeType    String
  
  createdAt   DateTime  @default(now())
  
  @@index([productId])
}

enum AssetType {
  MAIN      // Primary deliverable
  BONUS     // Bonus material
  PREVIEW   // Free preview/sample
}

// ─── API KEYS ─────────────────────────────────────────────

model ApiKey {
  id          String    @id @default(cuid())
  name        String    // Human label: "SkillForge Production"
  keyHash     String    @unique  // bcrypt hash of the actual key
  keyPrefix   String    // First 8 chars for identification: "sf_prod_"
  agentId     String?   // Associated agent identifier
  
  isActive    Boolean   @default(true)
  lastUsedAt  DateTime?
  
  createdAt   DateTime  @default(now())
  
  @@index([keyHash])
}

// ─── ORDERS ───────────────────────────────────────────────

model Order {
  id                String      @id @default(cuid())
  productId         String
  product           Product     @relation(fields: [productId], references: [id])
  
  // Buyer info
  buyerEmail        String
  buyerName         String?
  
  // Payment
  stripeSessionId   String      @unique
  stripePaymentId   String?
  amountPaidCents   Int
  currency          String      @default("usd")
  
  // Delivery
  downloadToken     String      @unique @default(cuid())  // Used in download URL
  downloadExpiresAt DateTime
  downloadCount     Int         @default(0)
  
  status            OrderStatus @default(PENDING)
  completedAt       DateTime?
  
  createdAt         DateTime    @default(now())
  
  @@index([buyerEmail])
  @@index([stripeSessionId])
  @@index([downloadToken])
  @@index([productId])
}

enum OrderStatus {
  PENDING     // Checkout started, not paid
  COMPLETED   // Payment confirmed, download delivered
  REFUNDED
  FAILED
}

// ─── ANALYTICS ────────────────────────────────────────────

model PageView {
  id          String    @id @default(cuid())
  productId   String
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  sessionId   String?   // Anonymous session ID
  referrer    String?
  userAgent   String?
  
  createdAt   DateTime  @default(now())
  
  @@index([productId, createdAt])
}

// ─── PIPELINE RUNS ────────────────────────────────────────

model PipelineRun {
  id            String    @id @default(cuid())
  runId         String    @unique   // SkillForge run ID
  agentId       String?
  
  productsCreated  Int    @default(0)
  productsPublished Int   @default(0)
  totalCostCents   Int?
  
  startedAt     DateTime
  completedAt   DateTime?
  status        String    // "running", "completed", "failed"
  metadata      Json?
  
  createdAt     DateTime  @default(now())
  
  @@index([runId])
  @@index([createdAt])
}
```

### 4.2 Key Design Decisions
- **`slug` is unique and auto-generated from title** at create time (URL-safe, collision-handled)
- **`downloadToken`** is a UUID on the Order — the download URL is `/download/:token`, not the product ID
- **`r2Key`** is the path in the R2 bucket — never the public URL (which doesn't exist — it's private)
- **`pageViews` is a separate table** for analytics without bloating the products table
- **`PipelineRun`** tracks each SkillForge run for the admin dashboard's pipeline view
- **Indexes on all foreign keys and common query patterns** — designed for 100k+ rows from day one

---

## 5. API Architecture

### 5.1 API Key Middleware
Every `/api/v1/*` route (except `/health`) runs through middleware:

```
Request → Extract "Authorization: Bearer <key>"
         → Hash key → Look up in api_keys table
         → If found + active: attach agentId to request context
         → If not found: return 401
```

### 5.2 Request Flow: Publish a Product

```
SkillForge Agent
    │
    ├─ POST /api/v1/products          → Create product record (DRAFT)
    │                                    Return: product_id
    │
    ├─ POST /api/v1/products/:id/assets → Multipart upload
    │                                    Stream file → Cloudflare R2 (private bucket)
    │                                    Return: asset_id, r2_key
    │
    ├─ PUT /api/v1/products/:id       → Update any metadata
    │
    └─ POST /api/v1/products/:id/publish
            │
            ├─ Validate: title + description + price + main asset ✓
            │
            ├─ Call Claude API → Generate:
            │     heroHeadline, heroSubheadline,
            │     bulletPoints[], audienceStatement,
            │     metaTitle, metaDescription
            │
            ├─ Create Stripe Product + Price
            │     stripe.products.create({ name, description, metadata })
            │     stripe.prices.create({ product, unit_amount, currency })
            │
            ├─ Generate slug from title (url-safe, unique)
            │
            ├─ Update product: status=LIVE, publishedAt, stripeProductId,
            │                  stripePriceId, all generated content
            │
            └─ Return: { status: "live", storefront_url, stripe_price_id }
```

### 5.3 Request Flow: Buyer Purchase

```
Buyer clicks "Buy Now" on product page
    │
    └─ POST /api/checkout (Next.js server action)
            │
            ├─ Create Stripe Checkout Session:
            │     line_items: [{ price: stripe_price_id, quantity: 1 }]
            │     mode: "payment"
            │     success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}
            │     cancel_url: /products/:slug
            │     customer_email: (pre-fill if known)
            │
            └─ Redirect to Stripe hosted checkout
                    │
                    └─ Buyer completes payment
                            │
                            └─ Stripe webhook fires: checkout.session.completed
                                    │
                                    ├─ Verify webhook signature
                                    ├─ Find product by stripe_price_id
                                    ├─ Create Order record:
                                    │     buyerEmail, amountPaid,
                                    │     downloadToken (UUID),
                                    │     downloadExpiresAt (now + 24h)
                                    │
                                    ├─ Send order confirmation email (Resend):
                                    │     download link: /download/:token
                                    │
                                    └─ Redirect buyer to /checkout/success
```

### 5.4 Request Flow: File Download

```
Buyer clicks download link (/download/:token)
    │
    ├─ Look up Order by downloadToken
    ├─ Check: status=COMPLETED, not expired, downloadCount < 5
    │
    ├─ Generate R2 signed URL (15-minute expiry):
    │     r2.getSignedUrl("getObject", { Bucket, Key: asset.r2Key, Expires: 900 })
    │
    └─ 302 Redirect to signed R2 URL
           │
           └─ Buyer downloads file directly from R2 CDN
```

---

## 6. Frontend Architecture

### 6.1 Rendering Strategy

| Page | Strategy | Why |
|---|---|---|
| Homepage | ISR (revalidate: 3600) | Changes when new products published; 1hr cache fine |
| Sector pages | ISR (revalidate: 3600) | Same as homepage |
| Product page | ISR (revalidate: 300) | Revalidate on publish via `revalidatePath` |
| Product listing | SSR | Supports filtering/search params |
| Checkout success | SSR | Dynamic, order-specific |
| Download page | SSR | Dynamic, token-specific |
| Admin dashboard | SSR + Client | Real-time data, no caching |

When a product is published via API, `revalidatePath('/products/[slug]')` is called — the page is live within seconds.

### 6.2 Key Components

**`ProductCard`** — Displayed in grids on homepage, sector pages, search results
```
┌──────────────────────┐
│  [Sector Badge]      │
│  Product Title       │
│  Short description   │
│                      │
│  $17.00    [Buy →]   │
└──────────────────────┘
```

**`ProductPage`** — Full auto-generated landing page
```
┌──────────────────────────────────────┐
│  [Sector] › [Sub-niche]              │ ← Breadcrumb
│                                      │
│  Hero Headline (LLM-generated)       │
│  Hero Subheadline                    │
│                                      │
│  ┌──────────────┐  ┌───────────────┐ │
│  │ What You Get │  │  $17.00       │ │
│  │ • Bullet 1   │  │  [Buy Now]    │ │
│  │ • Bullet 2   │  │               │ │
│  │ • Bullet 3   │  │  ✓ Instant    │ │
│  │              │  │  ✓ Secure     │ │
│  └──────────────┘  └───────────────┘ │
│                                      │
│  This is for you if...               │
│  [Audience statement]                │
│                                      │
│  ── Related Products ──              │
│  [Card] [Card] [Card]                │
└──────────────────────────────────────┘
```

### 6.3 Admin Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│  SkillForge Admin          [Jeff] [Logout]        │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Overview │  📊 Today: $127  |  7 sales  |  142 views │
│ Products │                                       │
│ Analytics│  ┌─────────────────────────────────┐  │
│ Pipeline │  │ Products Table                  │  │
│          │  │ Title | Sector | Status | Revenue│  │
│          │  │ ...   | ...    | LIVE   | $47    │  │
│          │  └─────────────────────────────────┘  │
│          │                                       │
└──────────┴──────────────────────────────────────┘
```

---

## 7. Infrastructure & Deployment

### 7.1 Environments

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Production | `main` | skillforge.io | Live storefront |
| Staging | `develop` | staging.skillforge.io | Integration testing |
| Preview | `feature/*` | Auto (Vercel) | Per-PR preview URLs |
| Local | — | localhost:3000 | Development |

### 7.2 Environment Variables

```bash
# Database
DATABASE_URL=                    # Supabase connection string (pooled)
DIRECT_URL=                      # Supabase direct connection (for migrations)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=               # sk_live_... (prod) / sk_test_... (dev)
STRIPE_WEBHOOK_SECRET=           # whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=skillforge-products

# Resend
RESEND_API_KEY=
FROM_EMAIL=noreply@skillforge.io

# Anthropic (LLM for landing page generation)
ANTHROPIC_API_KEY=               # Already have this

# Admin
ADMIN_EMAIL=                     # Jeff's email for admin auth

# App
NEXT_PUBLIC_APP_URL=https://skillforge.io
```

### 7.3 CI/CD Pipeline

```
Push to feature/* branch
    └─ GitHub Actions: ci.yml
         ├─ npm run typecheck
         ├─ npm run lint
         └─ npm run test (unit tests)
              │
              └─ PASS → Vercel auto-deploys preview URL

PR opened → develop
    └─ GitHub Actions: ci.yml (same checks)
    └─ Required review before merge (optional — Jeff decides)

Merge to develop
    └─ Vercel auto-deploys to staging.skillforge.io
    └─ Run integration tests against staging

Merge develop → main
    └─ Vercel auto-deploys to skillforge.io (production)
    └─ Prisma migrations run automatically on deploy
```

### 7.4 Data Backup
- Supabase: daily automated backups (included in plan)
- R2: versioning enabled on product bucket
- No additional backup infra needed for MVP

---

## 8. Security Model

### 8.1 Threat Model (MVP)
| Threat | Mitigation |
|---|---|
| Unauthorized API access | API key auth on all `/api/v1/*` routes |
| Direct file access (non-buyers) | R2 bucket is private; signed URLs only |
| Stripe webhook spoofing | Signature verification on every webhook |
| Admin access by non-admin | Supabase Auth with role check |
| Download link sharing | Token expiry (24h) + download count limit (5) |
| SQL injection | Prisma parameterized queries (no raw SQL) |
| XSS | Next.js escaping + React's built-in protections |

### 8.2 API Key Security
- Keys are generated as `sf_<random_32_bytes_hex>`
- Stored as bcrypt hash in DB (never plaintext)
- Key prefix stored for identification without exposing full key
- Keys can be revoked (set `isActive = false`)

---

## 9. Third-Party Service Summary

| Service | What It Does | Cost (estimated) |
|---|---|---|
| Vercel | Hosting + CDN + preview deployments | Free tier → ~$20/mo at scale |
| Supabase | Database + Auth | Free tier → $25/mo at scale |
| Stripe | Payments | 2.9% + 30¢ per transaction |
| Cloudflare R2 | File storage + CDN | $0.015/GB storage, free egress |
| Resend | Transactional email | Free 3k/mo → $20/mo at scale |
| Anthropic | LLM for landing pages | ~$0.01–0.05 per publish |

**Total platform cost at MVP scale: ~$0–45/mo fixed + Stripe % per sale**  
(vs. losing 5–10% of every sale to third parties + no customer data ownership)
