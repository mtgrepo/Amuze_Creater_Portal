import { PageSizeComponent } from "@/components/common/Pagination/page-number";
import { StoryTellingTable } from "@/components/Entertainment/StoryTelling/Titles/storytelling-table";
import { Button } from "@/components/ui/button";
import { useStoryTellingTitleQuery } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import { CirclePlus } from "lucide-react";
import React from "react";

export default function StoryTellingLayout() {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5);
    const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
    const creatorId = loginCreator?.creator?.id;

    const {
        storyTellingTitleList,
        isLoading,
        total,
        totalPages
    } = useStoryTellingTitleQuery(creatorId!, {
        page,
        pageSize
    });

    const handlePaginationChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Story Telling Titles</h2>
                    <h3 className="text-sm text-muted-foreground">
                        Manage and organize your storytelling titles
                    </h3>
                </div>
                <Button>
                    <CirclePlus className="mr-2 h-4 w-4" />Add New Title
                </Button>
            </div>

            {total > 0 && (
                <PageSizeComponent
                    pageSize={pageSize}
                    totalRows={total}
                    onChange={(size) =>
                        handlePaginationChange(1, size === "all" ? total : size)
                    }
                />
            )}
            <StoryTellingTable
                data={storyTellingTitleList}
                total={total}
                totalPages={totalPages}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                isFetching={isLoading}
            />
        </div>
    )
}