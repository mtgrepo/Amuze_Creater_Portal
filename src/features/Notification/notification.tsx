import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNotificationsQuery } from "../../composable/Query/Notification/useNotificationsQuery";
import { Input } from "../../components/ui/input";

export default function Notification() {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
    const [search, setSearch] = React.useState("");
    const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
    const creatorId = loginCreator?.creator?.id;
    const [debouncedSearch] = useDebounce(search, 700);


    // Reset page when tab changes
    React.useEffect(() => {
        setPage(1);
    }, [tab]);


const { notificationsList, isLoading } = useNotificationsQuery({
    page,
    pageSize: limit,
    userId: Number(creatorId),
    role_id: Number(loginCreator?.creator?.role_id!),
    is_read: false
});

    React.useEffect(() => {
        setPage(1);
    }, [debouncedSearch, tab]);

    const handlePaginationChange = (newPage: number, newLimit: number) => {
        setPage(newPage);
        setLimit(newLimit);
    };


    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 px-4">
                <div className="w-full mt-5 ">
                    <div className="flex flex-row justify-end gap-3">
                        <Input
                            placeholder="Filter name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button
                            size={"sm"}
                            className="cursor-pointer"
                            onClick={() => navigate("/entertainment/novel/create")}
                        >
                            <CirclePlus className="w-4 h-4" />
                            {t("create_new_novel")}
                        </Button>
                    </div>
                    <div className="border border-border p-3 rounded-lg my-3">
                        <Tabs
                            value={tab}
                            onValueChange={(val) =>
                                setTab(val as "all" | "approved" | "published")
                            }
                            className="w-full my-5"
                        >
                            <TabsList className="w-full grid grid-cols-3" variant={"line"}>
                                <TabsTrigger value="all" className="w-full text-center">
                                    {t("all")}
                                </TabsTrigger>
                                <TabsTrigger value="approved" className="w-full text-center">
                                    {t("approved")}
                                </TabsTrigger>
                                <TabsTrigger value="published" className="w-full text-center">
                                    {t("published")}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all"></TabsContent>
                            <TabsContent value="approved" />
                            <TabsContent value="published" />
                        </Tabs>

                        <NovelComponent
                            data={apiData?.novels ?? []}
                            total={total ?? 0}
                            totalPages={totalPages ?? 0}
                            page={page}
                            limit={limit}
                            onPaginationChange={handlePaginationChange}
                            isFetching={isLoading}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
