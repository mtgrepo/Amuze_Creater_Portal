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
      header: t("no"),
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        if (i18n.language === "en") {
          <div>{pageIndex * pageSize + row.index + 1}</div>;
        }

        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("title"),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;

        return (
          <div className="min-w-30 max-w-500 md:max-w-[320px] wrap-break-word whitespace-normal font-medium">
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "is_old_question",
      header: t("category"),
      cell: ({ row }) => {
        const status = row.getValue("is_old_question");

        return <div>{status ? <p>Old Question</p> : <p>Normal</p>}</div>;
      },
    },
    {
      accessorFn: (row) => ({
        is_published: row.is_published,
        approve_status: row.approve_status,
      }),
      id: "status",
      header: t("status"),
      cell: ({ row }) => {
        const is_published = row.original.is_published as boolean;
        const approve_status = row.original.approve_status as number;
        if (approve_status === 1 && is_published) {
          return (
            <IconWithTooltip
              tooltip="Approved & Published"
              icon={<CircleCheckBig className="text-green-500 w-4 h-4" />}
            />
          );
        } else if (approve_status === 1 && !is_published) {
          return (
            <IconWithTooltip
              tooltip="Approved but Not Published"
              icon={<CircleCheckBig className="text-yellow-500 w-4 h-4" />}
            />
          );
        } else if (approve_status === 0) {
          return (
            <IconWithTooltip
              tooltip="Not Approved"
              icon={<XCircle className="text-red-500 w-4 h-4" />}
            />
          );
        }
      },
    },
    {
      accessorKey: "created_at",
      header: t("date"),
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

        return <GradeActions {...grades} />;
      },
    },
  ];
  return columns;
}
