import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";

// Mock data for scheduled workouts
const scheduledWorkouts = {
  "2024-05-20": [{ id: 1, name: "Upper Body Power", duration: "45 min" }],
  "2024-05-22": [{ id: 2, name: "Leg Day", duration: "60 min" }],
  "2024-05-24": [{ id: 3, name: "Full Body HIIT", duration: "30 min" }],
};

const WorkoutPlanner = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const workoutsForDay = scheduledWorkouts[formattedDate as keyof typeof scheduledWorkouts] || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/training")}
            className="rounded-full hover:bg-secondary"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Workout Planner</h1>
            <p className="text-muted-foreground">Schedule your training</p>
          </div>
        </div>

        {/* Calendar */}
        <Card className="bg-gradient-card border-border/30 shadow-medium">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        {/* Workouts for Selected Date */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" />
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </h2>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>

          {workoutsForDay.length > 0 ? (
            <div className="space-y-3">
              {workoutsForDay.map((workout) => (
                <Card key={workout.id} className="bg-secondary/30 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">{workout.duration}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-secondary/10 border-dashed border-border/50">
              <CardContent className="p-8 text-center space-y-2">
                <p className="text-muted-foreground">No workouts scheduled for this day.</p>
                <Button variant="link" className="text-primary">
                  Schedule a workout
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default WorkoutPlanner;
