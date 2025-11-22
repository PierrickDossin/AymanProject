// API client for the backend
const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }
  return url;
}
const API_BASE_URL = getApiUrl();

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  description?: string;
  items?: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: "muscle_mass" | "weight" | "performance" | "body_fat";
  exerciseName?: string;
  description?: string;
  currentValue: number;
  goalValue: number;
  metric: "kg" | "lbs" | "%" | "reps" | "seconds" | "minutes";
  targetDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description?: string;
  imageUrl?: string;
  rating: number;
  difficulty: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  duration: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  scheduledDate: string;
  exercises: PlannedExercise[];
  totalDuration: number;
  status: string;
  completedAt: Date | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users");
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Meals
  async getMeals(userId: string, date?: string): Promise<Meal[]> {
    const params = new URLSearchParams({ userId });
    if (date) params.append("date", date);
    return this.request<Meal[]>(`/meals?${params.toString()}`);
  }

  async createMeal(data: {
    userId: string;
    name: string;
    type: "breakfast" | "lunch" | "dinner" | "snack";
    date: string;
    description?: string;
    items?: FoodItem[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }): Promise<Meal> {
    return this.request<Meal>("/meals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMeal(id: string, data: Partial<{
    name: string;
    type: "breakfast" | "lunch" | "dinner" | "snack";
    description: string;
    items: FoodItem[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>): Promise<Meal> {
    return this.request<Meal>(`/meals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMeal(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/meals/${id}`, {
      method: "DELETE",
    });
  }

  async deleteFoodItem(mealId: string, foodId: string): Promise<Meal> {
    return this.request<Meal>(`/meals/${mealId}/items/${foodId}`, {
      method: "DELETE",
    });
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    const params = new URLSearchParams({ userId });
    return this.request<Goal[]>(`/goals?${params.toString()}`);
  }

  async getGoal(id: string): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}`);
  }

  async createGoal(data: {
    userId: string;
    name: string;
    type: "muscle_mass" | "weight" | "performance" | "body_fat";
    exerciseName?: string;
    description?: string;
    currentValue: number;
    goalValue: number;
    metric: "kg" | "lbs" | "%" | "reps" | "seconds" | "minutes";
    targetDate?: string;
  }): Promise<Goal> {
    return this.request<Goal>("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: Partial<{
    name: string;
    exerciseName: string;
    description: string;
    currentValue: number;
    goalValue: number;
    metric: string;
    targetDate: string;
    status: string;
  }>): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  async getGoalProgress(id: string): Promise<{
    goal: Goal;
    currentValue: number;
    goalValue: number;
    difference: number;
    progressPercentage: number;
    isCompleted: boolean;
  }> {
    return this.request(`/goals/${id}/progress`);
  }

  async updateGoalProgress(id: string, currentValue: number): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ currentValue }),
    });
  }

  async getMealTotals(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }> {
    const params = new URLSearchParams({ userId, date });
    return this.request(`/meals/totals?${params.toString()}`);
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: User; token?: string }> {
    return this.request<{ user: User; token?: string }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token?: string }> {
    const user = await this.createUser(data);
    return { user };
  }

  async socialLogin(provider: string): Promise<{ user: User; token?: string }> {
    // Simulate getting email/name from provider
    const mockEmail = `user_${Math.floor(Math.random() * 1000)}@${provider.toLowerCase()}.com`;
    const mockName = `${provider} User`;

    return this.request<{ user: User; token?: string }>("/users/social-login", {
      method: "POST",
      body: JSON.stringify({
        provider,
        email: mockEmail,
        name: mockName
      }),
    });
  }

  // Exercises
  async getExercises(params?: {
    muscleGroup?: string;
    equipment?: string;
    search?: string;
  }): Promise<Exercise[]> {
    const searchParams = new URLSearchParams();
    if (params?.muscleGroup) searchParams.append("muscleGroup", params.muscleGroup);
    if (params?.equipment) searchParams.append("equipment", params.equipment);
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    return this.request<Exercise[]>(`/exercises${queryString ? `?${queryString}` : ""}`);
  }

  async getExercise(id: string): Promise<Exercise> {
    return this.request<Exercise>(`/exercises/${id}`);
  }

  async seedExercises(): Promise<{ message: string; count: number }> {
    return this.request<{ message: string; count: number }>("/exercises/seed", {
      method: "POST",
    });
  }

  // Workouts
  async getWorkouts(userId: string): Promise<Workout[]> {
    const params = new URLSearchParams({ userId });
    return this.request<Workout[]>(`/workouts?${params.toString()}`);
  }

  async getWorkout(id: string): Promise<Workout> {
    return this.request<Workout>(`/workouts/${id}`);
  }

  async getTodayWorkout(userId: string, date: string): Promise<Workout | null> {
    const params = new URLSearchParams({ userId, date });
    return this.request<Workout | null>(`/workouts/today?${params.toString()}`);
  }

  async getUpcomingWorkouts(userId: string, fromDate: string, limit?: number): Promise<Workout[]> {
    const params = new URLSearchParams({ userId, fromDate });
    if (limit) params.append("limit", limit.toString());
    return this.request<Workout[]>(`/workouts/upcoming?${params.toString()}`);
  }

  async getWorkoutsByDateRange(userId: string, startDate: string, endDate: string): Promise<Workout[]> {
    const params = new URLSearchParams({ userId, startDate, endDate });
    return this.request<Workout[]>(`/workouts/range?${params.toString()}`);
  }

  async getWeeklyWorkoutStats(userId: string, weekStart: string, weekEnd: string): Promise<{
    totalWorkouts: number;
    completedWorkouts: number;
    plannedWorkouts: number;
  }> {
    const params = new URLSearchParams({ userId, weekStart, weekEnd });
    return this.request(`/workouts/stats/weekly?${params.toString()}`);
  }

  async createWorkout(data: {
    userId: string;
    name: string;
    scheduledDate: string;
    exercises: PlannedExercise[];
  }): Promise<Workout> {
    return this.request<Workout>("/workouts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWorkout(id: string, data: Partial<Workout>): Promise<Workout> {
    return this.request<Workout>(`/workouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async completeWorkout(id: string): Promise<Workout> {
    return this.request<Workout>(`/workouts/${id}/complete`, {
      method: "PATCH",
    });
  }

  async deleteWorkout(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/workouts/${id}`, {
      method: "DELETE",
    });
  }

  async duplicateWorkout(id: string, newDate: string): Promise<Workout> {
    return this.request<Workout>(`/workouts/${id}/duplicate`, {
      method: "POST",
      body: JSON.stringify({ newDate }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
