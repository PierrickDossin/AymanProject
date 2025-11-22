import { useId } from "react";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  sublabel?: string;
}

const CircularProgress = ({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 8,
  color,
  label,
  sublabel
}: CircularProgressProps) => {
  const gradientId = useId();
  const glowId = `${gradientId}-glow`;
  const percentage = Math.max(0, Math.min((value / max) * 100, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const displayValue = Math.round(value);

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{ filter: `url(#${glowId})` }}
          />
        </svg>

        {/* Inner value */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tracking-tight text-foreground">{displayValue}</span>
          {sublabel && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default CircularProgress;
