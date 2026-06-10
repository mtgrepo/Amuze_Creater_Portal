import StatsReportCard from "@/components/common/stats_report_card";
import { ChartLineMultiple } from "@/components/Report/Author/chart_bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableParams } from "@/hooks/use-table-params";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import { useMemo, useState } from "react";
import { decryptAuthData } from "@/lib/helper";
import TopContent from "./top_content";
import { TotalEarningComponent } from "./Earning/total_earning_component";
import { TotalFollowersComponent } from "./Followers/total_followers_component";

export default function NewAuthorReport() {
  const {
    page,
    limit,
    updateParams,
    handlePaginationChange,
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

  const [activeTab, setActiveTab] = useState("earning");


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
          value={activeTab}
          onValueChange={setActiveTab}
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
          <TabsContent key={"earning"} value={"earning"}>
            <TotalEarningComponent
              authorId={authorId!}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onPaginationChange={handlePaginationChange}
              page={page}
              limit={limit}
            />
          </TabsContent>
          <TabsContent key={"followers"} value="followers">
            <TotalFollowersComponent
              authorId={authorId!}
              page={page}
              limit={limit}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onPaginationChange={handlePaginationChange}
            />
          </TabsContent>
          <TabsContent key={"content"} value="content">
            <TopContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
