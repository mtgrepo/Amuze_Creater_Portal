import { Badge } from "@/components/ui/badge";
import type { StoryTellingTitleResponse } from "@/types/response/entertainment/storytelling/storytellingResponse";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { format } from "date-fns";

export const columns: ColumnDef<StoryTellingTitleResponse>[] = [
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
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div>{price ? price.toLocaleString() : "0"}</div>;
    },
  },
  {
    accessorFn: (row) => row?.generes,
    id: "generes",
    header: "Genres",
    cell: ({ row }) => {
      const genres = row.getValue("generes") as {
        id: number;
        name: string;
      }[];

      // Show at most 2
      const visibleGenres = genres.slice(0, 2);
      const hiddenGenres = genres.slice(2);
      const hasMore = hiddenGenres.length > 0;

      return (
        <div className="flex flex-wrap gap-2">
          {visibleGenres?.length === 0 && "N/A"}
          {visibleGenres.map((genre) => (
            <Badge key={genre.id}>{genre?.name}</Badge>
          ))}
          {hasMore &&
            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger className="cursor-pointer">
                <span className="text-gray-800 dark:text-gray-400 font-semibold italic">+ {hiddenGenres.length} more</span>
              </HoverCardTrigger>
              <HoverCardContent side="right">
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {hiddenGenres.map((genre) => (
                    <Badge key={genre.id}>
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          }
        </div>
      );
    },
  },
  {
    accessorFn: (row) => ({
      approved: row.approve_status,
      published: row.is_publish
    }),
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const approved = row.original.approve_status as number;
      const published = row.original.is_publish as boolean;

      let tooltip = "";
      let icon = null;

      if (approved === 1 && published) {
        tooltip = "Approved & Published";
        icon = <CircleCheckBig className="text-green-500 w-4 h-4" />;
      } else if (approved === 1 && !published) {
        tooltip = "Approved but Not Published";
        icon = <CircleCheckBig className="text-yellow-500 w-4 h-4" />;
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
      const title = row.original;

      const handleViewDetails = () => {
        router.navigate(`/entertainment/storytelling/details/${title.id}`, {
          state: {
            titleName: title?.name,
            titleId: title?.id
          }
        })
      }
      const handleEditTitle = () => {
        router.navigate(`/entertainment/storytelling/edit/${title.id}`, {
          state: {
            titleName: title?.name,
            titleId: title?.id
          },
        })
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
              <Pencil /> Edit Title
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