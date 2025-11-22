import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./entities/User";
import { Meal } from "./entities/Meal";
import { Goal } from "./entities/Goal";
import { Workout } from "./entities/Workout";
import { Exercise } from "./entities/Exercise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(__dirname, "../../../database.sqlite"),
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  entities: [User, Meal, Goal, Workout, Exercise],
  migrations: [],
  subscribers: [],
});

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
