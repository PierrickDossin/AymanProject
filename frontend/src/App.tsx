import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import ChooseGoal from "./pages/ChooseGoal";
import SetGoal from "./pages/SetGoal";
import GoalDetails from "./pages/GoalDetails";
import Nutrition from "./pages/Nutrition";
import AddMeal from "./pages/AddMeal";
import CalorieGoals from "./pages/CalorieGoals";
import Training from "./pages/Training";
import WorkoutPlanner from "./pages/WorkoutPlanner";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ActiveWorkout from "./pages/ActiveWorkout";
import DatabaseViewer from "./pages/DatabaseViewer";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/goals/choose" element={<ProtectedRoute><ChooseGoal /></ProtectedRoute>} />
            <Route path="/goals/:type" element={<ProtectedRoute><SetGoal /></ProtectedRoute>} />
            <Route path="/goals/details/:id" element={<ProtectedRoute><GoalDetails /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/nutrition/goals" element={<ProtectedRoute><CalorieGoals /></ProtectedRoute>} />
            <Route path="/nutrition/add/:mealType" element={<ProtectedRoute><AddMeal /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
            <Route path="/training/planner" element={<ProtectedRoute><WorkoutPlanner /></ProtectedRoute>} />
            <Route path="/training/exercises" element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>} />
            <Route path="/training/active" element={<ProtectedRoute><ActiveWorkout /></ProtectedRoute>} />
            <Route path="/database" element={<ProtectedRoute><DatabaseViewer /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
