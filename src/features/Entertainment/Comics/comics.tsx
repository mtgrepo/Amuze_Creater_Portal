import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { ComicsTitleComponents } from "@/components/Entertainment/Comics/Title/comics_title";
import { useComicsTitleQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus, FileUp } from "lucide-react";
import router from "@/router/routes";
import { useComicsTitleExportCommand } from "@/composable/Command/Entertainment/Comics/useComicExcelCommand";

export default function Comics() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;

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
    ...queryParams,
  });

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

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5 ">
          <div className="flex flex-row justify-end gap-3">
            <Button
              size={"sm"}
              onClick={() => router.navigate("/entertainment/comics/title")}
            >
              <CirclePlus className="w-4 h-4" />
              Add New Title
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleExcelExport}
              disabled={isLoadingExcel}
            >
              <FileUp className="h-4 w-4" />
              Export Data
            </Button>
          </div>
          <Tabs
            value={tab}
            onValueChange={(val) =>
              setTab(val as "all" | "approved" | "published")
            }
            className="w-full my-5"
          >
            <TabsList className="w-full grid grid-cols-3" variant={"line"}>
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

          <ComicsTitleComponents
            data={apiData ?? []}
            total={total ?? 0}
            totalPages={totalPages ?? 0}
            page={page}
            limit={limit}
            onPaginationChange={handlePaginationChange}
            isFetching={isLoading}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
