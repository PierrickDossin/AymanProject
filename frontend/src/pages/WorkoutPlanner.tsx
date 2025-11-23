import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

interface WorkoutTemplate {
  name: string;
  type: string;
  exercises: Exercise[];
}

// Workout templates
const workoutTemplates: Record<string, WorkoutTemplate> = {
  "Push Day": {
    name: "Push Day",
    type: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "80kg" },
      { name: "Shoulder Press", sets: 3, reps: "10-12", weight: "30kg" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "25kg" },
      { name: "Lateral Raises", sets: 3, reps: "15", weight: "10kg" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: "20kg" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", weight: "15kg" },
    ],
  },
  "Pull Day": {
    name: "Pull Day",
    type: "Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: 4, reps: "6-8", weight: "100kg" },
      { name: "Pull-ups", sets: 4, reps: "8-12", weight: "Bodyweight" },
      { name: "Barbell Row", sets: 4, reps: "8-10", weight: "70kg" },
      { name: "Lat Pulldown", sets: 3, reps: "10-12", weight: "60kg" },
      { name: "Barbell Curl", sets: 3, reps: "10-12", weight: "30kg" },
      { name: "Hammer Curl", sets: 3, reps: "12", weight: "15kg" },
    ],
  },
  "Leg Day": {
    name: "Leg Day",
    type: "Legs & Core",
    exercises: [
      { name: "Barbell Back Squat", sets: 4, reps: "8-10", weight: "100kg" },
      { name: "Romanian Deadlift", sets: 4, reps: "10-12", weight: "80kg" },
      { name: "Leg Press", sets: 3, reps: "12-15", weight: "150kg" },
      { name: "Leg Extension", sets: 3, reps: "12-15", weight: "50kg" },
      { name: "Leg Curl", sets: 3, reps: "12-15", weight: "40kg" },
      { name: "Calf Raises", sets: 4, reps: "15-20", weight: "60kg" },
    ],
  },
};

const WorkoutPlanner = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledWorkouts, setScheduledWorkouts] = useState<Record<string, WorkoutTemplate>>({});

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const workoutForDay = scheduledWorkouts[formattedDate];

  // Determine next workout in rotation
  const getNextWorkout = () => {
    const workoutOrder = ["Push Day", "Pull Day", "Leg Day"];
    const scheduledDates = Object.keys(scheduledWorkouts).sort();
    
    if (scheduledDates.length === 0) return "Push Day";
    
    const lastDate = scheduledDates[scheduledDates.length - 1];
    const lastWorkout = scheduledWorkouts[lastDate];
    const lastWorkoutName = lastWorkout?.name;
    
    const currentIndex = workoutOrder.indexOf(lastWorkoutName);
    const nextIndex = (currentIndex + 1) % workoutOrder.length;
    
    return workoutOrder[nextIndex];
  };

  const addWorkout = () => {
    if (!date) return;
    
    const nextWorkoutName = getNextWorkout();
    const workout = workoutTemplates[nextWorkoutName];
    
    setScheduledWorkouts({
      ...scheduledWorkouts,
      [formattedDate]: workout,
    });
  };

  const removeWorkout = () => {
    if (!date) return;
    
    const newSchedule = { ...scheduledWorkouts };
    delete newSchedule[formattedDate];
    setScheduledWorkouts(newSchedule);
  };

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
              modifiers={{
                hasWorkout: Object.keys(scheduledWorkouts).map(d => new Date(d)),
              }}
              modifiersStyles={{
                hasWorkout: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: '50%',
                }
              }}
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
            {workoutForDay ? (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={removeWorkout}
              >
                <X size={16} className="mr-1" /> Remove
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={addWorkout}
              >
                <Check size={16} className="mr-1" /> Add Workout
              </Button>
            )}
          </div>

          {workoutForDay ? (
            <Card className="bg-gradient-primary text-primary-foreground shadow-medium">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{workoutForDay.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{workoutForDay.type}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm opacity-90">Exercises:</h4>
                  {workoutForDay.exercises.map((exercise: Exercise, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between text-sm bg-primary-foreground/10 rounded-lg p-2"
                    >
                      <span className="font-medium">{exercise.name}</span>
                      <span className="opacity-90 text-xs">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-secondary/10 border-dashed border-border/50">
              <CardContent className="p-8 text-center space-y-2">
                <p className="text-muted-foreground">No workout scheduled for this day.</p>
                <p className="text-sm text-primary font-semibold">
                  Next workout: {getNextWorkout()}
                </p>
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
