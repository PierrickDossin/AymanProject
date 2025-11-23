import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  progress?: {
    current: number;
    target: number;
    start: number;
  };
}

const StatCard = ({ title, value, subtitle, icon, trend, progress }: StatCardProps) => {
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!progress) return 0;
    const { current, target, start } = progress;
    const totalChange = Math.abs(target - start);
    const currentChange = Math.abs(current - start);
    const percentage = totalChange > 0 ? (currentChange / totalChange) * 100 : 0;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const progressPercentage = progress ? getProgressPercentage() : 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/30 p-5 shadow-medium hover:shadow-glow transition-all duration-300 animate-scale-in group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          {icon && (
            <div className="p-2.5 rounded-xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-black text-foreground leading-none">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
            )}
          </div>
          {progress && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="text-primary font-bold">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          {trend && !progress && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`text-xs font-bold ${trend.positive ? "text-success" : "text-destructive"}`}>
                {trend.positive ? "↑" : "↓"}
              </span>
              <p className={`text-xs font-semibold ${trend.positive ? "text-success" : "text-destructive"}`}>
                {trend.value}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
