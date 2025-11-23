import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface GoalProgressChartProps {
  goalId: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  metric: string;
}

const GoalProgressChart = ({ 
  goalId, 
  startValue, 
  targetValue, 
  currentValue,
  metric 
}: GoalProgressChartProps) => {
  const { data: progressData } = useQuery({
    queryKey: ['goalProgress', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goal_progress')
        .select('*')
        .eq('goal_id', goalId)
        .order('recorded_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!goalId,
  });

  const chartData = useMemo(() => {
    if (!progressData || progressData.length === 0) {
      return [
        { value: startValue, label: 'Start' },
        { value: currentValue, label: 'Now' },
      ];
    }

    return progressData.map((entry, index) => {
      const date = new Date(entry.recorded_at);
      const label = index === 0 
        ? 'Start' 
        : index === progressData.length - 1 
        ? 'Now' 
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        value: Number(entry.value),
        label,
        date: entry.recorded_at,
      };
    });
  }, [progressData, startValue, currentValue]);

  const minValue = Math.min(startValue, targetValue, ...chartData.map(d => d.value));
  const maxValue = Math.max(startValue, targetValue, ...chartData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const pathData = useMemo(() => {
    if (chartData.length < 2) return '';
    
    const width = 100;
    const step = width / (chartData.length - 1);
    
    const getY = (value: number) => {
      return ((maxValue - value) / range) * 60;
    };
    
    const points = chartData.map((point, i) => {
      const x = i * step;
      const y = getY(point.value);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [chartData, maxValue, range]);

  const getY = (value: number) => {
    return ((maxValue - value) / range) * 60;
  };

  const targetY = getY(targetValue);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">Progress Chart</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary rounded-full" />
            <span className="text-muted-foreground">Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-success" />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-20 bg-secondary/30 rounded-xl p-3 overflow-hidden">
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Target line */}
          <line
            x1="0"
            y1={targetY}
            x2="100"
            y2={targetY}
            stroke="hsl(142, 76%, 36%)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          
          {/* Progress line */}
          {chartData.length >= 2 && (
            <>
              {/* Gradient fill under line */}
              <defs>
                <linearGradient id={`gradient-${goalId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <path
                d={`${pathData} L 100,60 L 0,60 Z`}
                fill={`url(#gradient-${goalId})`}
              />
              
              <path
                d={pathData}
                fill="none"
                stroke="hsl(262, 83%, 58%)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {chartData.map((point, i) => {
                const x = i * (100 / (chartData.length - 1));
                const y = getY(point.value);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="hsl(262, 83%, 58%)"
                    className="drop-shadow-lg"
                  />
                );
              })}
            </>
          )}
        </svg>
        
        {/* Value labels */}
        <div className="absolute top-1 left-2 text-[10px] font-bold text-primary">
          {startValue}{metric}
        </div>
        <div className="absolute top-1 right-2 text-[10px] font-bold text-primary">
          {currentValue}{metric}
        </div>
        <div className="absolute bottom-1 right-2 text-[10px] font-bold text-success">
          Target: {targetValue}{metric}
        </div>
      </div>
    </div>
  );
};

export default GoalProgressChart;
