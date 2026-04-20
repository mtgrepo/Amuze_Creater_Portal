import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Eye, MoreHorizontal, Pencil, XCircle } from "lucide-react";
import router from "../../../../router/routes";
import { format } from "date-fns";
import type { Museum } from "@/types/response/entertainment/museum/museumResponse";

export const columns: ColumnDef<Museum>[] = [
  {
    header: "No",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;

      return <div>{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const name = row.getValue("description") as string;

      return (
        <div className="line-clamp-1 max-w-60 wrap-break-word whitespace-normal">
          {name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => ({
      approved: row.approve_status,
    }),
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const approved = row.original.approve_status as number;

      let tooltip = "";
      let icon = null;

      if (approved === 1) {
        tooltip = "Approved";
        icon = <CircleCheckBig className="text-green-500 w-4 h-4" />;
      } else if (approved === 0) {
        tooltip = "Not Approved";
        icon = <XCircle className="text-red-500 w-4 h-4" />;
      }

      return <div className="relative group inline-block">
        {icon}

        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex
                  max-w-xs wrap-break-word whitespace-normal rounded bg-gray-800 text-white text-xs 
                  px-2 py-1 shadow-lg pointer-events-none">
          {tooltip}
        </div>
      </div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("created_at") as string | null;
      return <div>{val ? format(new Date(val), "yyyy-MM-dd") : "-"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const museum= row.original;

      const handleViewDetails = () => {
        router.navigate(`/entertainment/museum/details/${museum.id}`)
      }
      const handleEditTitle = () => {
        router.navigate(`/entertainment/museum/edit/${museum.id}`)
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEditTitle}>
              <Pencil /> Edit Museum
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye /> View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }

]