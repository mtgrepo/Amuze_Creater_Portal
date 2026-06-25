import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card } from "../ui/card";

export function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  percent
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string; 
  previousValue?: string | number;
  percent: number
}) {

  let status: "up" | "down" | "equal" = "equal";
  if (percent > 0) status = "up";
  if (percent < 0) status = "down";

  return (
    <Card className="group relative overflow-hidden p-6 flex flex-col bg-background border border-muted/60 shadow-md justify-between h-full min-h-40 transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl hover:border-muted-foreground/20">
      
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-muted/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-row items-center justify-between space-y-0">
        <span className="text-sm font-semibold tracking-tight text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
        <span className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${accent}`}>
          <Icon className="h-4 w-4 stroke-[2.5]" />
        </span>
      </div>
      
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
            {Number(value) ? Number(value).toLocaleString() : value}
          </p>
        </div>

        {/* Status Percentage Badge */}
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
            {status === "up" && `+${percent.toFixed(1)}%`}
            {status === "down" && `-${Math.abs(percent).toFixed(1)}%`}
            {status === "equal" && "0.0%"}
          </span>
        </div>
      </div>
    </Card>
  );
}