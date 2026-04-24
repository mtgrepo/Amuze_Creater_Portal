import IconWithTooltip from "@/components/common/IconWithTooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Notification } from "../../types/response/notification/notificationResponse";
import i18n from "../../i18n";
import NotificationActions from "./notification_actions";
import { Checkbox } from "../ui/checkbox";

export default function NotificationColumn() {
  const { t } = useTranslation();
  const columns: ColumnDef<Notification>[] = [
      {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      accessorKey: "title",
      header: t("title"),
      cell: ({ row }) => {
        const name = row.getValue("title") as string;

        return <div className="">{name}</div>;
      },
    },
    {
      accessorKey: "body",
      header: t('description'),
      cell: ({ row }) => {
        const body = row.getValue("body") as string;

        return (
          <div className="max-w-87.5 wrap-break-word whitespace-normal">
            {body}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => {
        const category = row.getValue("category") as string;

        return <div className="">{category ?? "N/A"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t('noti_status'),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <div>{status}</div>;
      },
    },
    {
      id: "sent_by",
      accessorFn: (row) => row?.sent_by?.name,
      header: t('sender'),
      cell: ({ row }) => {
        const sent_by = row.getValue("sent_by") as string;
        return <div>{sent_by ?? "N/A"}</div>;
      },
    },
    {
        accessorKey: "is_read",
        header: t('is_read'),
        cell: ({ row }) => {
            const is_read = row.getValue("is_read") as boolean;
            return (
                <div>
                    {is_read ? (
                        <IconWithTooltip tooltip="Read" icon={<CircleCheckBig className="text-green-500" />} />
                    ) : (
                        <IconWithTooltip tooltip="Unread" icon={<XCircle className="text-red-500" />} />
                    )}
                </div>
            )
        }
    },
    {
      accessorKey: "createdAt",
      header: t("date"),
      cell: ({ row }) => {
        const val = row.getValue("createdAt") as string | null;
        return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const notifications = row.original;

        return (
          <NotificationActions {...notifications} />
        );
      },
    },
  ];
  return columns;
}
