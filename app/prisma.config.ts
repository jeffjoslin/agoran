// Prisma v7 config — connection URLs and seed live here, not in schema.prisma
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first (Next.js convention), then fall back to .env
config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
    // directUrl is configured at runtime via DIRECT_URL env var for migrations
  },
});
