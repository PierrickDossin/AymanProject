import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { waterApi } from "@/lib/waterApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Droplets, Save } from "lucide-react";

const WaterGoalSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goalLiters, setGoalLiters] = useState<string>("1.5");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadGoal = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const goal = await waterApi.getWaterGoal(user.id);
        setGoalLiters((goal / 1000).toFixed(1));
      } catch (error) {
        console.error("Failed to load water goal:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGoal();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    const liters = parseFloat(goalLiters);
    if (isNaN(liters) || liters <= 0 || liters > 10) {
      alert("Please enter a valid water goal between 0.1 and 10 liters");
      return;
    }

    setSaving(true);
    try {
      await waterApi.updateWaterGoal(user.id, Math.round(liters * 1000));
      navigate(-1);
    } catch (error) {
      console.error("Failed to save water goal:", error);
      alert("Failed to save water goal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const presetGoals = [
    { label: "1L", value: "1.0" },
    { label: "1.5L", value: "1.5" },
    { label: "2L", value: "2.0" },
    { label: "2.5L", value: "2.5" },
    { label: "3L", value: "3.0" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-secondary"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Droplets className="text-blue-500" size={28} />
                Water Goal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Set your daily hydration target
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Current Goal Display */}
            <Card className="bg-gradient-card border-border/30 p-8">
              <div className="text-center space-y-4">
                <Droplets className="mx-auto text-blue-500" size={64} />
                <div>
                  <div className="text-5xl font-black text-blue-600">
                    {goalLiters}L
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Daily Goal ({Math.round(parseFloat(goalLiters) * 1000)}ml)
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Quick Presets</Label>
              <div className="grid grid-cols-5 gap-2">
                {presetGoals.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={goalLiters === preset.value ? "default" : "outline"}
                    className="h-16"
                    onClick={() => setGoalLiters(preset.value)}
                  >
                    <div className="text-center">
                      <div className="font-bold">{preset.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-3">
              <Label htmlFor="custom-goal" className="text-sm font-semibold">
                Custom Goal (Liters)
              </Label>
              <div className="relative">
                <Input
                  id="custom-goal"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={goalLiters}
                  onChange={(e) => setGoalLiters(e.target.value)}
                  className="h-14 text-lg pr-12"
                  placeholder="1.5"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  L
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: 1.5-3 liters per day depending on activity level
              </p>
            </div>

            {/* Info Card */}
            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                  💧 Hydration Tips
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Drink more water during exercise or hot weather</li>
                  <li>• Aim for consistent intake throughout the day</li>
                  <li>• Urine should be light yellow or clear</li>
                  <li>• Adjust goal based on your activity level</li>
                </ul>
              </div>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 bg-gradient-primary shadow-glow text-lg font-bold"
            >
              <Save size={20} className="mr-2" />
              {saving ? "Saving..." : "Save Goal"}
            </Button>
          </>
        )}
      </main>
    </div>
  );
};

export default WaterGoalSettings;
