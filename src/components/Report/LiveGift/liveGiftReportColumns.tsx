import type { GiftReport, LiveGiftReportParams } from "@/types/response/report/liveGiftReportResponse";
import type { ColumnDef } from "@tanstack/react-table";

export default function LiveGiftReportColumns({
    page,
    pageSize
}: LiveGiftReportParams) {
    const columns: ColumnDef<GiftReport>[] = [
        {
            id: "index",
            header: "No",
            cell: ({ row }) => {
                return <div>{(page - 1) * pageSize + row.index + 1}</div>;
            },
        },
        {
            accessorKey: "stream.title",
            header: "Stream Title",
            cell: ({ row }) => row.original.stream?.title ?? "-",
        },
        {
            accessorKey: "gift.name",
            header: "Gift Name",
            cell: ({ row }) => row.original.gift?.name ?? "-",
        },
        {
            accessorKey: "gift.giftCost",
            header: "Gift Cost",
            cell: ({ row }) => row.original.gift?.giftCost ?? "-",
        },
        {
            accessorKey: "percentage",
            header: "Percentage",
            cell: ({ row }) => `${row.original.percentage}%`,
        },
        {
            accessorKey: "receiveAmount",
            header: "Receive Amount",
            cell: ({ row }) => row.original.receiveAmount,
        },
        {
            id: "sender",
            header: "Sender",
            cell: ({ row }) => row.original.sender?.name ?? "-",
        },
        {
            id: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = row.original.createdAt;
                return <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>
            },
        },
    ]
    return columns
}