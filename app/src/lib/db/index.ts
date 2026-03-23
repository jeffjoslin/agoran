/**
 * lib/db/index.ts
 * Prisma client singleton for Agoran
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   const product = await db.product.findUnique({ where: { id } });
 *
 * Notes:
 * - Prisma v7 requires a driver adapter — we use @prisma/adapter-pg with pg
 * - In production (Vercel), we use DATABASE_URL (pgbouncer pooled) for queries
 * - Migrations use DIRECT_URL (direct connection, bypasses pgbouncer)
 * - A global singleton prevents connection pool exhaustion during hot reloads in dev
 */

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

// Determine connection string — prefer DIRECT_URL for server-side to bypass RLS
// PrismaClient bypasses Supabase RLS because it connects directly to PostgreSQL
// (not through PostgREST), so service role is not needed here.
const connectionString =
  process.env.DATABASE_URL ||
  (() => {
    throw new Error("DATABASE_URL environment variable is not set");
  })();

function createPrismaClient() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Global singleton to prevent multiple instances during Next.js hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const db: PrismaClient =
  globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
