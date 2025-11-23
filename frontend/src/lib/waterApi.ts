import { supabase } from "@/integrations/supabase/client";

export interface WaterLog {
  id: string;
  user_id: string;
  amount: number; // in milliliters
  logged_at: string;
  created_at: string;
}

export interface WaterStats {
  totalToday: number;
  goal: number;
  remaining: number;
  percentage: number;
}

export const waterApi = {
  // Get today's water intake total
  async getTodayTotal(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('water_logs' as any)
      .select('amount')
      .eq('user_id', userId)
      .gte('logged_at', `${today}T00:00:00`)
      .lt('logged_at', `${today}T23:59:59`);

    if (error) throw error;
    return (data as any)?.reduce((sum: number, log: any) => sum + log.amount, 0) || 0;
  },

  // Get water stats for today
  async getTodayStats(userId: string): Promise<WaterStats> {
    const totalToday = await this.getTodayTotal(userId);
    
    // Get user's water goal from profile
    const { data: profile } = await supabase
      .from('profiles' as any)
      .select('water_goal')
      .eq('id', userId)
      .single();

    const goal = (profile as any)?.water_goal || 1500; // Default 1.5L
    const remaining = Math.max(0, goal - totalToday);
    const percentage = Math.min(100, (totalToday / goal) * 100);

    return {
      totalToday,
      goal,
      remaining,
      percentage,
    };
  },

  // Log water intake
  async logWater(userId: string, amount: number): Promise<WaterLog> {
    const { data, error } = await supabase
      .from('water_logs' as any)
      .insert({
        user_id: userId,
        amount,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as WaterLog;
  },

  // Get water logs for a specific date
  async getWaterLogs(userId: string, date: string): Promise<WaterLog[]> {
    const { data, error } = await supabase
      .from('water_logs' as any)
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', `${date}T00:00:00`)
      .lt('logged_at', `${date}T23:59:59`)
      .order('logged_at', { ascending: false });

    if (error) throw error;
    return (data as WaterLog[]) || [];
  },

  // Delete a water log
  async deleteWaterLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('water_logs' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update water goal
  async updateWaterGoal(userId: string, goal: number): Promise<void> {
    const { error } = await supabase
      .from('profiles' as any)
      .upsert({
        id: userId,
        water_goal: goal,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  },

  // Get water goal
  async getWaterGoal(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('water_goal')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return (data as any)?.water_goal || 1500;
  },
};
