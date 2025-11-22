import BottomNav from "@/components/BottomNav";
import CircularProgress from "@/components/CircularProgress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Apple, Coffee, UtensilsCrossed, Moon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api, type Meal as ApiMeal } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const MEAL_CATEGORIES = [
  { name: "Breakfast", icon: Coffee, type: "breakfast" as const },
  { name: "Lunch", icon: UtensilsCrossed, type: "lunch" as const },
  { name: "Dinner", icon: Moon, type: "dinner" as const },
  { name: "Snack", icon: Apple, type: "snack" as const },
];

export default function Nutrition() {
  const { user } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<ApiMeal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ mealId: string; foodId: string; foodName: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];

  // Fetch meals for today
  const { data: mealsData = [] } = useQuery({
    queryKey: ["meals", today, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getMeals(user.id, today);
    },
    enabled: !!user?.id,
  });

  const handleMealClick = (meal: ApiMeal) => {
    setSelectedMeal(meal);
  };

  const deleteFoodMutation = useMutation({
    mutationFn: async ({ mealId, foodId }: { mealId: string; foodId: string }) => {
      return api.deleteFoodItem(mealId, foodId);
    },
    onSuccess: (updatedMeal) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast({ title: "Food item deleted" });
      setDeleteConfirm(null);
      
      // If there are no more items, close the dialog
      if (!updatedMeal.items || updatedMeal.items.length === 0) {
        setSelectedMeal(null);
      } else {
        // Update the selected meal with the new data
        setSelectedMeal(updatedMeal);
      }
    },
    onError: () => {
      toast({ title: "Failed to delete food item", variant: "destructive" });
      setDeleteConfirm(null);
    },
  });

  const handleDeleteFood = (mealId: string, foodId: string, foodName: string) => {
    setDeleteConfirm({ mealId, foodId, foodName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteFoodMutation.mutate({ mealId: deleteConfirm.mealId, foodId: deleteConfirm.foodId });
    }
  };

  // Calculate daily totals
  const totals = mealsData.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Nutrition</h1>
            <p className="text-sm text-muted-foreground mt-1">Today</p>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <section className="animate-slide-up">
          <Card className="p-6 shadow-medium">
            <div className="flex justify-around items-center mb-6">
              <CircularProgress value={totals.calories} max={2400} color="hsl(197, 92%, 50%)" label="Consumed" sublabel="kcal" />
              <CircularProgress value={420} max={600} color="hsl(25, 95%, 53%)" label="Burned" sublabel="kcal" />
              <CircularProgress value={Math.max(0, 2400 - totals.calories)} max={2400} color="hsl(142, 71%, 45%)" label="Remaining" sublabel="kcal" />
            </div>
          </Card>
        </section>

        {/* Macros Progress Bars */}
        <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <Card className="p-6 shadow-medium">
            <h3 className="font-semibold text-foreground mb-4">Macros</h3>
            <div className="space-y-4">
              {/* Protein */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Protein</span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(totals.protein)}g / 180g
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totals.protein / 180) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Carbs</span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(totals.carbs)}g / 250g
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totals.carbs / 250) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Fat</span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(totals.fat)}g / 65g
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totals.fat / 65) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Today's Meals</h2>
          {MEAL_CATEGORIES.map((category) => {
            const meal = mealsData.find(m => m.type === category.type);
            const Icon = category.icon;
            return (
              <Card key={category.name} className="p-4 shadow-soft hover:shadow-medium transition-shadow duration-300">
                {meal ? (
                  <div 
                    className="flex items-start gap-4 cursor-pointer" 
                    onClick={() => handleMealClick(meal)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{meal.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            P: {Math.round(meal.protein)}g • C: {Math.round(meal.carbs)}g • F: {Math.round(meal.fat)}g
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{meal.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={`/nutrition/add/${category.type}`}>
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Click to add meal</p>
                      </div>
                      <Plus className="text-muted-foreground" size={20} />
                    </div>
                  </Link>
                )}
              </Card>
            );
          })}
        </section>

        {/* Meal Detail Modal */}
        <Dialog open={!!selectedMeal} onOpenChange={(open) => !open && setSelectedMeal(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedMeal && (() => {
                  const category = MEAL_CATEGORIES.find(c => c.type === selectedMeal.type);
                  const Icon = category?.icon || Coffee;
                  return (
                    <>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedMeal.name}</h2>
                        <p className="text-sm text-muted-foreground font-normal">
                          {selectedMeal.calories} kcal total
                        </p>
                      </div>
                    </>
                  );
                })()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Nutrition Summary */}
              {selectedMeal && (
                <>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <h3 className="font-semibold text-foreground mb-3">Nutrition Summary</h3>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="font-semibold text-foreground">{selectedMeal.calories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="font-semibold text-foreground">{Math.round(selectedMeal.protein)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="font-semibold text-foreground">{Math.round(selectedMeal.carbs)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fat</p>
                        <p className="font-semibold text-foreground">{Math.round(selectedMeal.fat)}g</p>
                      </div>
                    </div>
                  </Card>

                  {/* Food Items List */}
                  {selectedMeal.items && selectedMeal.items.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Food Items</h3>
                      {selectedMeal.items.map((item) => (
                        <Card key={item.id} className="p-3 shadow-soft">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{item.calories} kcal</span>
                                <span>P: {item.protein}g</span>
                                <span>C: {item.carbs}g</span>
                                <span>F: {item.fat}g</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteFood(selectedMeal.id, item.id, item.name)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Update Meal Button */}
              {selectedMeal && (
                <Link to={`/nutrition/add/${selectedMeal.type}`}>
                  <Button className="w-full" size="lg">
                    <Plus size={20} className="mr-2" />
                    Update {selectedMeal.name}
                  </Button>
                </Link>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Food Item?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteConfirm?.foodName}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <BottomNav />
    </div>
  );
}
