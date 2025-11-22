import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Percent, Dumbbell, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ChooseGoal = () => {
  const goalTypes = [
    {
      title: "Weight",
      icon: <Scale size={32} />,
      description: "Track your weight goals",
      path: "/goals/weight",
    },
    {
      title: "Body Fat",
      icon: <Percent size={32} />,
      description: "Monitor body composition",
      path: "/goals/body-fat",
    },
    {
      title: "Muscle Mass",
      icon: <Dumbbell size={32} />,
      description: "Build muscle mass",
      path: "/goals/muscle-mass",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/goals">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Choose Your Goal</h1>
              <p className="text-sm text-muted-foreground mt-1">Select a goal type</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {goalTypes.map((goal, index) => (
            <Link key={goal.title} to={goal.path}>
              <Card
                className="p-6 hover:shadow-medium transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChooseGoal;
