import IconWithTooltip from "@/components/common/IconWithTooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GradesResponse } from "../../../../types/response/entertainment/education/gradeResponse";
import i18n from "../../../../i18n";
import GradeActions from "./grade_actions";


export default function GradeColumn() {
    const { t } = useTranslation();
    const columns: ColumnDef<GradesResponse>[] = [
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
        {
            accessorKey: "name",
            header: t('title'),
            cell: ({ row }) => {
                const name = row.getValue("name") as string;

                return (
                    <div className="">
                        {name}
                    </div>
                );
            },
        },
        {
            accessorKey: "is_old_question",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("is_old_question");

                return (
                    <div>
                        {status ? (
                            <p>Old Question</p>
                        ) : (
                            <p>Normal</p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "is_published",
            header: "Published",
            cell: ({ row }) => {
                const published = row.getValue("is_published") as boolean;

                return published ? (
                    <IconWithTooltip tooltip="Published" icon={<CircleCheckBig className="text-green-500 w-4 h-4" />} />
                ) : (
                    <IconWithTooltip tooltip="Unpublished" icon={<XCircle className="text-red-500 w-4 h-4" />} />
                );
            },
        },
        {
            accessorKey: "created_at",
            header: t('date'),
            cell: ({ row }) => {
                const val = row.getValue("created_at") as string | null;
                return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const grades = row.original;

                return (
                    <GradeActions {...grades} />
                );
            },
        },
    ];
    return columns;
}



