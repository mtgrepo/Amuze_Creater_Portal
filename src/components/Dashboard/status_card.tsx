import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

export function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  previousValue,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  previousValue?: string | number;
}) {
  const current = Number(value) || 0;
  const previous = Number(previousValue) || 0;

  let status: "up" | "down" | "equal" = "equal";
  if (current > previous) {
    status = "up";
  } else if (current < previous) {
    status = "down";
  }

  let percent = 0;
  if (previous !== 0) {
    percent = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    percent = 100; 
  }

  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5 pb-0">
        <div className="flex items-center justify-between">
          <span className={`p-2 rounded-lg ${accent}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="flex flex-col gap-3">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <div className="flex gap-1 text-sm font-medium">
            {status === "up" && (
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="h-4 w-4" />
                {percent.toFixed(1)}%
              </span>
            )}
            {status === "down" && (
              <span className="text-rose-500 flex items-center">
                <ArrowDown className="h-4 w-4" />
                {Math.abs(percent).toFixed(1)}%
              </span>
            )}
            {status === "equal" && (
              <span className="text-muted-foreground flex items-center">
                <Minus className="h-4 w-4" />
                0.0%
              </span>
            )}
          </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        {/* {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>} */}
      </CardContent>
    </Card>
  );
}