import React from "react";
import { Button } from "@/components/ui/button";
import { decryptAuthData } from "@/lib/helper";
import { CirclePlus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useMuseumQuery } from "@/composable/Query/Entertainment/Museum/useMuseumQuery";
import { MuseumTable } from "@/components/Entertainment/Museum/Museum/museum_table";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MuseumLayout() {
  const [tab, setTab] = React.useState<"all" | "approved">("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const queryParams = tab === "approved" ? { approve_status: 1 } : {};

  const { museumList, isMuseumPending, total, totalPage } = useMuseumQuery(
    creatorId!,
    { page, pageSize, name: search, ...queryParams },
  );

  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <div className="w-full mt-5">
        <div className="flex flex-row justify-end gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Filter title name..."
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(e.currentTarget.value);
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
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => navigate("/entertainment/museum/create")}
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            {t('museum.create')}
          </Button>
        </div>
      </div>

      <div className="border p-3 rounded-lg space-y-3">
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as "all" | "approved")}
          className="w-full my-5"
        >
          <TabsList
            className="w-full grid grid-cols-2 border-b"
            variant={"line"}
          >
            <TabsTrigger value="all" className="w-full text-center">
              {t("all")}
            </TabsTrigger>
            <TabsTrigger value="approved" className="w-full text-center">
              {t("approved")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all"></TabsContent>
          <TabsContent value="approved" />
        </Tabs>

        <MuseumTable
          data={museumList}
          total={total}
          totalPage={totalPage}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          isFetching={isMuseumPending}
        />
      </div>
    </div>
  );
}
