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
import { useAuthorReportQuery } from "@/composable/Query/Report/useAuthorReportQuery";
import { ChartPieLegend } from "./chart_pie";

export default function NewAuthorReport() {
  const { page, limit, updateParams, handlePaginationChange } = useTableParams({
    page: 1,
    limit: 5,
    tab: "earning",
  });
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

  const { authorReportList, isLoading } = useAuthorReportQuery({
    authorId: authorId!,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });
  // Flatten Table Data
  const tableData = useMemo(() => {
    const reports = authorReportList?.data?.reports;
    if (!reports) return [];

    if (filters.category === "All") {
      return Object.values(reports).flat();
    }

    const selectedCategory = filters?.category?.toLowerCase();
    const categoryMapping: Record<string, string[]> = {
      magazine: ["magazine", "journal"],
      journal: ["journal", "magazine"],
      novel: ["novel"],
      gallery: ["gallery"],
    };

    const keysToCheck = categoryMapping[selectedCategory!] || [
      selectedCategory,
    ];
    const apiKeys = Object.keys(reports);

    for (const target of keysToCheck) {
      const foundKey = apiKeys.find((k) => k.toLowerCase() === target);
      if (foundKey && reports[foundKey].length > 0) {
        return reports[foundKey];
      }
    }
    return [];
  }, [authorReportList, filters.category]);

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    updateParams({ page: 1 });
  };

  return (
    <div className="flex flex-1 flex-col gap-8 py-4 @container/main">
      {/* STATS COUNT GRID */}
      <StatsReportCard />

      <div className="grid grid-cols-3 max-xl:grid-cols-1 gap-3 items-stretch min-h-100">
        <div className="flex flex-col h-full">
          <ChartPieLegend />
        </div>
        <div className="col-span-2 flex flex-col h-full">
          {" "}
          {/* Fixed typo: flex flex-col */}
          <ChartLineMultiple />
        </div>
      </div>

      <div className="bg-background border border-border shadow-xl p-3 rounded-lg">
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
              data={tableData}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isFetching={isLoading}
              total={tableData.length}
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
