import IconWithTooltip from "@/components/common/IconWithTooltip";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, XCircle } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useTranslation } from "react-i18next";
import type { Notification, NotificationResponse } from "../../types/response/notification/notificationResponse";
import i18n from "../../i18n";



export default function NotificationColumn() {
    const { t } = useTranslation();
    const columns: ColumnDef<Notification>[] = [
        {
            header: t('no'),
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                if (i18n.language === 'en') {
                    <div>{pageIndex * pageSize + row.index + 1}</div>
                }

                return (
                    <div>{pageIndex * pageSize + row.index + 1}</div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        // {
        //     header: t('no'),
        //     cell: ({ row, table }) => {
        //         const pageIndex = table.getState().pagination.pageIndex;
        //         const pageSize = table.getState().pagination.pageSize;
        //         const displayNo = pageIndex * pageSize + row.index + 1;

        //         // Use i18n.language to determine if we should convert digits
        //         const formattedNo = i18n.language === 'mm' // or 'my' depending on your config
        //             ? toBurmeseNumber(displayNo)
        //             : displayNo;

        //         return (
        //             <div>{formattedNo}</div>
        //         );
        //     },
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "title",
            header: t('title'),
            cell: ({ row }) => {
                const name = row.getValue("title") as string;

                return (
                    <div className="">
                        {name}
                    </div>
                );
            },
        },
        {
            accessorKey: "body",
            header: "body",
            cell: ({ row }) => {
                const name = row.getValue("body") as string;

                return (
                    <div className="max-w-87.5 wrap-break-word whitespace-normal">
                        {name}
                    </div>
                );
            },
        },

        {
            accessorKey: "createdAt",
            header: t('date'),
            cell: ({ row }) => {
                const val = row.getValue("createdAt") as string | null;
                return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const novels = row.original;

                return (
                    // <NovelActions {...novels} />
                    <p></p>
                );
            },
        },
    ];
    return columns;
}



