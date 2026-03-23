# HANDOFF.md — Agoran Session State

> **Repo location:** Place this file at the **root** of the `agoran` repo.
> Update this file at the **end of every session** — no exceptions.
> Read this file at the **start of every session** before touching any code.

---

## Current State

| Field | Value |
|---|---|
| **Active Sprint** | Sprint 2 — Agent API |
| **Current Branch** | feature/sprint-1-database (PR open to develop) |
| **Last Task Completed** | Sprint 1 — Database schema, migrations, seed data, Prisma client singleton |
| **Next Task** | Sprint 2 — Agent Publishing API (feature/sprint-2-agent-api) |
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

## Recent Work Log

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
