/**
 * prisma/seed.ts
 * Agoran — Sprint 1 Seed Data
 *
 * Seeds: 3 LIVE products (ai, finance, health sectors), 1 API key, 1 pipeline run
 */

// Load env vars before Prisma client import
import { config } from "dotenv";
config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

// Use DIRECT_URL for seeding (bypasses pgbouncer transaction mode issues)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Agoran database...");

  // ─── Product 1: AI sector ───────────────────────────────────
  const product1 = await prisma.product.upsert({
    where: { slug: "ai-prompt-engineering-masterclass" },
    update: {},
    create: {
      slug: "ai-prompt-engineering-masterclass",
      title: "AI Prompt Engineering Masterclass",
      description:
        "The complete guide to crafting prompts that get 10x better results from GPT-4, Claude, and Gemini. Covers chain-of-thought reasoning, few-shot learning, prompt chaining, and advanced techniques used by top AI engineers. Includes 50+ battle-tested prompt templates for business, coding, marketing, and research tasks.",
      shortDescription:
        "50+ battle-tested prompt templates and techniques for GPT-4, Claude, and Gemini.",
      sector: "ai",
      subNiche: "prompt-engineering",
      productType: "PDF_GUIDE",
      targetAudience: [
        "developers",
        "marketers",
        "entrepreneurs",
        "ai-enthusiasts",
      ],
      tags: [
        "ai",
        "prompting",
        "gpt-4",
        "claude",
        "productivity",
        "templates",
      ],
      priceCents: 1700,
      currency: "usd",
      status: "LIVE",
      publishedAt: new Date("2026-03-01T10:00:00Z"),
      heroHeadline: "Stop Wasting Time on Bad AI Prompts",
      heroSubheadline:
        "The only guide you need to get professional-grade output from any AI model — every single time.",
      bulletPoints: [
        "50+ copy-paste prompt templates for business, coding, and marketing",
        "Chain-of-thought techniques that double AI output quality",
        "The 5-step framework for prompts that never fail",
        "Advanced few-shot examples for every major use case",
        "How top AI engineers prompt differently than everyone else",
      ],
      audienceStatement:
        "This is for you if you use AI daily but still get mediocre results, waste time reprompting, or feel like you are leaving value on the table.",
      metaTitle:
        "AI Prompt Engineering Masterclass — 50+ Templates & Techniques",
      metaDescription:
        "Master AI prompt engineering with 50+ battle-tested templates for GPT-4, Claude, and Gemini. Techniques used by top AI engineers. Instant PDF download.",
      agentId: "skillforge-agent-v1",
      runMetadata: {
        trendScore: 92,
        qualityScore: 88,
        runId: "run_20260301_001",
        sourceTopics: ["prompt engineering", "ai productivity", "llm tips"],
      },
    },
  });

  console.log("Created product: " + product1.title);

  // ─── Product 2: Finance sector ──────────────────────────────
  const product2 = await prisma.product.upsert({
    where: { slug: "personal-finance-freedom-blueprint" },
    update: {},
    create: {
      slug: "personal-finance-freedom-blueprint",
      title: "Personal Finance Freedom Blueprint",
      description:
        "A step-by-step system for eliminating debt, building a 6-month emergency fund, and investing your first $10,000 — even on an average salary. Includes the exact spreadsheets, investment allocation templates, and automation scripts used to go from paycheck-to-paycheck to financially free in 24 months.",
      shortDescription:
        "Eliminate debt and invest your first $10k with exact templates and a proven 24-month system.",
      sector: "finance",
      subNiche: "personal-finance",
      productType: "TOOLKIT",
      targetAudience: [
        "young-professionals",
        "recent-graduates",
        "debt-holders",
        "beginner-investors",
      ],
      tags: [
        "finance",
        "investing",
        "debt-free",
        "budgeting",
        "financial-freedom",
        "spreadsheets",
      ],
      priceCents: 2700,
      currency: "usd",
      status: "LIVE",
      publishedAt: new Date("2026-03-05T14:00:00Z"),
      heroHeadline: "Go From Broke to Building Wealth in 24 Months",
      heroSubheadline:
        "The exact system — spreadsheets included — to eliminate debt and invest your first $10k, even on an average income.",
      bulletPoints: [
        "The Zero-Based Budget Spreadsheet that eliminates financial guesswork",
        "Debt Avalanche vs Snowball calculator — optimized for your situation",
        "Auto-invest setup guide: set it and forget it investment automation",
        "Emergency fund accelerator: reach 6 months savings in 12 months",
        "First $10k investment allocation template (index funds + allocation %)",
      ],
      audienceStatement:
        "This is for you if you are tired of living paycheck-to-paycheck, carrying credit card debt, or watching your money disappear every month with nothing to show for it.",
      metaTitle:
        "Personal Finance Freedom Blueprint — Debt-Free & Investing Toolkit",
      metaDescription:
        "Eliminate debt and invest your first $10,000 with proven spreadsheets and a 24-month system. Instant download toolkit for personal financial freedom.",
      agentId: "skillforge-agent-v1",
      runMetadata: {
        trendScore: 87,
        qualityScore: 91,
        runId: "run_20260305_001",
        sourceTopics: [
          "personal finance",
          "debt elimination",
          "investing basics",
        ],
      },
    },
  });

  console.log("Created product: " + product2.title);

  // ─── Product 3: Health sector ───────────────────────────────
  const product3 = await prisma.product.upsert({
    where: { slug: "90-day-metabolic-reset-guide" },
    update: {},
    create: {
      slug: "90-day-metabolic-reset-guide",
      title: "90-Day Metabolic Reset Guide",
      description:
        "A science-backed protocol to reset your metabolism, reduce chronic inflammation, and achieve sustainable fat loss without calorie counting or extreme diets. Based on the latest research in chrono-nutrition, insulin sensitivity, and gut microbiome optimization. Includes meal plans, fasting protocols, supplement stacks, and weekly tracking sheets.",
      shortDescription:
        "Reset your metabolism and lose fat sustainably — no calorie counting, backed by science.",
      sector: "health",
      subNiche: "metabolic-health",
      productType: "MINI_COURSE",
      targetAudience: [
        "adults-30-plus",
        "slow-metabolism",
        "chronic-dieters",
        "health-optimizers",
        "biohackers",
      ],
      tags: [
        "health",
        "metabolism",
        "fat-loss",
        "nutrition",
        "fasting",
        "inflammation",
        "gut-health",
      ],
      priceCents: 3700,
      currency: "usd",
      status: "LIVE",
      publishedAt: new Date("2026-03-10T09:00:00Z"),
      heroHeadline: "Your Metabolism Is Not Broken — It Is Just Miscalibrated",
      heroSubheadline:
        "The 90-day science-backed protocol to reset your metabolism, end yo-yo dieting, and achieve sustainable fat loss — without counting a single calorie.",
      bulletPoints: [
        "Chrono-nutrition meal timing protocol that optimizes insulin sensitivity",
        "12-week progressive fasting schedule — starting at 12 hours, scaling to 18",
        "Anti-inflammatory food swaps and gut microbiome optimization plan",
        "Weekly metabolic tracking template with biomarker reference ranges",
        "Science-backed supplement stack (with doses) for metabolic optimization",
      ],
      audienceStatement:
        "This is for you if you have tried every diet, work out consistently, but still cannot shift stubborn weight — and suspect your metabolism may be working against you.",
      metaTitle:
        "90-Day Metabolic Reset Guide — Science-Backed Fat Loss Protocol",
      metaDescription:
        "Reset your metabolism in 90 days with a science-backed protocol. Chrono-nutrition, fasting schedules, meal plans and supplement guide. Instant download.",
      agentId: "skillforge-agent-v1",
      runMetadata: {
        trendScore: 94,
        qualityScore: 89,
        runId: "run_20260310_001",
        sourceTopics: [
          "metabolic health",
          "intermittent fasting",
          "inflammation reduction",
        ],
      },
    },
  });

  console.log("Created product: " + product3.title);

  // ─── API Key ────────────────────────────────────────────────
  const apiKey = await prisma.apiKey.upsert({
    where: {
      keyHash: "$2b$10$seed_hash_skillforge_production_key_placeholder",
    },
    update: {},
    create: {
      name: "SkillForge Production",
      keyHash: "$2b$10$seed_hash_skillforge_production_key_placeholder",
      keyPrefix: "sf_prod_",
      agentId: "skillforge-agent-v1",
      isActive: true,
    },
  });

  console.log(
    "Created API key: " + apiKey.name + " (prefix: " + apiKey.keyPrefix + ")"
  );

  // ─── Pipeline Run ───────────────────────────────────────────
  const pipelineRun = await prisma.pipelineRun.upsert({
    where: { runId: "run_20260310_001" },
    update: {},
    create: {
      runId: "run_20260310_001",
      agentId: "skillforge-agent-v1",
      productsCreated: 3,
      productsPublished: 3,
      totalCostCents: 47,
      startedAt: new Date("2026-03-10T08:45:00Z"),
      completedAt: new Date("2026-03-10T09:12:00Z"),
      status: "completed",
      metadata: {
        trendsAnalyzed: 47,
        productsAttempted: 4,
        productsFailed: 1,
        failureReasons: ["duplicate_slug"],
        totalTokensUsed: 38450,
        estimatedCostUsd: 0.47,
      },
    },
  });

  console.log("Created pipeline run: " + pipelineRun.runId);

  console.log("\nSeed complete!");
  console.log("   Products: 3 LIVE (ai, finance, health)");
  console.log("   API Keys: 1");
  console.log("   Pipeline Runs: 1");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
