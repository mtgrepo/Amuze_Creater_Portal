import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus, FileUp } from "lucide-react";
import { useComicsTitleExportCommand } from "@/composable/Command/Entertainment/Comics/useComicExcelCommand";
import { Input } from "../../../components/ui/input";
import { useNovelQuery } from "../../../composable/Query/Entertainment/Novel/useNovelQuery";
import { NovelComponent } from "../../../components/Entertainment/Novel/novel_component";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Novel() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
  const [search, setSearch] = React.useState("");
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const [debouncedSearch] = useDebounce(search, 700);

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


  const { novelData: apiData, totalPages, total, isLoading } = useNovelQuery({
    authorId: creatorId!,
    page,
    pageSize: limit,
    name: debouncedSearch,
    ...queryParams,
  })

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab]);

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

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
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleExcelExport}
              disabled={isLoadingExcel}
            >
              <FileUp className="h-4 w-4" />
             {t("export_data")}
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
