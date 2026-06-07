import * as React from "react";
import { useNavigate } from "react-router-dom";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useNovelQuery } from "../../../composable/Query/Entertainment/Novel/useNovelQuery";
import { NovelComponent } from "../../../components/Entertainment/Novel/novel_component";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../components/common/search_box";
import DateFilter from "@/components/common/date_filter";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import { useTableParams } from "@/hooks/use-table-params";

export default function Novel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    page,
    limit,
    tab,
    search,
    updateParams,
    handlePaginationChange,
    handleSearchChange,
    handleTabChange
  } = useTableParams({ page: 1, limit: 10, tab: "all" })

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const [debouncedSearch] = useDebounce(search, 700);

  const [filters, setFilters] = React.useState<ReportFilters>({
    startDate: "",
    endDate: "",
  });

  const queryParams = React.useMemo(() => {
    switch (tab) {
      case "pending":
        return { approve_status: 0 };
      case "approved":
        return { approve_status: 1 };
      case "published":
        return { is_published: true };
      default:
        return {};
    }
  }, [tab]);


  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    updateParams({ page: 1 });
  };

  const {
    novelData: apiData,
    totalPages,
    total,
    isLoading,
  } = useNovelQuery({
    authorId: creatorId!,
    page,
    pageSize: limit,
    name: debouncedSearch,
    ...queryParams,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <div className="w-full">
        <div className="flex flex-col gap-1 mb-8 pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Novel Management
          </h1>
          <p className="text-sm text-muted-foreground">
            novel, Manage your published novels, and create new releases.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-5 w-full mb-4">
          {/* Filters Container */}
          <div className="w-full lg:max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              {/* Start Date */}
              <DateFilter
                label={t("start_date")}
                placeholder="Select start date"
                value={filters.startDate}
                onChange={(val) => handleFiltersChange({ startDate: val })}
              />

              {/* End Date */}
              <DateFilter
                label={t("end_date")}
                placeholder="Select end date"
                value={filters.endDate}
                onChange={(val) => handleFiltersChange({ endDate: val })}
              />

              {/* Search Input */}
              <div className="relative w-full sm:col-span-2 md:col-span-1">
                <SearchBox search={search} setSearch={handleSearchChange} />
              </div>
            </div>
          </div>

          {/* Action Buttons Container */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full lg:w-auto lg:justify-end">
            <Button
              size={"sm"}
              className="cursor-pointer"
              onClick={() => navigate("/entertainment/novel/create")}
            >
              <CirclePlus className="w-4 h-4" />
              {t("create_new_novel")}
            </Button>
          </div>
        </div>

        <div className="border border-border p-3 rounded-lg my-3">
          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="w-full my-5"
          >
            <TabsList className="w-full grid grid-cols-4" variant={"line"}>
              <TabsTrigger value="all" className="w-full text-center">
                {t("all")}
              </TabsTrigger>
              <TabsTrigger value="pending" className="w-full text-center">
                {t("pending")}
              </TabsTrigger>
              <TabsTrigger value="approved" className="w-full text-center">
                {t("approved")}
              </TabsTrigger>
              <TabsTrigger value="published" className="w-full text-center">
                {t("published")}
              </TabsTrigger>
            </TabsList>
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
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
}