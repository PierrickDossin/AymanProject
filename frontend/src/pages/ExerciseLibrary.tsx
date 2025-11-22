import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";

const MUSCLE_GROUPS = ["all", "chest", "back", "legs", "shoulders", "arms", "core", "cardio"];
const EQUIPMENT_TYPES = ["all", "barbell", "dumbbell", "machine", "bodyweight", "cable", "other"];

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ["exercises", selectedMuscle, selectedEquipment, searchQuery],
    queryFn: () => api.getExercises({
      muscleGroup: selectedMuscle !== "all" ? selectedMuscle : undefined,
      equipment: selectedEquipment !== "all" ? selectedEquipment : undefined,
      search: searchQuery || undefined,
    }),
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMuscle("all");
    setSelectedEquipment("all");
  };

  const hasFilters = searchQuery || selectedMuscle !== "all" || selectedEquipment !== "all";

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Exercise Library</h1>
          <p className="text-sm text-muted-foreground mt-1">{exercises.length}+ exercises</p>
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
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Muscle Group</p>
            <div className="flex gap-2 flex-wrap">
              {MUSCLE_GROUPS.map((muscle) => (
                <Button
                  key={muscle}
                  variant={selectedMuscle === muscle ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMuscle(muscle)}
                  className="capitalize"
                >
                  {muscle}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Equipment</p>
            <div className="flex gap-2 flex-wrap">
              {EQUIPMENT_TYPES.map((equipment) => (
                <Button
                  key={equipment}
                  variant={selectedEquipment === equipment ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEquipment(equipment)}
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
              Clear Filters
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
