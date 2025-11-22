import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [progressValue, setProgressValue] = useState("");

  const { user } = useAuth();

  const { data: goals = [] } = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getGoals(user.id);
    },
    enabled: !!user?.id,
  });

  const logProgressMutation = useMutation({
    mutationFn: async ({ goalId, value }: { goalId: string; value: number }) => {
      await api.updateGoalProgress(goalId, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setIsDialogOpen(false);
      setProgressValue("");
      setSelectedGoal(null);
      toast({
        title: "Progress logged",
        description: "Your progress has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogProgress = () => {
    if (!selectedGoal || !progressValue) return;
    logProgressMutation.mutate({
      goalId: selectedGoal.id,
      value: parseFloat(progressValue),
    });
  };

  const getInputLabel = (goalType: string) => {
    switch (goalType.toLowerCase()) {
      case "weight":
        return "New Weight (kg)";
      case "body fat":
        return "New Body Fat (%)";
      case "muscle mass":
        return "New Muscle Mass (kg)";
      default:
        return "New Value";
    }
  };

  const calculateProgress = (goal: any) => {
    if (!goal.goalValue) return 0;
    // Assuming initial value is 0 or tracked elsewhere, for now using simple percentage of current/target
    // or we can fetch progress from backend which calculates it correctly
    const current = goal.currentValue;
    const target = goal.goalValue;

    // Simple calculation based on goal type
    if (goal.type === "weight" || goal.type === "body_fat") {
      // For weight loss, we need initial value to calculate percentage correctly
      // For now returning 0 if we can't calculate
      return 0;
    }

    return Math.round((current / target) * 100);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Goals</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your targets</p>
          </div>
          <Button size="icon" className="rounded-full shadow-glow">
            <Plus size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Active Goals */}
        <section className="space-y-4">
          {goals.map((goal, index) => (
            <Card
              key={goal.id}
              className="p-5 shadow-soft hover:shadow-medium transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground capitalize">{goal.type.replace('_', ' ')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.targetDate ? format(new Date(goal.targetDate), "PPP") : "No deadline"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {goal.currentValue} {goal.metric}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    → {goal.goalValue} {goal.metric}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-primary">{calculateProgress(goal)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, calculateProgress(goal)))}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-primary hover:text-primary hover:bg-primary/10"
                  asChild
                >
                  <Link to={`/goals/details/${goal.id}`}>
                    <TrendingUp size={16} className="mr-2" />
                    View Details
                  </Link>
                </Button>
                <Dialog open={isDialogOpen && selectedGoal?.id === goal.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setSelectedGoal(null);
                    setProgressValue("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setSelectedGoal(goal)}
                    >
                      <Plus size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Progress</DialogTitle>
                      <DialogDescription>
                        Update your progress for {goal.type.replace('_', ' ')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="progress-value">
                          {getInputLabel(goal.type.replace('_', ' '))}
                        </Label>
                        <Input
                          id="progress-value"
                          type="number"
                          step="0.1"
                          placeholder={`Enter ${goal.metric}`}
                          value={progressValue}
                          onChange={(e) => setProgressValue(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleLogProgress}
                        disabled={!progressValue || logProgressMutation.isPending}
                        className="w-full"
                      >
                        {logProgressMutation.isPending ? "Logging..." : "Log Progress"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </section>

        {/* Add New Goal */}
        <Link to="/goals/choose">
          <Card className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors duration-300 cursor-pointer animate-fade-in">
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Plus className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Set New Goal</h3>
              <p className="text-sm text-muted-foreground">
                Add a weight or body composition goal
              </p>
            </div>
          </Card>
        </Link>
      </main>

      <BottomNav />
    </div>
  );
};

export default Goals;
