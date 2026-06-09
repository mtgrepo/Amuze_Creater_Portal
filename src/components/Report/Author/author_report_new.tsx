import StatsReportCard from "@/components/common/stats_report_card";
import { ChartLineMultiple } from "@/components/Report/Author/chart_bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableParams } from "@/hooks/use-table-params";
import { usePurchaseReportQuery } from "@/composable/Query/Report/usePurchaseReportQuery";
import type { PurchaseRow } from "../Purchase/column";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import { useMemo, useState } from "react";
import { decryptAuthData } from "@/lib/helper";
import TopContent from "./top_content";
import { TotalEarningComponent } from "./Earning/total_earning_component";
import { TotalFollowersComponent } from "./Followers/total_followers_component";

type CategoryName = "Novel" | "Comics" | "Storytelling" | "Magazine";

const CATEGORIES: { id: number; name: CategoryName }[] = [
  { id: 1, name: "Novel" },
  { id: 2, name: "Comics" },
  { id: 3, name: "Storytelling" },
  { id: 4, name: "Magazine" },
];

export default function NewAuthorReport() {
  const {
    page,
    limit,
    tab,
    updateParams,
    handlePaginationChange,
    handleTabChange,
  } = useTableParams({ page: 1, limit: 5, tab: "earning" });
  const [filters, setFilters] = useState<ReportFilters>({
    category: "All",
    startDate: "",
    endDate: "",
  });

  const authorId = useMemo(() => {
    const creatorData = localStorage.getItem("creator");
    if (!creatorData) return null;
    return decryptAuthData(creatorData)?.creator?.id;
  }, []);
  const subCategoryId = CATEGORIES.find((cat) => cat.name === tab)?.id || 1;
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const endDate = filters?.endDate || formatDate(new Date());

  const { purchaseReportData, isLoading: isFetching } = usePurchaseReportQuery({
    page: page,
    pageSize: limit,
    authorId: authorId!,
    startDate: filters.startDate,
    endDate: filters.endDate || endDate,
    subCategoryId,
    userId: "All",
    purchaseBy: "All",
  });

  const tableData: PurchaseRow[] = purchaseReportData?.finalResult ?? [];

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    updateParams({ page: 1 });
  };

  return (
    <div className="flex flex-1 flex-col gap-8 py-4 @container/main">
      {/*  STATS COUNT GRID */}
      <StatsReportCard />
      <ChartLineMultiple />
      <div className="bg-card border border-border p-3 rounded-lg">
        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className="w-full my-5"
        >
          <TabsList className="w-full grid grid-cols-3" variant={"line"}>
            <TabsTrigger value="earning" className="w-full text-center">
              Total Earning
            </TabsTrigger>
            <TabsTrigger value="followers" className="w-full text-center">
              Total Followers
            </TabsTrigger>
            <TabsTrigger value="content" className="w-full text-center">
              Top Content
            </TabsTrigger>
          </TabsList>
            <TabsContent key={'earning'} value={'earning'}>
              <TotalEarningComponent
                data={tableData}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onPaginationChange={handlePaginationChange}
                page={page}
                limit={limit}
                isFetching={isFetching}
                total={purchaseReportData?.total ?? 0}
              />
            </TabsContent>
            <TabsContent key={'followers'} value="followers">
                <TotalFollowersComponent 
                    data={tableData}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onPaginationChange={handlePaginationChange}
                    page={page}
                    limit={limit}
                    isFetching={isFetching}
                    total={purchaseReportData?.total ?? 0}
                />
            </TabsContent>
            <TabsContent key={'content'} value="content">
                <TopContent />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
