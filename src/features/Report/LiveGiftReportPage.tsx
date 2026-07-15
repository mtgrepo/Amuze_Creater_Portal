import { LiveGiftReportTable } from "@/components/Report/LiveGift/LiveGiftReportTable";
import { useTableParams } from "@/hooks/use-table-params";

export default function LiveGiftReportPage() {
    const {
        page,
        limit,
        handlePaginationChange,
    } = useTableParams({ page: 1, limit: 10 });
    return (
        <div>
            <div className="flex flex-col gap-1 mb-8 pb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Live Gift Report
                </h1>
                <p className="text-sm text-muted-foreground">
                    View and track live gift transactions and revenue distribution.
                </p>
            </div>

            <LiveGiftReportTable
                page={page}
                pageSize={limit}
                onPaginationChange={handlePaginationChange}
            />
        </div>
    )
}