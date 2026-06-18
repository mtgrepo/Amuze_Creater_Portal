import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TotalFollowersColumn() {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      header: t("no"),
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination?.pageIndex || 0;
        const pageSize = table.getState().pagination?.pageSize || 10;

        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "profile",
      header: "Profile",
      cell: ({ row }) => {
        return (
          <Avatar size="lg">
            <AvatarImage src={row.original.profile} />
            <AvatarFallback>{'CN'}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "follower_name",
      header: t("name"),
      cell: ({ row }) => <div>{row.original.follower_name}</div>,
    },
    {
        accessorKey: 'email',
        header: "Email",
        cell: ({row}) => {
            return (
                <div>{row.original.email ?? 'N/A'}</div>
            )
        }
    },
    {
        accessorKey: 'phone_no',
        header: "Phone",
        cell: ({row}) => {
            return (
                <div>{row.original.phone_no ?? 'N/A'}</div>
            )
        }
    },
    // {
    //     accessorFn: (row) => row.original.wallets,
    //     header: "Wallets",
    //     cell: ({row}) => {
    //         const balance = row.original.balance;
    //         return (
    //             <div>{balance}</div>
    //         )
    //     }

    // },
    // {
    //   accessorKey: "created_at",
    //   header: 'Joined Date',
    //   cell: ({ row }) => {
    //     const val = row.getValue("created_at") as string | null;
    //     return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
    //   },
    // },
  ];

  return columns;
}
