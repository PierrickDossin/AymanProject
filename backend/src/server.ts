import "reflect-metadata";
import dotenv from "dotenv";
import dns from "node:dns";

// Force IPv4 to avoid ENETUNREACH errors with Supabase/Railway
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";
import usersRoutes from "./routes/users.js";
import mealsRoutes from "./routes/meals.js";
import goalsRoutes from "./routes/goals.js";
import exercisesRoutes from "./routes/exercises.js";
import workoutsRoutes from "./routes/workouts.js";
import agentsRoutes from "./routes/agents.js";
import authRoutes from "./routes/auth.js";
import exerciseLogsRoutes from "./routes/exercise-logs.js";
import { initializeDatabase } from "./infrastructure/database/data-source.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:8080",
      "https://lift-grow-thrive.vercel.app"
    ];
    
    // Check if origin matches allowed list or Vercel regex
    if (allowedOrigins.indexOf(origin) !== -1 || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    
    console.log("Blocked by CORS:", origin);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Debug middleware to log incoming requests and origins
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

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
app.use("/api/exercise-logs", exerciseLogsRoutes);

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
