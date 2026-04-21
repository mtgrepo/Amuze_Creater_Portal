import IconWithTooltip from "@/components/common/IconWithTooltip";
import { Badge } from "@/components/ui/badge";
import type { ComicsTitleResponse } from "@/types/response/entertainment/comics/comicsTitleResponse";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, XCircle } from "lucide-react";
import TitleActions from "./title_actions";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../ui/hover-card";
import { useTranslation } from "react-i18next";


export default function Comicscolumn() {
  const { t } = useTranslation();
  const columns: ColumnDef<ComicsTitleResponse>[] = [
  {
    header: t('no'),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;

      return <div>{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "thumbnail",
  //   id: "thumbnail",
  //   header: "Thumbnail",
  //   cell: ({ row }) => {
  //     const thumbnail = row.getValue("thumbnail") as string;
  //     return <img src={thumbnail} alt="" className="w-20 h-12" />;
  //   },
  // },

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
    accessorKey: "description",
    header: t('description'),
    cell: ({ row }) => {
      const name = row.getValue("description") as string;

      return (
        <div className="max-w-87.5 wrap-break-word whitespace-normal">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: t('price'),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div>{price ? price.toLocaleString() : "0"}</div>;
    },
  },
  {
    accessorFn: (row) => row?.generes,
    id: "generes",
    header: t('genres'),
    cell: ({ row }) => {
      const genres = row.getValue("generes") as {
        id: number;
        name: string;
      }[];

      const visibleGenres = genres.slice(0, 2);
      const hiddenGenres = genres.slice(2);
      const hasMore = hiddenGenres.length > 0;

      return (
        <div className="flex flex-wrap gap-2">
          {visibleGenres.length === 0 && "N/A"}

          {visibleGenres.map((genre) => (
            <Badge key={genre.id}>
              {genre.name}
            </Badge>
          ))}

          {hasMore && (
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
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "views",
    header: t('views'),
    cell: ({ row }) => {
      const views = row.getValue("views") as number;
      return <div>{views ? views.toLocaleString() : "0"}</div>;
    },
  },
  {
    accessorKey: "likes",
    header: t('likes'),
    cell: ({ row }) => {
      const likes = row.getValue("likes") as number;
      return <div>{likes ? likes.toLocaleString() : "0"}</div>;
    },
  },
  {
    accessorKey: "ratings",
    header: t('rating'),
    cell: ({ row }) => {
      const ratings = row.getValue("ratings") as number;
      return <div>{ratings ? ratings.toLocaleString() : "0"}</div>;
    },
  },
  {
    accessorKey: "is_publish",
    header: t('publish_status'),
    cell: ({ row }) => {
      const published = row.getValue("is_publish") as boolean;

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
      const titles = row.original;

      return (
        <TitleActions {...titles} />
      );
    },
  },
];
  return columns;
}


