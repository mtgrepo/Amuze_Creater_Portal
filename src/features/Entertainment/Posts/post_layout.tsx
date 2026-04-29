import React from "react";
import { Button } from "@/components/ui/button";
import { decryptAuthData } from "@/lib/helper";
import { CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostQuery } from "@/composable/Query/Entertainment/Posts/usePostQuery";
import { PostTable } from "@/components/Entertainment/Post/post_table";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PostLayout() {
  const [tab, setTab] = React.useState<"all" | "banned">("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const is_banned = tab === "banned";

  const { postList, isPostPending, total, totalPage } = usePostQuery(
    creatorId!,
    { page, pageSize, is_banned },
  );

  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <div className="w-full mt-5">
        <div className="flex flex-row justify-end gap-3">
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => navigate("/entertainment/posts/create")}
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            {t("post.create")}
          </Button>
        </div>
      </div>

      <div className="border p-3 rounded-lg space-y-3">
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as "all" | "banned")}
          className="w-full my-5"
        >
          <TabsList
            className="w-full grid grid-cols-2 border-b"
            variant={"line"}
          >
            <TabsTrigger value="all" className="w-full text-center">
              {t("active_status")}
            </TabsTrigger>
            <TabsTrigger value="banned" className="w-full text-center">
              {t("banned_status")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all"></TabsContent>
          <TabsContent value="banned" />
        </Tabs>

        <PostTable
          data={postList}
          total={total}
          totalPage={totalPage}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          isFetching={isPostPending}
          is_banned={is_banned}
        />
      </div>
    </div>
  );
}
