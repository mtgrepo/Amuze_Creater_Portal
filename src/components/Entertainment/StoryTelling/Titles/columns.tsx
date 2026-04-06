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
import { Eye,  MoreHorizontal, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    accessorKey: "thumbnail",
    id: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string;
      return (
        <div className="w-14 h-14 border">
          <img src={thumbnail} alt="" className="w-full h-full object-cover" />
        </div>
      );
    },
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
      const hasMore = genres.length > 2;

      return (
        <div className="flex flex-wrap gap-2">
          {visibleGenres?.length === 0 && "N/A"}
          {visibleGenres.map((genre) => (
            <Badge id={String(genre?.id)}>{genre?.name}</Badge>
          ))}
          {hasMore && <div>...</div>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.createdByUser,
    id: "createdByUser",
    header: "Author",
    cell: ({ row }) => {
      const createdByUser = row.getValue("createdByUser") as {
        id: number;
        name: string;
      };
      return (
        <div className="flex flex-wrap gap-2">
          <div>{createdByUser.name}</div>
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "is_publish",
  //     header: "Published",
  //     cell: ({ row }) => {
  //       const published = row.getValue("is_publish") as boolean;

  //       return published ? (
  //         <IconWithTooltip tooltip="Published" icon={<CircleCheckBig className="text-green-500 w-4 h-4"/>} />
  //       ) : (
  //         <IconWithTooltip tooltip="Unpublished" icon={<XCircle className="text-red-500 w-4 h-4"/>} />
  //       );
  //     },
  //   },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("created_at") as string | null;
      return <div>{val ? new Date(val).toLocaleString() : "-"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const navigate = useNavigate();
      const title = row.original;

      const handleViewDetails = () => {
        navigate(`/entertainment/storytelling/details/${title.id}`)
      }
      const handleEditTitle = () => {
        navigate(`/entertainment/storytelling/edit/${title.id}`)
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