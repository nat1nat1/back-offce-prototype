import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No database connection string found.");
  console.error("Please set DATABASE_URL or SUPABASE_DATABASE_URL environment variable.");
  process.exit(1);
}

const isExternal = connectionString.includes("supabase") || connectionString.includes("pooler");

export const pool = new Pool({
  connectionString,
  ...(isExternal ? { ssl: { rejectUnauthorized: false } } : {}),
});
export const db = drizzle(pool, { schema });
