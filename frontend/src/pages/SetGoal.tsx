import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Scale, Percent, Dumbbell, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const goalTypeConfig = {
  "weight-gain": { icon: TrendingUp, label: "Weight Gain", unit: "kg" },
  "weight-loss": { icon: TrendingDown, label: "Weight Loss", unit: "kg" },
  "body-fat": { icon: Percent, label: "Body Fat", unit: "%" },
  "muscle-mass": { icon: Dumbbell, label: "Muscle Mass", unit: "kg" },
};

const SetGoal = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentValue, setCurrentValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetDate, setTargetDate] = useState<Date>();

  const { user } = useAuth();

  const config = goalTypeConfig[type as keyof typeof goalTypeConfig];
  const Icon = config?.icon || Scale;

  const createGoalMutation = useMutation({
    mutationFn: async (data: { currentValue: number; targetValue: number; targetDate: Date }) => {
      if (!config) throw new Error("Invalid goal type");
      if (!user) throw new Error("Not authenticated");

      const goalTypeMap: Record<string, "muscle_mass" | "weight" | "performance" | "body_fat"> = {
        "weight-gain": "weight",
        "weight-loss": "weight",
        "body-fat": "body_fat",
        "muscle-mass": "muscle_mass"
      };

      return api.createGoal({
        userId: user.id,
        name: `${config.label} Goal`,
        type: goalTypeMap[type as string] || "weight",
        currentValue: data.currentValue,
        goalValue: data.targetValue,
        metric: config.unit as any,
        targetDate: format(data.targetDate, "yyyy-MM-dd"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      navigate("/goals");
    },
    onError: (error) => {
      console.error("Full error details:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        details: error
      });
    },
  });

  // Redirect if invalid goal type
  if (!config) {
    navigate("/goals/choose");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentValue || !targetValue || !targetDate) {
      return;
    }

    createGoalMutation.mutate({
      currentValue: parseFloat(currentValue),
      targetValue: parseFloat(targetValue),
      targetDate,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/goals/choose">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Set {config?.label} Goal</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter your target and deadline</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-card rounded-2xl p-6 shadow-medium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="text-primary" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{config?.label}</h2>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current">Current Value ({config?.unit})</Label>
              <Input
                id="current"
                type="number"
                step="0.1"
                placeholder={`Enter current ${config?.label.toLowerCase()}`}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value ({config?.unit})</Label>
              <Input
                id="target"
                type="number"
                step="0.1"
                placeholder={`Enter target ${config?.label.toLowerCase()}`}
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              className="w-full shadow-glow"
              disabled={createGoalMutation.isPending}
            >
              {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SetGoal;
