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

        return (
          <div className="relative h-12 w-12">
            {media.slice(0, 3).map((m, i) => (
              <div
                key={m.url}
                className="absolute h-10 w-10 border rounded overflow-hidden bg-background"
                style={{
                  top: i * 4,
                  left: i * 4,
                  zIndex: 10 - i,
                }}
              >
                {m.type === "image" ? (
                  <img src={m.url} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <video
                      src={m.url}
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/60 p-1 rounded-full">
                        <Play size={12} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
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
