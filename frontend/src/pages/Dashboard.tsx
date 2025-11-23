import BottomNav from "@/components/BottomNav";
import CircularProgress from "@/components/CircularProgress";
import StatCard from "@/components/StatCard";
import ProfilePictureDialog from "@/components/ProfilePictureDialog";
import { Target, TrendingUp, Flame, Dumbbell, UtensilsCrossed, Scale, LogOut, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { waterApi } from "@/lib/waterApi";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch today's meal totals
  const { data: mealTotals } = useQuery({
    queryKey: ['mealTotals', user?.id, today],
    queryFn: () => api.getMealTotals(user!.id, today),
    enabled: !!user?.id,
  });
  
  // Fetch water stats
  const { data: waterStats, refetch: refetchWater } = useQuery({
    queryKey: ['waterStats', user?.id, today],
    queryFn: () => waterApi.getTodayStats(user!.id),
    enabled: !!user?.id,
  });
  
  // Fetch active goals
  const { data: goals } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => api.getGoals(user!.id),
    enabled: !!user?.id,
  });
  
  const waterConsumed = waterStats?.totalToday || 0;
  const waterGoal = waterStats?.goal || 1500;
  
  // Get weight goal if exists
  const weightGoal = goals?.find(g => g.type === 'weight' && g.status === 'active');
  const bodyFatGoal = goals?.find(g => g.type === 'body_fat' && g.status === 'active');
  
  const caloriesConsumed = mealTotals?.totalCalories || 0;
  const protein = mealTotals?.totalProtein || 0;
  const carbs = mealTotals?.totalCarbs || 0;
  const fat = mealTotals?.totalFat || 0;
  
  // Load saved goals from localStorage
  const [savedGoals, setSavedGoals] = useState(() => {
    const saved = localStorage.getItem('calorieGoals');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        calories: parsed.calories || 2000,
        protein: parsed.protein || 150,
        carbs: parsed.carbs || 200,
        fat: parsed.fat || 60,
      };
    }
    return {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 60,
    };
  });
  
  const caloriesTarget = savedGoals.calories;
  const proteinTarget = savedGoals.protein;
  const carbsTarget = savedGoals.carbs;
  const fatTarget = savedGoals.fat;
  const caloriesBurned = 0; // Will be calculated from workouts later
  const caloriesRemaining = caloriesTarget - caloriesConsumed + caloriesBurned;
  
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;
      
      // Try to get avatar from profiles table first
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      } else if (user?.user_metadata?.avatar_url) {
        // Fallback to user metadata
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };
    
    fetchAvatar();
  }, [user]);
  
  const handleLogout = async () => {
    await signOut();
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
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Track your fitness journey</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProfileDialogOpen(true)}
                className="relative w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-base font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-200 overflow-hidden group"
              >
                {avatarUrl ? (
                  <>
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white font-semibold">Edit</span>
                    </div>
                  </>
                ) : (
                  <span className="text-primary-foreground">{getInitials()}</span>
                )}
              </button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Quick Actions - Move to top for easy access */}
        <section className="animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-card/50 border-border hover:border-primary/50 hover:scale-105 transition-all duration-200 group" 
              asChild
            >
              <Link to="/nutrition">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="text-primary-foreground" size={20} />
                </div>
                <span className="text-sm font-medium">Log Meal</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-card/50 border-border hover:border-accent/50 hover:scale-105 transition-all duration-200 group" 
              asChild
            >
              <Link to="/training/active">
                <div className="w-10 h-10 rounded-xl bg-gradient-energy flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="text-accent-foreground" size={20} />
                </div>
                <span className="text-sm font-medium">Start Workout</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Grid - Show goals prominently */}
        {(weightGoal || bodyFatGoal) && (
          <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
            <h2 className="text-lg font-semibold text-foreground">Active Goals</h2>
            <div className="grid grid-cols-2 gap-4">
              {weightGoal && (
                <StatCard
                  title={weightGoal.name}
                  value={`${weightGoal.currentValue}${weightGoal.metric}`}
                  subtitle={`Goal: ${weightGoal.goalValue}${weightGoal.metric}`}
                  icon={<Scale size={22} />}
                  progress={{
                    current: weightGoal.currentValue,
                    target: weightGoal.goalValue,
                    start: weightGoal.startValue || weightGoal.currentValue,
                  }}
                  goalId={weightGoal.id}
                  metric={weightGoal.metric}
                  className={!bodyFatGoal ? "col-span-2" : ""}
                />
              )}
              {bodyFatGoal && (
                <StatCard
                  title={bodyFatGoal.name}
                  value={`${bodyFatGoal.currentValue}${bodyFatGoal.metric}`}
                  subtitle={`Goal: ${bodyFatGoal.goalValue}${bodyFatGoal.metric}`}
                  icon={<TrendingUp size={22} />}
                  progress={{
                    current: bodyFatGoal.currentValue,
                    target: bodyFatGoal.goalValue,
                    start: bodyFatGoal.startValue || bodyFatGoal.currentValue,
                  }}
                  goalId={bodyFatGoal.id}
                  metric={bodyFatGoal.metric}
                  className={!weightGoal ? "col-span-2" : ""}
                />
              )}
            </div>
          </section>
        )}

        {/* Daily Overview */}
        <section className="animate-slide-up" style={{ animationDelay: "0.075s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Today's Activity</h2>
            <span className="text-xs font-medium text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex justify-between items-center gap-1">
              <CircularProgress
                value={caloriesConsumed}
                max={caloriesTarget}
                size={90}
                strokeWidth={8}
                color="hsl(262, 83%, 58%)"
                label="Consumed"
                sublabel="kcal"
              />
              <CircularProgress
                value={caloriesBurned}
                max={600}
                size={90}
                strokeWidth={8}
                color="hsl(14, 100%, 57%)"
                label="Burned"
                sublabel="kcal"
              />
              <CircularProgress
                value={caloriesRemaining}
                max={caloriesTarget}
                size={90}
                strokeWidth={8}
                color="hsl(142, 76%, 36%)"
                label="Remaining"
                sublabel="kcal"
              />
            </div>
          </div>
        </section>

        {/* Water & Macros Side by Side */}
        <section className="grid grid-cols-1 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Water Intake - Compact */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Droplets size={20} className="text-primary" />
                Water Intake
              </h2>
              <Link to="/nutrition/water-goal">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </Button>
              </Link>
            </div>
            <div className="card-elevated rounded-2xl p-6">
              <div className="flex items-center justify-between gap-6">
                <CircularProgress
                  value={waterConsumed}
                  max={waterGoal}
                  size={100}
                  strokeWidth={10}
                  color="hsl(262, 83%, 58%)"
                  label={`${(waterConsumed / 1000).toFixed(1)}L`}
                  sublabel={`of ${(waterGoal / 1000).toFixed(1)}L`}
                />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 bg-card/50 border-border hover:border-primary/50 hover:scale-105 transition-all duration-200"
                    onClick={async () => {
                      if (user?.id) {
                        await waterApi.logWater(user.id, 250);
                        refetchWater();
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary">+250ml</div>
                      <div className="text-[10px] text-muted-foreground">Glass</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 bg-card/50 border-border hover:border-primary/50 hover:scale-105 transition-all duration-200"
                    onClick={async () => {
                      if (user?.id) {
                        await waterApi.logWater(user.id, 500);
                        refetchWater();
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary">+500ml</div>
                      <div className="text-[10px] text-muted-foreground">Bottle</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 bg-card/50 border-border hover:border-primary/50 hover:scale-105 transition-all duration-200 col-span-2"
                    onClick={async () => {
                      if (user?.id) {
                        await waterApi.logWater(user.id, 1000);
                        refetchWater();
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary">+1L</div>
                      <div className="text-[10px] text-muted-foreground">Large</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Macros Overview */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Macros</h2>
            <div className="card-elevated rounded-2xl p-6">
              <div className="flex justify-between items-center gap-1">
                <CircularProgress
                  value={protein}
                  max={proteinTarget}
                  size={90}
                  strokeWidth={8}
                  color="hsl(262, 83%, 58%)"
                  label="Protein"
                  sublabel="g"
                />
                <CircularProgress
                  value={carbs}
                  max={carbsTarget}
                  size={90}
                  strokeWidth={8}
                  color="hsl(47, 90%, 55%)"
                  label="Carbs"
                  sublabel="g"
                />
                <CircularProgress
                  value={fat}
                  max={fatTarget}
                  size={90}
                  strokeWidth={8}
                  color="hsl(14, 100%, 57%)"
                  label="Fat"
                  sublabel="g"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Additional Stats */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.125s" }}>
          <h2 className="text-lg font-semibold text-foreground">Progress Tracking</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Weekly Workouts"
              value="0/5"
              subtitle="This week"
              icon={<Dumbbell size={22} />}
            />
            <StatCard
              title="Streak"
              value="0"
              subtitle="days"
              icon={<Flame size={22} />}
              trend={{ value: "Start logging!", positive: true }}
            />
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-card/50 border-border hover:border-success/50 hover:scale-105 transition-all duration-200 group col-span-2" 
              asChild
            >
              <Link to="/goals">
                <div className="w-10 h-10 rounded-xl bg-gradient-success flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale className="text-success-foreground" size={20} />
                </div>
                <span className="text-sm font-medium">Update Weight</span>
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
