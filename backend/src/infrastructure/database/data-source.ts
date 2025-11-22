import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";
import { fileURLToPath, URL } from "url";
import { promises as dns } from "node:dns";
import net from "node:net";
import { User } from "./entities/User.js";
import { Meal } from "./entities/Meal.js";
import { Goal } from "./entities/Goal.js";
import { Workout } from "./entities/Workout.js";
import { Exercise } from "./entities/Exercise.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Entities array
const entities = [User, Meal, Goal, Workout, Exercise];

// Check if we're using Supabase/PostgreSQL or local SQLite
const isProduction = process.env.DATABASE_URL !== undefined;

let dataSourceConfig: DataSourceOptions;

// Helper to resolve IPv4
const resolveDatabaseUrl = async (originalUrl: string): Promise<string> => {
  try {
    const urlObj = new URL(originalUrl);
    const hostname = urlObj.hostname;

    // If it's already an IP, return as is
    if (net.isIP(hostname)) return originalUrl;

    console.log(`🔍 Resolving DNS for ${hostname}...`);
    const addresses = await dns.resolve4(hostname);
    
    if (addresses && addresses.length > 0) {
      console.log(`✅ Resolved ${hostname} to IPv4: ${addresses[0]}`);
      urlObj.hostname = addresses[0];
      return urlObj.toString();
    }
  } catch (error) {
    console.warn("⚠️ DNS Resolution failed, falling back to original URL:", error);
  }
  return originalUrl;
};

if (isProduction) {
  if (!process.env.DATABASE_URL) {
    console.error("❌ FATAL ERROR: DATABASE_URL is missing in production environment!");
    process.exit(1);
  }

  // Resolve URL to IPv4 before creating config
  // Note: Top-level await is supported in ES Modules
  const connectionUrl = await resolveDatabaseUrl(process.env.DATABASE_URL);

  // Production: Use PostgreSQL (Supabase)
  dataSourceConfig = {
    type: "postgres",
    url: connectionUrl,
    synchronize: process.env.DB_SYNC === "true", // Allow auto-schema sync via env var
    logging: process.env.NODE_ENV === "development",
    entities,
    migrations: [],
    subscribers: [],
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
    extra: {
      family: 4 // Force IPv4 to avoid ENETUNREACH errors
    }
  };
} else {
  // Development: Use SQLite
  dataSourceConfig = {
    type: "better-sqlite3",
    database: path.join(__dirname, "../../../database.sqlite"),
    synchronize: true, // Auto-create tables in development
    logging: false,
    entities,
    migrations: [],
    subscribers: [],
  };
}

export const AppDataSource = new DataSource(dataSourceConfig);

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database initialized successfully");
    return AppDataSource;
  } catch (error) {
    console.error("❌ Error during Data Source initialization:", error);
    throw error;
  }
};
