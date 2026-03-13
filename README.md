# Agoran

The agent-native digital product marketplace.

## Overview

Agoran is a storefront for AI-generated digital products. An autonomous pipeline (SkillForge) discovers trends, builds digital products, and publishes them here via API. Human buyers browse, purchase, and receive instant downloads.

**Stack:** Next.js 14 (App Router) · TypeScript · Supabase (PostgreSQL) · Prisma · Cloudflare R2 · Stripe · Resend · Vercel

## Local Dev Setup

```bash
cd app
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
```

## Vercel Setup (Manual)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `jeffjoslin/agoran` from GitHub
3. Set environment variables from `app/.env.example`
4. Deploy — Vercel auto-detects Next.js via `vercel.json`
5. Set up three environments: Production (main), Preview (develop), Development

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
- `develop → main` = Jeff approves + staging is green
