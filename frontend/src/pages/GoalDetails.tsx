import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GoalDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: goal } = useQuery({
    queryKey: ["goal", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      return api.getGoal(id);
    },
    enabled: !!id,
  });

  const { data: progressData } = useQuery({
    queryKey: ["goal-progress", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      const result = await api.getGoalProgress(id);
      // Backend returns a single progress object, but we want history
      // For now, we'll just mock history or use what we have
      return [];
    },
    enabled: !!id,
  });

  if (!goal) return null;

  const chartData = []; // TODO: Implement progress history in backend

  // Add initial value as first data point
  if (goal.currentValue && chartData.length > 0) {
    // ...
  }

  const progress = goal.goalValue
    ? Math.round(
      ((goal.currentValue - 0) / // TODO: Need initial value in backend model
        (goal.goalValue - 0)) *
      100
    )
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/goals">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground capitalize">
                {goal.type.replace('_', ' ')} Goal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Progress tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Goal Summary */}
        <Card className="p-6 shadow-medium">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-3xl font-bold text-foreground">
                  {goal.currentValue} <span className="text-lg">{goal.metric}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="text-3xl font-bold text-primary">
                  {goal.goalValue} <span className="text-lg">{goal.metric}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon size={16} />
              <span>Target date: {goal.targetDate ? format(new Date(goal.targetDate), "PPP") : "No deadline"}</span>
            </div>
          </div>
        </Card>

        {/* Progress Chart */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Progress Over Time
          </h3>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">No progress data yet. Start tracking your progress!</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default GoalDetails;
