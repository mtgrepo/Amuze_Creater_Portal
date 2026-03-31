import { Card, CardContent, CardHeader } from "../ui/card";

export function StatCard({
    title,
    value,
    sub,
    icon: Icon,
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
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <span className={`p-2 rounded-lg ${accent}`}>
                        <Icon className="h-4 w-4" />
                    </span>
                </div>
            </CardHeader>
            <CardContent className="px-5">
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
}