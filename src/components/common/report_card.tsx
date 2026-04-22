import { Card, CardContent, CardHeader } from "../ui/card";

export default function ReportCard({
  title,
  value,
  accent,
  sub,
}: {
  title: string;
  value: string | number;
  accent: string;
  sub: string;
}) {
  return (
    <div className="w-full min-w-0 h-full">
      <Card
        className={`gap-3 py-5 ${accent} hover:border-primary/50 transition-colors duration-300`}
      >
        <CardHeader className="px-5 pb-0"></CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground tracking-widest">
            {title}
          </span>
          <p className="text-3xl font-bold text-primary tracking-widest">
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </CardContent>
      </Card>
    </div>
  );
}
