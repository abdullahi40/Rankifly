import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const shouldUseSsl =
  !!connectionString &&
  (process.env.NODE_ENV === "production" ||
    process.env.PGSSLMODE === "require" ||
    /neon\.tech|neondb|render\.com|supabase/i.test(connectionString) ||
    process.env.DB_USE_SSL === "true");

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "Rankifly",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl:
        process.env.NODE_ENV === "production" ||
        process.env.PGSSLMODE === "require"
          ? { rejectUnauthorized: false }
          : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
