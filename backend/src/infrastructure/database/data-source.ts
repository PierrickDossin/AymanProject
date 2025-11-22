import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
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

if (isProduction) {
  if (!process.env.DATABASE_URL) {
    console.error("❌ FATAL ERROR: DATABASE_URL is missing in production environment!");
    process.exit(1);
  }
  // Production: Use PostgreSQL (Supabase)
  dataSourceConfig = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // IMPORTANT: Never use synchronize in production
    logging: process.env.NODE_ENV === "development",
    entities,
    migrations: [],
    subscribers: [],
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
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
