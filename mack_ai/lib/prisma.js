import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// ✅ Ensure env exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// ✅ Create pg pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ Create adapter
const adapter = new PrismaPg(pool);

// ✅ Prevent multiple instances (Next.js)
const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // 🔥 REQUIRED
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
