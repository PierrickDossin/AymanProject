import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Play, Calendar, TrendingUp, Timer, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Training = () => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  
  const todayWorkout = {
    name: "Push Day",
    exercises: 6,
    duration: "45-60 min",
    exercises_list: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "80kg" },
      { name: "Shoulder Press", sets: 3, reps: "10-12", weight: "30kg" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "25kg" },
      { name: "Lateral Raises", sets: 3, reps: "15", weight: "10kg" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: "20kg" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", weight: "15kg" },
    ],
  };

  const upcomingWorkouts = [
    { 
      day: "Tomorrow", 
      name: "Pull Day", 
      type: "Back & Biceps",
      exercises_list: [
        { name: "Deadlift", sets: 4, reps: "6-8", weight: "100kg" },
        { name: "Pull-ups", sets: 4, reps: "8-12", weight: "Bodyweight" },
        { name: "Barbell Row", sets: 4, reps: "8-10", weight: "70kg" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", weight: "60kg" },
        { name: "Barbell Curl", sets: 3, reps: "10-12", weight: "30kg" },
        { name: "Hammer Curl", sets: 3, reps: "12", weight: "15kg" },
      ]
    },
    { 
      day: "Wednesday", 
      name: "Leg Day", 
      type: "Legs & Core",
      exercises_list: [
        { name: "Barbell Back Squat", sets: 4, reps: "8-10", weight: "100kg" },
        { name: "Romanian Deadlift", sets: 4, reps: "10-12", weight: "80kg" },
        { name: "Leg Press", sets: 3, reps: "12-15", weight: "150kg" },
        { name: "Leg Extension", sets: 3, reps: "12-15", weight: "50kg" },
        { name: "Leg Curl", sets: 3, reps: "12-15", weight: "40kg" },
        { name: "Calf Raises", sets: 4, reps: "15-20", weight: "60kg" },
      ]
    },
    { 
      day: "Thursday", 
      name: "Push Day", 
      type: "Chest & Triceps",
      exercises_list: todayWorkout.exercises_list
    },
  ];

  const stats = [
    { label: "Workouts This Week", value: "4/5" },
    { label: "Total Volume", value: "12,450 kg" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Training</h1>
            <p className="text-sm text-muted-foreground mt-1">Your workout plan</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate("/training/active")}
          >
            <Timer size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Today's Workout */}
        <section className="animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Workout</h2>
          <Card className="p-6 shadow-medium bg-gradient-primary text-primary-foreground">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{todayWorkout.name}</h3>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span>{todayWorkout.exercises} exercises</span>
                  <span>•</span>
                  <span>{todayWorkout.duration}</span>
                </div>
              </div>
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Dumbbell size={24} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {todayWorkout.exercises_list.map((exercise) => (
                <div key={exercise.name} className="flex items-center justify-between text-sm bg-primary-foreground/10 rounded-lg p-3">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="opacity-90">
                    {exercise.sets} × {exercise.reps}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-soft"
              onClick={() => navigate("/training/active")}
            >
              <Play size={20} className="mr-2" />
              Start Workout
            </Button>
          </Card>
        </section>

        {/* Stats */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 text-center shadow-soft">
                <p className="text-2xl font-semibold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Workouts */}
        <section className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate("/training/planner")}
            >
              <Calendar size={16} className="mr-2" />
              View Calendar
            </Button>
          </div>

          {upcomingWorkouts.map((workout, index) => (
            <Card 
              key={workout.day} 
              className="p-4 shadow-soft hover:shadow-medium transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Dumbbell className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{workout.day}</p>
                    <h3 className="font-semibold text-foreground">{workout.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {workout.type}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground" size={20} />
              </div>
            </Card>
          ))}
        </section>

        {/* Exercise Library */}
        <section className="animate-fade-in">
          <Card 
            className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors duration-300 cursor-pointer"
            onClick={() => navigate("/training/exercises")}
          >
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Dumbbell className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Exercise Library</h3>
              <p className="text-sm text-muted-foreground">
                Browse 200+ exercises with instructions
              </p>
            </div>
          </Card>
        </section>
      </main>

      {/* Workout Detail Modal */}
      <Dialog open={!!selectedWorkout} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedWorkout?.name}</h2>
                <p className="text-sm text-muted-foreground font-normal">{selectedWorkout?.type}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <h3 className="font-semibold text-foreground">Exercises</h3>
            {selectedWorkout?.exercises_list?.map((exercise: any, idx: number) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary">{exercise.weight}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Training;
