import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Timer, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const workout = {
    name: "Push Day",
    exercises: [
      { id: "1", name: "Bench Press", sets: "4 sets", reps: "8-10 reps", weight: "80kg" },
      { id: "2", name: "Shoulder Press", sets: "3 sets", reps: "10-12 reps", weight: "30kg" },
      { id: "3", name: "Incline Dumbbell Press", sets: "3 sets", reps: "10-12 reps", weight: "25kg" },
      { id: "4", name: "Lateral Raises", sets: "3 sets", reps: "15 reps", weight: "10kg" },
      { id: "5", name: "Tricep Pushdowns", sets: "3 sets", reps: "12-15 reps", weight: "20kg" },
    ]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const finishWorkout = () => {
    setIsActive(false);
    toast({
      title: "Workout Completed! 🎉",
      description: `You finished ${workout.name} in ${formatTime(seconds)}`,
    });
    navigate("/training");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/training")}>
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-primary">
            <Timer size={20} />
            {formatTime(seconds)}
          </div>
          <Button size="sm" variant="destructive" onClick={() => navigate("/training")}>
            Quit
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">{workout.name}</h1>
          <p className="text-muted-foreground">Focus on form and control.</p>
        </div>

        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`p-4 transition-all duration-300 ${
                completedExercises.includes(exercise.id) 
                  ? "bg-primary/10 border-primary/50" 
                  : "bg-secondary/30 border-border/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox 
                  id={exercise.id}
                  checked={completedExercises.includes(exercise.id)}
                  onCheckedChange={() => toggleExercise(exercise.id)}
                  className="mt-1 w-6 h-6"
                />
                <div className="flex-1 space-y-1">
                  <label 
                    htmlFor={exercise.id}
                    className={`font-bold text-lg cursor-pointer ${
                      completedExercises.includes(exercise.id) ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {exercise.name}
                  </label>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{exercise.sets}</span>
                    <span>{exercise.reps}</span>
                    <span>{exercise.weight}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          className="w-full h-14 text-lg font-bold shadow-glow"
          size="lg"
          onClick={finishWorkout}
        >
          <CheckCircle2 className="mr-2" />
          Finish Workout
        </Button>
      </div>
    </div>
  );
};

export default ActiveWorkout;
