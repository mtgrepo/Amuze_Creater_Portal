import type { ColumnDef } from "@tanstack/react-table";
import type { PostResponse } from "@/types/response/entertainment/post/postResponse";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Eye, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import LongText from "@/components/common/longtext";

export default function PostColumns({ is_banned }: { is_banned: boolean }) {
  const navigate = useNavigate();

  const columns: ColumnDef<PostResponse>[] = [
    {
      header: "No",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
    },

    {
      accessorKey: "description",
      header: "Post Content",
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
      header: "Media",
      accessorFn: (row) => row.media,
      cell: ({ row }) => {
        const media = row.original.media || [];

        if (media.length === 0) {
          return (
            <span className="text-muted-foreground text-xs">No Media</span>
          );
        }

        const firstItem = media[0];

        return (
          <div className="relative h-10 w-10">
            <div className="h-10 w-10 rounded-md overflow-hidden border bg-muted">
              {firstItem.type === "image" ? (
                <img
                  src={firstItem.url}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full">
                  <video
                    src={firstItem.url}
                    muted
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="bg-white/80 p-0.5 rounded-full shadow-sm">
                      <Play size={10} className="fill-current text-black" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {media.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-white/20 shadow-sm">
                <span className="text-[9px] font-bold text-white leading-none">
                  +{media.length - 1}
                </span>
              </div>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "view_count",
      header: "Views",
      cell: ({ row }) => {
        const views = row.getValue("view_count") as number;
        return <div>{views || 0}</div>;
      },
    },

    ...(is_banned
      ? [
        {
          accessorKey: "ban_reason",
          header: "Ban Reason",
          cell: ({ row }: any) => (
            <span>
              <LongText text={row.getValue("ban_reason") || "-"} />
            </span>
          ),
        },
        {
          accessorFn: (row: any) => row.bannedByUser?.name,
          id: "bannedBy",
          header: "Banned By",
          cell: ({ row }: any) => (
            <span>{row.original.bannedByUser?.name || "-"}</span>
          ),
        },
      ]
      : []),

    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  navigate(`/entertainment/posts/details/${post.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/entertainment/posts/edit/${post.id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
