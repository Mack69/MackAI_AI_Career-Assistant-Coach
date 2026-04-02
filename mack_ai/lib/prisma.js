
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;