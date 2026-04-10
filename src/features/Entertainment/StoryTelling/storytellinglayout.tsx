import { PageSizeComponent } from "@/components/common/Pagination/page-number";
import { StoryTellingTable } from "@/components/Entertainment/StoryTelling/Titles/storytelling-table";
import { Button } from "@/components/ui/button";
import { useStoryTellingTitleQuery } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import router from "@/router/routes";
import { CirclePlus, Search } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";


export default function StoryTellingLayout() {
    const [page, setPage] = React.useState(1);
    const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
    const [pageSize, setPageSize] = React.useState(10);
    const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
    const creatorId = loginCreator?.creator?.id;
    const [search, setSearch] = React.useState("");


    const queryParams = React.useMemo(() => {
        switch (tab) {
            case "approved":
                return { approve_status: 1 };
            case "published":
                return { approve_status: 1, is_published: true };
            default:
                return {};
        }
    }, [tab]);

    const {
        storyTellingTitleList,
        isLoading,
        total,
        totalPages
    } = useStoryTellingTitleQuery(creatorId!, {
        page,
        pageSize,
        name: search,
        ...queryParams
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
                <Button onClick={() => router.navigate('/entertainment/storytelling/title')}>
                    <CirclePlus className="mr-2 h-4 w-4" />Add New Title
                </Button>
            </div>

            <div className="border p-3 rounded-lg space-y-3">
                <Tabs
                    value={tab}
                    onValueChange={(val) =>
                        setTab(val as "all" | "approved" | "published")
                    }
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-3 border-b" variant={"line"}>
                        <TabsTrigger value="all" className="w-full text-center">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="w-full text-center">
                            Approved
                        </TabsTrigger>
                        <TabsTrigger value="published" className="w-full text-center">
                            Published
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all"></TabsContent>
                    <TabsContent value="approved" />
                    <TabsContent value="published" />
                </Tabs>

                <div className="flex justify-between">

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Filter title name..."
                            className="pl-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setSearch(e.currentTarget.value)
                                }
                            }}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            >
                                ✕
                            </button>
                        )}
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
                </div>
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
        </div>
    )
}