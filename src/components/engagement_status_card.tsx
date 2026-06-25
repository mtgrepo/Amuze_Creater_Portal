import { TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import React from "react";

interface MetricItem {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>; 
}

interface EngagementProps {
  title: string;
  value: number; 
  previousValue?: number;
  metrics: MetricItem[]; 
  percentage: number
}

export function EngagementStatCard({ title, value, metrics, percentage }: EngagementProps) {

  let status: "up" | "down" | "equal" = "equal";
  if (percentage > 0) status = "up";
  if (percentage < 0) status = "down";

  return (
    <div className="group relative overflow-hidden rounded-xl bg-background border border-muted/60 text-card-foreground shadow-md p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl hover:border-muted-foreground/20">
      
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-muted/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-semibold tracking-tight text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          <TrendingUp className="h-4 w-4 stroke-[2.5]" />
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
            {value.toLocaleString()}
          </div>
        </div>
        
        <div className={`flex items-center text-xs font-semibold gap-1 px-2.5 py-1 rounded-full border shadow-sm transition-all duration-300 ${
          status === "up" && "text-emerald-600 bg-emerald-50/60 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30"
        } ${
          status === "down" && "text-rose-600 bg-rose-50/60 border-rose-200/50 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-800/30"
        } ${
          status === "equal" && "text-muted-foreground bg-muted/60 border-muted"
        }`}>
          {status === "up" && <ArrowUp className="h-3 w-3 stroke-3" />}
          {status === "down" && <ArrowDown className="h-3 w-3 stroke-3" />}
          {status === "equal" && <Minus className="h-3 w-3 stroke-3" />}
          
          <span className="tabular-nums">
            {status === "up" && `+${Number(percentage).toFixed(1)}%`}
            {status === "down" && `-${Math.abs(Number(percentage)).toFixed(1)}%`}
            {status === "equal" && "0.0%"}
          </span>
        </div>
      </div>

      {/* Mini-Metrics Breakdown Section */}
      <div className="mt-6 pt-4 border-t border-muted/60 grid grid-cols-3 gap-2 text-center divide-x divide-muted/60">
        {metrics?.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="flex flex-col items-center justify-center first:pl-0 pl-2">
              <div className="flex items-center gap-1 text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-300 mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium tracking-tight uppercase">{metric.label}</span>
              </div>
              <span className="text-sm font-bold text-foreground/90 group-hover:text-foreground tabular-nums transition-colors duration-300">
                {Number(metric.value) ? Number(metric.value).toLocaleString() : metric.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}