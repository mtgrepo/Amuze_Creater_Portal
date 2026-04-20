import IconWithTooltip from "@/components/common/IconWithTooltip";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, XCircle } from "lucide-react";
import type { NovelResponse } from "../../../types/response/entertainment/novel/novelResponse";
import NovelActions from "./novel_actions";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";


export default function NovelColumn() {
    const { t } = useTranslation();
    const columns: ColumnDef<NovelResponse>[] = [
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
        // {
        //     header: t('no'),
        //     cell: ({ row, table }) => {
        //         const pageIndex = table.getState().pagination.pageIndex;
        //         const pageSize = table.getState().pagination.pageSize;
        //         const displayNo = pageIndex * pageSize + row.index + 1;

        //         // Use i18n.language to determine if we should convert digits
        //         const formattedNo = i18n.language === 'mm' // or 'my' depending on your config
        //             ? toBurmeseNumber(displayNo)
        //             : displayNo;

        //         return (
        //             <div>{formattedNo}</div>
        //         );
        //     },
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "name",
            header: t('name'),
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
            accessorKey: "age_rating",
            header: t('age_rating'),
            cell: ({ row }) => {
                const ageRating = row.getValue("age_rating") as number;
                return <div>{ageRating ? ageRating.toLocaleString() : "0"}</div>;
            }
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
                const novels = row.original;

                return (
                    <NovelActions {...novels} />
                );
            },
        },
    ];
    return columns;
}



