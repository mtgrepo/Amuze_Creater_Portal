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
  if (percent > 0) {
    status = "up";
  } else if (percent < 0) {
    status = "down";
  } else if (percent == 0) {
    status = "equal"
  }

  return (
    <Card className="p-6 flex flex-col justify-between h-full min-h-40">
      {/* Top Row: Title on Left, Icon on Right */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          {title}
        </span>
        <span className={`p-2 rounded-lg ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      
      {/* Bottom Row: Large Value & Percentage Alignment */}
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {Number(value) ? Number(value).toLocaleString() : value}
          </p>
        </div>

        {/* Status Percentage Badge */}
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
            {status === "up" && `+${percent.toFixed(1)}%`}
            {status === "down" && `-${Math.abs(percent).toFixed(1)}%`}
            {status === "equal" && "0.0%"}
          </span>
        </div>
      </div>
    </Card>
  );
}