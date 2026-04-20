import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus, FileUp } from "lucide-react";
import { useComicsTitleExportCommand } from "@/composable/Command/Entertainment/Comics/useComicExcelCommand";
import { Input } from "../../../../components/ui/input";
import { useMuzeBoxQuery } from "@/composable/Query/Entertainment/MuzeBox/Title/useMuzeBoxQuery";
import { MuzeBoxComponents } from "@/components/Entertainment/MuzeBox/Title/muzeBox_component";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

export default function MuzeBox() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const navigate = useNavigate();
 
  const [text, setText] = React.useState("");
  const [debounceText] = useDebounce(text, 700);

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

  const { muzeBoxList: apiData, isLoading } = useMuzeBoxQuery({
    authorId: creatorId!,
    page,
    pageSize: limit,
    name: debounceText,
    ...queryParams,
  });
  React.useEffect(() => {
    setPage(1);
  }, [debounceText, tab]);

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
            <Input
              placeholder="Filter name..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="max-w-sm"
            />
            <Button
              size={"sm"}
              className="cursor-pointer"
              onClick={() =>
                navigate("/entertainment/muze-Box/title/create")
              }
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

            <MuzeBoxComponents
              data={apiData?.series ?? []}
              total={apiData?.total ?? 0}
              totalPages={apiData?.totalPage ?? 0}
              page={page}
              limit={limit}
              onPaginationChange={handlePaginationChange}
              isFetching={isLoading}
              search={text}
              onSearchChange={setText}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
