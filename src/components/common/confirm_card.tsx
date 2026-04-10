import { Badge } from "../ui/badge"

interface ConfirmCardProps {
    name: string,
    description?: string,
    price?: number
}
export default function ConfirmCard(data: ConfirmCardProps) {
    return (
        <div className="my-4 rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Series Title
                </span>
                <p className="text-sm font-semibold leading-none">
                    {data?.name || "Untitled Series"}
                </p>
            </div>

            {data?.description && (
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Description
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {data?.description || "No description provided."}
                    </p>
                </div>
            )}


            <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Price
                </span>
                <Badge variant="secondary" className="font-mono">
                    {data?.price} Coins
                </Badge>
            </div>
        </div>
    )
}
