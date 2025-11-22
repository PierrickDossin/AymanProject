export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack"
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: MealType;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items?: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealDTO {
  userId: string;
  name: string;
  type: MealType;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items?: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
}

export interface UpdateMealDTO {
  name?: string;
  type?: MealType;
  date?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  items?: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
}
