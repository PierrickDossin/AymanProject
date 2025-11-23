import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Timer, CheckCircle2, Plus, Trash2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExerciseSet {
  weight: string;
  reps: string;
  completed: boolean;
}

interface ExerciseLogEntry {
  id: string;
  weight: number;
  reps: number;
  sets: number;
  performedAt: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  history?: ExerciseLogEntry[];
}

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([
    { 
      id: "1", 
      name: "Bench Press", 
      sets: [
        { weight: "80", reps: "10", completed: false },
        { weight: "80", reps: "10", completed: false },
        { weight: "80", reps: "8", completed: false },
        { weight: "80", reps: "8", completed: false },
      ]
    },
    { 
      id: "2", 
      name: "Shoulder Press", 
      sets: [
        { weight: "30", reps: "12", completed: false },
        { weight: "30", reps: "10", completed: false },
        { weight: "30", reps: "10", completed: false },
      ]
    },
    { 
      id: "3", 
      name: "Incline Dumbbell Press", 
      sets: [
        { weight: "25", reps: "12", completed: false },
        { weight: "25", reps: "10", completed: false },
        { weight: "25", reps: "10", completed: false },
      ]
    },
    { 
      id: "4", 
      name: "Lateral Raises", 
      sets: [
        { weight: "10", reps: "15", completed: false },
        { weight: "10", reps: "15", completed: false },
        { weight: "10", reps: "15", completed: false },
      ]
    },
    { 
      id: "5", 
      name: "Tricep Pushdowns", 
      sets: [
        { weight: "20", reps: "15", completed: false },
        { weight: "20", reps: "12", completed: false },
        { weight: "20", reps: "12", completed: false },
      ]
    },
  ]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseLogEntry[]>([]);

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

  const updateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], completed: !newSets[setIndex].completed };
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const addSet = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { weight: lastSet.weight, reps: lastSet.reps, completed: false }]
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId && ex.sets.length > 1) {
        return {
          ...ex,
          sets: ex.sets.filter((_, idx) => idx !== setIndex)
        };
      }
      return ex;
    }));
  };

  const viewHistory = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    
    // Fetch exercise history from backend
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/exercise-logs/history/${encodeURIComponent(exercise.name)}`,
        {
          headers: {
            'user-id': session.user.id,
          }
        }
      );

      if (response.ok) {
        const history = await response.json();
        setExerciseHistory(history);
      }
    } catch (error) {
      console.error('Error fetching exercise history:', error);
    }
  };

  const finishWorkout = async () => {
    setIsActive(false);
    
    // Log all completed sets to backend
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/training");
        return;
      }

      const workoutType = "Push Day"; // This would be dynamic based on the actual workout

      for (const exercise of exercises) {
        const completedSets = exercise.sets.filter(set => set.completed);
        
        if (completedSets.length > 0) {
          // Group by weight and reps to create consolidated logs
          const uniqueCombinations = new Map<string, { weight: string; reps: string; count: number }>();
          
          completedSets.forEach(set => {
            const key = `${set.weight}-${set.reps}`;
            const existing = uniqueCombinations.get(key);
            if (existing) {
              existing.count++;
            } else {
              uniqueCombinations.set(key, { weight: set.weight, reps: set.reps, count: 1 });
            }
          });

          // Save each unique combination as a log entry
          for (const [_, combo] of uniqueCombinations) {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exercise-logs`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'user-id': session.user.id,
              },
              body: JSON.stringify({
                exerciseName: exercise.name,
                weight: combo.weight,
                reps: combo.reps,
                sets: combo.count,
                workoutType,
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error logging workout:', error);
    }
    
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
          <h1 className="text-3xl font-black tracking-tight">Push Day</h1>
          <p className="text-muted-foreground">Focus on form and control. Log each set.</p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => {
            const completedSets = exercise.sets.filter(s => s.completed).length;
            return (
              <Card key={exercise.id} className="p-4 bg-secondary/30 border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{exercise.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {completedSets}/{exercise.sets.length} sets completed
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewHistory(exercise)}
                      className="text-primary"
                    >
                      <TrendingUp size={16} className="mr-1" />
                      History
                    </Button>
                  </div>

                  {exercise.sets.map((set, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        set.completed ? 'bg-primary/10 border border-primary/30' : 'bg-background'
                      }`}
                    >
                      <span className="text-sm font-semibold w-8">#{idx + 1}</span>
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exercise.id, idx, 'weight', e.target.value)}
                        className="w-20 h-8 text-sm"
                        placeholder="kg"
                        disabled={set.completed}
                      />
                      <span className="text-xs text-muted-foreground">kg ×</span>
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, idx, 'reps', e.target.value)}
                        className="w-16 h-8 text-sm"
                        placeholder="reps"
                        disabled={set.completed}
                      />
                      <span className="text-xs text-muted-foreground">reps</span>
                      <Button
                        size="sm"
                        variant={set.completed ? "default" : "outline"}
                        onClick={() => toggleSetComplete(exercise.id, idx)}
                        className="ml-auto"
                      >
                        {set.completed ? "✓" : "Done"}
                      </Button>
                      {exercise.sets.length > 1 && !set.completed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSet(exercise.id, idx)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addSet(exercise.id)}
                    className="w-full"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Set
                  </Button>
                </div>
              </Card>
            );
          })}
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

      {/* Exercise History Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              {selectedExercise?.name} History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto">
            {exerciseHistory.length > 0 ? (
              exerciseHistory.map((log) => (
                <div key={log.id} className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {log.sets} × {log.reps} reps @ {log.weight}kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.performedAt).toLocaleDateString()} at{' '}
                        {new Date(log.performedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No history yet. Complete your first set to start tracking!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveWorkout;
