import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { PostTable } from "@/components/Entertainment/Post/post_table";
import { usePostQuery } from "@/composable/Query/Entertainment/Posts/usePostQuery";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../components/common/search_box";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import DateFilter from "@/components/common/date_filter";
import { useTableParams } from "@/hooks/use-table-params";
import { useNavigate } from "react-router-dom";

export default function PostLayout() {
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
  } = useTableParams({ page: 1, limit: 10, tab: "all" });

  // Safe Creator Data
  const creatorId = React.useMemo(() => {
    const rawCreator = localStorage.getItem("creator");
    if (!rawCreator) return null;
    const loginCreator = decryptAuthData(rawCreator);
    return loginCreator?.creator?.id ?? null;
  }, []);

  const [debounceSearch] = useDebounce(search, 700);

  const [filters, setFilters] = React.useState<ReportFilters>({
    startDate: "",
    endDate: "",
  });

  const is_banned = React.useMemo(() => tab === "banned", [tab]);

  // Fetch data from backend with filter params
  const { 
    postList, 
    isPostPending, 
    total, 
    totalPage 
  } = usePostQuery(creatorId!, {
    page,
    pageSize: limit,
    name: debounceSearch, 
    is_banned,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    updateParams({ page: 1 });
  };

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full">
          {/* Header Description Section */}
          <div className="flex flex-col gap-1 mb-8 pb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Post Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your content, check status, and create new posts.
            </p>
          </div>

          {/* Filters Layout */}
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
                size="sm"
                className="cursor-pointer w-full sm:w-auto justify-center"
                onClick={() => navigate("/entertainment/posts/create", {
                  state: { fromSearch: window.location.search },
                })}
              >
                <CirclePlus className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{t("post.create")}</span>
              </Button>
            </div>
          </div>

          {/* Table and Tabs Area */}
          <div className="border border-border p-3 rounded-lg my-3">
            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="w-full my-5"
            >
              <TabsList className="w-full grid grid-cols-2" variant={"line"}>
                <TabsTrigger value="all" className="w-full text-center">
                  {t("active_status")}
                </TabsTrigger>
                <TabsTrigger value="banned" className="w-full text-center">
                  {t("banned_status")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <PostTable
              data={postList ?? []}
              total={total ?? 0}
              totalPage={totalPage ?? 0}
              page={page}
              pageSize={limit}
              onPaginationChange={handlePaginationChange}
              isFetching={isPostPending}
              is_banned={is_banned}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}