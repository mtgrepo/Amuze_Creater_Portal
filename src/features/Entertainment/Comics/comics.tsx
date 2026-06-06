import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { ComicsTitleComponents } from "@/components/Entertainment/Comics/Title/comics_title";
import { useComicsTitleQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleQuery";
import { decryptAuthData } from "@/lib/helper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus, FileUp } from "lucide-react";
import { useComicsTitleExportCommand } from "@/composable/Command/Entertainment/Comics/useComicExcelCommand";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../components/common/search_box";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import DateFilter from "@/components/common/date_filter";

export default function Comics() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tab, setTab] = React.useState<
    "all" | "pending" | "approved" | "published"
  >("all");
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Safe Extraction of Creator Data
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

  // Reset page when tab changes
  React.useEffect(() => {
    setPage(1);
  }, [tab]);

  // Reset page when search term changes
  React.useEffect(() => {
    setPage(1);
  }, [debounceSearch]);

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
    startDate: filters.startDate,
    endDate: filters.endDate,
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

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1); 
  };

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full">
          {/* <div className="flex flex-col w-full">
            <div className="rounded-xl w-full border-2 p-6 bg-background shadow-sm ">

                <p className="text-xs font-bold text-muted-foreground uppercase mb-4">
                  Search Filters
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">
                      {t("start_date")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-2 rounded-lg",
                            !filters.startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate
                            ? format(getSafeDate(filters.startDate)!, "PPP")
                            : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={getSafeDate(filters.startDate)}
                          onSelect={(d) =>
                            handleFiltersChange({
                              startDate: d ? format(d, "yyyy-MM-dd") : "",
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">
                      {t("end_date")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-2 rounded-lg",
                            !filters.endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.endDate
                            ? format(getSafeDate(filters.endDate)!, "PPP")
                            : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={getSafeDate(filters.endDate)}
                          onSelect={(d) =>
                            handleFiltersChange({
                              endDate: d ? format(d, "yyyy-MM-dd") : "",
                            })
                          }
                          disabled={
                            filters.startDate
                              ? { before: getSafeDate(filters.startDate)! }
                              : undefined
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="relative">
                    <SearchBox search={search} setSearch={setSearch} />
                  </div>
              </div>

            </div>

            <div className="flex flex-col justify-end sm:flex-row gap-2 w-full sm:w-auto my-4">
              
              <Button
                size="sm"
                className="cursor-pointer h-8 w-full sm:w-auto justify-center"
                onClick={() => navigate("/entertainment/comics/title")}
              >
                <CirclePlus className="w-4 h-4 mr-2 shrink-0" />
                <span>{t("create_new_comic")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer w-full sm:w-auto justify-center"
                onClick={handleExcelExport}
                disabled={isLoadingExcel}
              >
                <FileUp className="h-4 w-4 mr-2 shrink-0" />
                <span>{t("export_data")}</span>
              </Button>
            </div>
          </div> */}
          <div className="flex flex-col gap-1 mb-8 pb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Comics Management
            </h1>
            <p className="text-sm text-muted-foreground">
              comics_description, Manage your published comics, and create new
              releases.
            </p>
          </div>
          {/* Filters */}
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
                  <SearchBox search={search} setSearch={setSearch} />
                </div>
              </div>
            </div>

            {/* Action Buttons Container */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full lg:w-auto lg:justify-end">
              <Button
                size="sm"
                className="cursor-pointer w-full sm:w-auto justify-center"
                onClick={() => navigate("/entertainment/comics/title")}
              >
                <CirclePlus className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{t("create_new_comic")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer w-full sm:w-auto justify-center"
                onClick={handleExcelExport}
                disabled={isLoadingExcel}
              >
                <FileUp className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">{t("export_data")}</span>
              </Button>
            </div>
          </div>

          <div className="border border-border p-3 rounded-lg my-3">
            <Tabs
              value={tab}
              onValueChange={(val) =>
                setTab(val as "all" | "pending" | "approved" | "published")
              }
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
