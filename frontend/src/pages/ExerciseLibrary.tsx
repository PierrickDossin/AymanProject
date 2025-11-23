import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, X, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";

const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"];
const EQUIPMENT_TYPES = ["barbell", "dumbbell", "machine", "bodyweight", "cable", "other"];

export default function ExerciseLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const { data: allExercises = [], isLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api.getExercises({}),
  });

  // Client-side filtering for multiple selections
  const exercises = allExercises.filter((exercise) => {
    // Search filter
    if (searchQuery && !exercise.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Muscle group filter (OR logic - matches any selected muscle)
    if (selectedMuscles.length > 0 && !selectedMuscles.includes(exercise.muscleGroup.toLowerCase())) {
      return false;
    }

    // Equipment filter (OR logic - matches any selected equipment)
    if (selectedEquipment.length > 0 && !selectedEquipment.includes(exercise.equipment.toLowerCase())) {
      return false;
    }

    return true;
  });

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev =>
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMuscles([]);
    setSelectedEquipment([]);
  };

  const hasFilters = searchQuery || selectedMuscles.length > 0 || selectedEquipment.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">Exercise Library</h1>
            <p className="text-sm text-muted-foreground mt-1">{exercises.length}+ exercises</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Muscle Group</p>
              {selectedMuscles.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedMuscles.length} selected
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {MUSCLE_GROUPS.map((muscle) => (
                <Button
                  key={muscle}
                  variant={selectedMuscles.includes(muscle) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMuscle(muscle)}
                  className="capitalize"
                >
                  {muscle}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Equipment</p>
              {selectedEquipment.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedEquipment.length} selected
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {EQUIPMENT_TYPES.map((equipment) => (
                <Button
                  key={equipment}
                  variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEquipment(equipment)}
                  className="capitalize"
                >
                  {equipment}
                </Button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
              <X size={16} className="mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Exercise List */}
        <div className="space-y-2 pt-2">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading exercises...</p>
          ) : exercises.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No exercises found</p>
          ) : (
            exercises.map((exercise) => (
              <Card key={exercise.id} className="p-4 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Dumbbell className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {exercise.muscleGroup}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-xs">
                        {exercise.equipment}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {exercise.difficulty}
                      </Badge>
                      {exercise.rating > 0 && (
                        <Badge variant="outline" className="text-xs">
                          ⭐ {exercise.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    {exercise.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
