import { DataTable } from "@/components/DataTable";
import { useLiveGiftReportQuery } from "@/composable/Query/Report/useLiveGiftReportQuery"
import LiveGiftReportColumns from "./liveGiftReportColumns";
import { PageSizeComponent } from "@/components/common/Pagination/page-number";
import Paginator from "@/components/common/Pagination/paginator";
import type { GiftReport } from "@/types/response/report/liveGiftReportResponse";

interface LiveGiftReportProps {
    page: number;
    pageSize: number;
    onPaginationChange: (page: number, limit: number) => void;
}

export function LiveGiftReportTable({ page, pageSize, onPaginationChange }: LiveGiftReportProps) {
    const { liveGiftList, total, totalPage, isLoading, isError } = useLiveGiftReportQuery({ page, pageSize });
    const columns = LiveGiftReportColumns({ page, pageSize });
    const liveGiftListData: GiftReport[] = liveGiftList?.data || [];

    return (
        <div>
            <DataTable
                columns={columns}
                data={liveGiftListData}
                isFetching={isLoading}
                isError={isError}
            />
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {total} total row(s)
                </div>
                {total > 0 && (
                    <div className="flex items-center gap-3">

                        <PageSizeComponent
                            pageSize={pageSize}
                            totalRows={total}
                            onChange={(size) =>
                                onPaginationChange(1, size === "all" ? total : size)
                            }
                        />
                        <Paginator
                            currentPage={page}
                            totalPages={totalPage}
                            onPageChange={(pageNumber) =>
                                onPaginationChange(pageNumber, pageSize)
                            }
                            showPreviousNext
                        />
                    </div>
                )}
            </div>
        </div>
    )
}