
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ value, size = 40, strokeWidth = 4, showLabel = true, className, ...props }, ref) => {
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (value / 100) * circumference;
    
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute"
        >
          <circle
            className="text-gray-200"
            stroke="currentColor"
            fill="none"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary"
            stroke="currentColor"
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-medium">{Math.round(value)}%</span>
        )}
      </div>
    );
  }
);

ProgressCircle.displayName = "ProgressCircle";
