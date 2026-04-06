import { Card, CardContent, CardHeader } from "../ui/card";

export function StatCard({
  title,
  value,  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5 pb-0">
        <div className="flex items-center justify-between">
          <span className={`p-2 rounded-lg ${accent}`}>
            <Icon className="h-4 w-4" />
          </span>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
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
