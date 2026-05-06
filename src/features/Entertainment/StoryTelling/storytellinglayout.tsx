import { StoryTellingTable } from "@/components/Entertainment/StoryTelling/Titles/storytelling_table";
import { Button } from "@/components/ui/button";
import { useStoryTellingTitleQuery } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import { CirclePlus, Search } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";


export default function StoryTellingLayout() {
    const [page, setPage] = React.useState(1);
    const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
    const [pageSize, setPageSize] = React.useState(10);
    const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
    const creatorId = loginCreator?.creator?.id;
    const [search, setSearch] = React.useState("");
    const navigate = useNavigate();


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
            <div className="w-full mt-5">
                <div className="flex flex-row justify-end gap-3">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Filter name..."
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

                    <Button size="sm" className="cursor-pointer" onClick={() => navigate('/entertainment/storytelling/title')}>
                        <CirclePlus className="h-4 w-4" /> {t('story_telling_form.create_button')}
                    </Button>
                </div>
            </div>

            <div className="border p-3 rounded-lg space-y-3">
                <Tabs
                    value={tab}
                    onValueChange={(val) =>
                        setTab(val as "all" | "approved" | "published")
                    }
                    className="w-full my-5"
                >
                    <TabsList className="w-full grid grid-cols-3 border-b" variant={"line"}>
                        <TabsTrigger value="all" className="w-full text-center">
                            {t('all')}
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="w-full text-center">
                            {t('approved')}
                        </TabsTrigger>
                        <TabsTrigger value="published" className="w-full text-center">
                            {t('published')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all"></TabsContent>
                    <TabsContent value="approved" />
                    <TabsContent value="published" />
                </Tabs>

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