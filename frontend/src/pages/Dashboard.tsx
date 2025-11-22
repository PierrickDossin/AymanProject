import BottomNav from "@/components/BottomNav";
import CircularProgress from "@/components/CircularProgress";
import StatCard from "@/components/StatCard";
import ProfilePictureDialog from "@/components/ProfilePictureDialog";
import { Target, TrendingUp, Flame, Dumbbell, UtensilsCrossed, Scale, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch today's meal totals
  const { data: mealTotals } = useQuery({
    queryKey: ['mealTotals', user?.id, today],
    queryFn: () => api.getMealTotals(user!.id, today),
    enabled: !!user?.id,
  });
  
  const caloriesConsumed = mealTotals?.totalCalories || 0;
  const protein = mealTotals?.totalProtein || 0;
  const carbs = mealTotals?.totalCarbs || 0;
  const fat = mealTotals?.totalFat || 0;
  
  const caloriesTarget = 2400;
  const proteinTarget = 180; // grams
  const carbsTarget = 250; // grams
  const fatTarget = 65; // grams
  const caloriesBurned = 420;
  const caloriesRemaining = caloriesTarget - caloriesConsumed + caloriesBurned;
  
  useEffect(() => {
    // Get avatar URL from user metadata
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);
  
  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "See you next time! 👋",
    });
    navigate("/login");
  };
  
  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url || null);
  };
  
  // Get user initials for avatar
  const getInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1.5 font-medium">Let's crush your goals today 💪</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProfileDialogOpen(true)}
                className="relative w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold shadow-glow hover:scale-105 transition-transform overflow-hidden group"
              >
                {avatarUrl ? (
                  <>
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white font-bold">Edit</span>
                    </div>
                  </>
                ) : (
                  <span className="group-hover:scale-110 transition-transform">{getInitials()}</span>
                )}
              </button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-8">
        {/* Daily Overview */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">Today's Activity</h2>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="bg-gradient-card rounded-3xl p-6 shadow-medium border border-border/30">
            <div className="flex justify-around items-center gap-4">
              <CircularProgress
                value={caloriesConsumed}
                max={caloriesTarget}
                size={110}
                strokeWidth={10}
                color="hsl(199, 89%, 48%)"
                label="Consumed"
                sublabel="kcal"
              />
              <CircularProgress
                value={caloriesBurned}
                max={600}
                size={110}
                strokeWidth={10}
                color="hsl(14, 90%, 60%)"
                label="Burned"
                sublabel="kcal"
              />
              <CircularProgress
                value={caloriesRemaining}
                max={caloriesTarget}
                size={110}
                strokeWidth={10}
                color="hsl(142, 76%, 36%)"
                label="Remaining"
                sublabel="kcal"
              />
            </div>
          </div>
        </section>

        {/* Macros Overview */}
        <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">Macros</h2>
          </div>
          <div className="bg-gradient-card rounded-3xl p-6 shadow-medium border border-border/30">
            <div className="flex justify-around items-center gap-4">
              <CircularProgress
                value={protein}
                max={proteinTarget}
                size={110}
                strokeWidth={10}
                color="hsl(199, 89%, 48%)"
                label="Protein"
                sublabel="g"
              />
              <CircularProgress
                value={carbs}
                max={carbsTarget}
                size={110}
                strokeWidth={10}
                color="hsl(47, 90%, 55%)"
                label="Carbs"
                sublabel="g"
              />
              <CircularProgress
                value={fat}
                max={fatTarget}
                size={110}
                strokeWidth={10}
                color="hsl(14, 90%, 60%)"
                label="Fat"
                sublabel="g"
              />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold text-foreground">Your Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Current Weight"
              value="75.2"
              subtitle="kg"
              icon={<Scale size={22} />}
              trend={{ value: "0.5kg this week", positive: true }}
            />
            <StatCard
              title="Goal Progress"
              value="68%"
              subtitle="12 weeks left"
              icon={<Target size={22} />}
            />
            <StatCard
              title="Weekly Workouts"
              value="4/5"
              subtitle="This week"
              icon={<Dumbbell size={22} />}
            />
            <StatCard
              title="Streak"
              value="12"
              subtitle="days"
              icon={<Flame size={22} />}
              trend={{ value: "Keep it up!", positive: true }}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-card border-border/50 hover:border-primary/50 transition-all group" 
              asChild
            >
              <Link to="/nutrition">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="text-primary" size={24} />
                </div>
                <span className="text-sm font-semibold">Log Meal</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-card border-border/50 hover:border-accent/50 transition-all group" 
              asChild
            >
              <Link to="/training/active">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="text-accent" size={24} />
                </div>
                <span className="text-sm font-semibold">Start Workout</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-card border-border/50 hover:border-success/50 transition-all group col-span-2" 
              asChild
            >
              <Link to="/goals">
                <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale className="text-success" size={24} />
                </div>
                <span className="text-sm font-semibold">Update Weight</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <ProfilePictureDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentAvatarUrl={avatarUrl}
        onUploadComplete={handleAvatarUpdate}
      />

      <BottomNav />
    </div>
  );
};

export default Dashboard;
