import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Target, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MacroSplit = "balanced" | "high-protein" | "low-carb" | "custom";

const MACRO_SPLITS = {
  balanced: { protein: 0.30, carbs: 0.40, fat: 0.30 },      // 30/40/30
  "high-protein": { protein: 0.40, carbs: 0.30, fat: 0.30 }, // 40/30/30
  "low-carb": { protein: 0.35, carbs: 0.20, fat: 0.45 },     // 35/20/45
};

export default function CalorieGoals() {
  const navigate = useNavigate();
  const [calories, setCalories] = useState("");
  const [macroSplit, setMacroSplit] = useState<MacroSplit>("balanced");
  const [customProtein, setCustomProtein] = useState(30);
  const [customCarbs, setCustomCarbs] = useState(40);
  const [customFat, setCustomFat] = useState(30);

  // Load saved goals
  useEffect(() => {
    const savedGoals = localStorage.getItem("calorieGoals");
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setCalories(parsed.calories?.toString() || "");
      setMacroSplit(parsed.macroSplit || "balanced");
      if (parsed.customProtein) setCustomProtein(parsed.customProtein);
      if (parsed.customCarbs) setCustomCarbs(parsed.customCarbs);
      if (parsed.customFat) setCustomFat(parsed.customFat);
    }
  }, []);

  const calculateMacros = () => {
    const cals = parseInt(calories) || 0;
    if (cals === 0) return { protein: 0, carbs: 0, fat: 0 };

    let splits;
    if (macroSplit === "custom") {
      const total = customProtein + customCarbs + customFat;
      splits = {
        protein: customProtein / total,
        carbs: customCarbs / total,
        fat: customFat / total,
      };
    } else {
      splits = MACRO_SPLITS[macroSplit];
    }

    return {
      protein: Math.round((cals * splits.protein) / 4), // 4 cal per gram
      carbs: Math.round((cals * splits.carbs) / 4),     // 4 cal per gram
      fat: Math.round((cals * splits.fat) / 9),         // 9 cal per gram
    };
  };

  const macros = calculateMacros();

  const handleSave = () => {
    const goals = {
      calories: parseInt(calories) || 0,
      macroSplit,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      customProtein,
      customCarbs,
      customFat,
    };
    localStorage.setItem("calorieGoals", JSON.stringify(goals));
    navigate("/nutrition");
  };

  const adjustCustomMacro = (type: "protein" | "carbs" | "fat", value: number) => {
    const newValue = Math.max(0, Math.min(100, value));
    
    if (type === "protein") {
      setCustomProtein(newValue);
    } else if (type === "carbs") {
      setCustomCarbs(newValue);
    } else {
      setCustomFat(newValue);
    }
  };

  const customTotal = customProtein + customCarbs + customFat;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/nutrition")}
            className="shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">Calorie Goals</h1>
            <p className="text-sm text-muted-foreground mt-1">Set your daily targets</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Calorie Input */}
        <Card className="p-6 shadow-medium">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Daily Calorie Goal</h2>
                <p className="text-sm text-muted-foreground">How many calories do you want to consume?</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories" className="text-sm font-semibold">
                Calories per day
              </Label>
              <div className="relative">
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2400"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="h-12 text-lg pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  kcal
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Macro Split Selection */}
        <Card className="p-6 shadow-medium">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Activity className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Macro Distribution</h2>
                <p className="text-sm text-muted-foreground">Choose your split</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="macroSplit" className="text-sm font-semibold">
                Macro Split
              </Label>
              <Select value={macroSplit} onValueChange={(value) => setMacroSplit(value as MacroSplit)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select macro split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced (30/40/30)</SelectItem>
                  <SelectItem value="high-protein">High Protein (40/30/30)</SelectItem>
                  <SelectItem value="low-carb">Low Carb (35/20/45)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Macro Inputs */}
            {macroSplit === "custom" && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Adjust percentages (Total: {customTotal}%)
                </p>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Protein %</Label>
                  <Input
                    type="number"
                    value={customProtein}
                    onChange={(e) => adjustCustomMacro("protein", parseInt(e.target.value) || 0)}
                    className="h-10"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Carbs %</Label>
                  <Input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => adjustCustomMacro("carbs", parseInt(e.target.value) || 0)}
                    className="h-10"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Fat %</Label>
                  <Input
                    type="number"
                    value={customFat}
                    onChange={(e) => adjustCustomMacro("fat", parseInt(e.target.value) || 0)}
                    className="h-10"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Calculated Macros Preview */}
        {calories && parseInt(calories) > 0 && (
          <Card className="p-6 shadow-medium bg-gradient-primary text-primary-foreground">
            <h3 className="text-lg font-semibold mb-4">Your Daily Targets</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Protein</p>
                <p className="text-2xl font-bold">{macros.protein}g</p>
                <p className="text-xs opacity-75 mt-1">{Math.round((macros.protein * 4 / parseInt(calories)) * 100)}%</p>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Carbs</p>
                <p className="text-2xl font-bold">{macros.carbs}g</p>
                <p className="text-xs opacity-75 mt-1">{Math.round((macros.carbs * 4 / parseInt(calories)) * 100)}%</p>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Fat</p>
                <p className="text-2xl font-bold">{macros.fat}g</p>
                <p className="text-xs opacity-75 mt-1">{Math.round((macros.fat * 9 / parseInt(calories)) * 100)}%</p>
              </div>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-14 text-lg font-bold shadow-glow"
          size="lg"
          disabled={!calories || parseInt(calories) === 0}
        >
          Save Goals
        </Button>
      </main>
    </div>
  );
}
