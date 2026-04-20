import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { ComicsTitleComponents } from "@/components/Entertainment/Comics/Title/comics_title";
import { useComicsTitleQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus, FileUp } from "lucide-react";
import { useComicsTitleExportCommand } from "@/composable/Command/Entertainment/Comics/useComicExcelCommand";
import { Input } from "../../../components/ui/input";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Comics() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
  const [search, setSearch] = React.useState("");
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const [debounceSearch] = useDebounce(search, 700);
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Determine filter params based on active tab
  const queryParams = React.useMemo(() => {
    switch (tab) {
      case "approved":
        return { approve_status: 1 };
      case "published":
        return { is_published: true };
      default:
        return {};
    }
  }, [tab]);

  // Reset page when tab changes
  React.useEffect(() => {
    setPage(1);
  }, [tab]);

  // Fetch data from backend with filter params
  const {
    comicsTitleList: apiData,
    isLoading,
    totalPages,
    total,
  } = useComicsTitleQuery(creatorId!, {
    page,
    pageSize: limit,
    name: debounceSearch,
    ...queryParams,
  });

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };
  React.useEffect(() => {
    setPage(1);
  }, [debounceSearch]);

  const { excelTitleMutation: exportExcel, isPending: isLoadingExcel } =
    useComicsTitleExportCommand();

  const handleExcelExport = async () => {
    try {
      const blob = await exportExcel();

      if (!blob) return;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "comics_titles.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

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
              onClick={() => navigate("/entertainment/comics/title")}
            >
              <CirclePlus className="w-4 h-4" />
              {t("add_new")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleExcelExport}
              disabled={isLoadingExcel}
            >
              <FileUp className="h-4 w-4" />
              {t('export_data')}
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

            <ComicsTitleComponents
              data={apiData ?? []}
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
