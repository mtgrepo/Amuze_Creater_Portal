import {  TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import React from "react";

interface MetricItem {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>; 
}

interface EngagementProps {
  title: string;
  value: number; 
  previousValue: number;
  metrics: MetricItem[]; 
  percentage: number
}

export function EngagementStatCard({ title, value, metrics, percentage }: EngagementProps) {

  let status: "up" | "down" | "equal" = "equal";
  if (percentage > 0) {
    status = "up";
  } else if (percentage < 0) {
    status = "down";
  } else if (percentage == 0) {
    status = "equal"
  }

  return (
    <div className="rounded-xl  bg-background border border-border text-card-foreground shadow-xl p-6 flex flex-col justify-between">
      {/* Header section */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium tracking-tight text-muted-foreground">{title}</span>
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      
      {/* Big total summary & Dynamic Percentage */}
      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        </div>
        
        {/* Percentage badge changes color dynamically */}
        <div className={`flex items-center text-xs font-medium gap-0.5 px-2 py-0.5 rounded-full ${
          status === "up" && "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
        } ${
          status === "down" && "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30"
        } ${
          status === "equal" && "text-muted-foreground bg-muted"
        }`}>
          {status === "up" && <ArrowUp className="h-3 w-3" />}
          {status === "down" && <ArrowDown className="h-3 w-3" />}
          {status === "equal" && <Minus className="h-3 w-3" />}
          
          <span>
            {status === "up" && `+${Number(percentage).toFixed(1)}%`}
            {status === "down" && `-${Math.abs(Number(percentage))}%`}
            {status === "equal" && "0.0%"}
          </span>
        </div>
      </div>

      {/* Mini-Metrics Breakdown Section */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        {metrics?.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{metric.label}</span>
              </div>
              <span className="text-sm font-semibold">{metric.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}