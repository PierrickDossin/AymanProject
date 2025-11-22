import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DatabaseViewer() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState<"meals" | "goals" | "workouts">("meals");

  const { data: mealsData } = useQuery({
    queryKey: ["db-meals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: selectedTable === "meals",
  });

  const { data: goalsData } = useQuery({
    queryKey: ["db-goals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: selectedTable === "goals",
  });

  const { data: workoutsData } = useQuery({
    queryKey: ["db-workouts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: selectedTable === "workouts",
  });

  const currentData = 
    selectedTable === "meals" ? mealsData :
    selectedTable === "goals" ? goalsData :
    workoutsData || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Database Viewer</h1>
              <p className="text-sm text-muted-foreground">View your stored data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Table Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedTable === "meals" ? "default" : "outline"}
            onClick={() => setSelectedTable("meals")}
          >
            Meals
          </Button>
          <Button
            variant={selectedTable === "goals" ? "default" : "outline"}
            onClick={() => setSelectedTable("goals")}
          >
            Goals
          </Button>
          <Button
            variant={selectedTable === "workouts" ? "default" : "outline"}
            onClick={() => setSelectedTable("workouts")}
          >
            Workouts
          </Button>
        </div>

        {/* Data Display */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 capitalize">{selectedTable} Data</h2>
          
          {currentData && currentData.length > 0 ? (
            <div className="space-y-4">
              {currentData.map((item, index) => (
                <Card key={index} className="p-4 bg-secondary/50">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </Card>
              ))}
              <p className="text-sm text-muted-foreground">
                Total records: {currentData.length}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No data found</p>
          )}
        </Card>

        {/* Quick Access Info */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3">Access Supabase Dashboard</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              For full database access with advanced features:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Visit: <code className="text-primary">https://supabase.com/dashboard</code></li>
              <li>Select your project: <code className="text-primary">kjucpurewtfednckguiy</code></li>
              <li>Click "Table Editor" to view/edit all tables</li>
              <li>Use "SQL Editor" for custom queries</li>
            </ol>
          </div>
        </Card>
      </main>
    </div>
  );
}
