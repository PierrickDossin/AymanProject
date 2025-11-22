import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport";
import usersRoutes from "./routes/users";
import mealsRoutes from "./routes/meals";
import goalsRoutes from "./routes/goals";
import exercisesRoutes from "./routes/exercises";
import workoutsRoutes from "./routes/workouts";
import agentsRoutes from "./routes/agents";
import authRoutes from "./routes/auth";
import { initializeDatabase } from "./infrastructure/database/data-source";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(morgan("dev"));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/agents", agentsRoutes);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: SQLite (database.sqlite)`);
      console.log(`📡 Routes:`);
      console.log(`   - /api/users (GET, POST, PUT, DELETE)`);
      console.log(`   - /api/meals (GET, POST, PUT, DELETE)`);
      console.log(`   - /api/meals/:mealId/items/:foodId (DELETE)`);
      console.log(`   - /api/meals/totals (GET)`);
      console.log(`   - /api/goals (GET, POST, PUT, PATCH, DELETE)`);
      console.log(`   - /api/exercises (GET, POST, PUT, DELETE)`);
      console.log(`   - /api/workouts (GET, POST, PUT, PATCH, DELETE)`);
      console.log(`   - /api/agents/analyze (POST)`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
