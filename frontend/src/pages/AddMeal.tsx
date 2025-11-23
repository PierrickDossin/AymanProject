import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, type FoodItem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AddMeal = () => {
  const { mealType } = useParams<{ mealType: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentFood, setCurrentFood] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ index: number; name: string } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const mealName = mealType?.charAt(0).toUpperCase() + mealType?.slice(1) || "Meal";

  // Check if meal already exists
  const { data: existingMeals = [] } = useQuery({
    queryKey: ["meals", today, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getMeals(user.id, today);
    },
    enabled: !!user?.id,
  });

  const existingMeal = existingMeals.find(m => m.type === mealType);

  const addOrUpdateFood = () => {
    if (!currentFood.name || currentFood.calories === 0) {
      return;
    }

    const foodItem: FoodItem = {
      id: editingIndex !== null ? foodItems[editingIndex].id : crypto.randomUUID(),
      ...currentFood,
    };

    if (editingIndex !== null) {
      // Update existing food
      const updated = [...foodItems];
      updated[editingIndex] = foodItem;
      setFoodItems(updated);
      setEditingIndex(null);
    } else {
      // Add new food
      setFoodItems([...foodItems, foodItem]);
    }

    // Reset form
    setCurrentFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  };

  const editFood = (index: number) => {
    setCurrentFood(foodItems[index]);
    setEditingIndex(index);
  };

  const removeFood = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
    setDeleteConfirm(null);
  };

  const handleDeleteClick = (index: number, name: string) => {
    setDeleteConfirm({ index, name });
  };

  const totalNutrition = foodItems.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const saveMealMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      if (existingMeal) {
        // Merge with existing meal items
        const existingItems = existingMeal.items || [];
        const mergedItems = [...existingItems, ...foodItems];
        
        const newTotals = mergedItems.reduce(
          (acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        await api.updateMeal(existingMeal.id, {
          items: mergedItems,
          ...newTotals,
        });
      } else {
        // Create new meal
        await api.createMeal({
          userId: user.id,
          name: mealName,
          type: mealType as "breakfast" | "lunch" | "dinner" | "snack",
          items: foodItems,
          ...totalNutrition,
          date: today,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      navigate("/nutrition");
    },
    onError: () => {
      // Silent error handling
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/nutrition")}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground capitalize">
                {mealType}
              </h1>
              <p className="text-sm text-muted-foreground">Add foods</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Existing Meal Info */}
        {existingMeal && existingMeal.calories > 0 && (
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-foreground mb-2">Current {mealName}</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Calories</p>
                <p className="font-semibold">{existingMeal.calories}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="font-semibold">{Math.round(existingMeal.protein)}g</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="font-semibold">{Math.round(existingMeal.carbs)}g</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="font-semibold">{Math.round(existingMeal.fat)}g</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              New values will be added to these totals
            </p>
          </Card>
        )}

        {/* Add Meal Form */}
        <Card className="p-5 shadow-medium">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {editingIndex !== null ? "Edit Food Item" : "Add Food Item"}
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foodName">Food Name</Label>
              <Input
                id="foodName"
                placeholder="e.g., Chicken breast with rice"
                value={currentFood.name}
                onChange={(e) => setCurrentFood({ ...currentFood, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={currentFood.calories || ""}
                  onChange={(e) => setCurrentFood({ ...currentFood, calories: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  value={currentFood.protein || ""}
                  onChange={(e) => setCurrentFood({ ...currentFood, protein: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="0"
                  value={currentFood.carbs || ""}
                  onChange={(e) => setCurrentFood({ ...currentFood, carbs: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  value={currentFood.fat || ""}
                  onChange={(e) => setCurrentFood({ ...currentFood, fat: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <Button
              onClick={addOrUpdateFood}
              disabled={!currentFood.name || currentFood.calories === 0}
              className="w-full"
              size="lg"
            >
              <Plus size={18} className="mr-2" />
              {editingIndex !== null ? "Update Food" : "Add Food"}
            </Button>
          </div>
        </Card>

        {/* Food Items List */}
        {foodItems.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Added Foods ({foodItems.length})
            </h2>
            {foodItems.map((food, index) => (
              <Card key={food.id} className="p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{food.name}</h3>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{food.calories} kcal</span>
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fat}g</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editFood(index)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(index, food.name)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Total Nutrition */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">Total Nutrition</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-semibold text-foreground">{totalNutrition.calories}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-semibold text-foreground">{Math.round(totalNutrition.protein)}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-semibold text-foreground">{Math.round(totalNutrition.carbs)}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-semibold text-foreground">{Math.round(totalNutrition.fat)}g</p>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => saveMealMutation.mutate()}
              disabled={saveMealMutation.isPending}
              className="w-full"
              size="lg"
            >
              {saveMealMutation.isPending ? "Saving..." : `Save to ${mealName}`}
            </Button>
          </section>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Food Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{deleteConfirm?.name}" from this meal?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && removeFood(deleteConfirm.index)} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddMeal;
