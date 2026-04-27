import { useMemo, useState } from "react";
import { CalendarIcon, Wallet, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { decryptAuthData } from "../../lib/helper";
import { usePurchaseReportQuery } from "../../composable/Query/Report/usePurchaseReportQuery";
import { PurchaseReportComponent } from "@/components/Report/Purchase/purchase_report_component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReportFilters } from "../../types/response/report/authorReportResponse";
import type { PurchaseRow } from "@/components/Report/Purchase/column";
import ReportCard from "../../components/common/report_card";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "../../lib/utils";

type CategoryName = "Novel" | "Comics" | "Storytelling" | "Magazine";

const CATEGORIES: { id: number; name: CategoryName }[] = [
  { id: 1, name: "Novel" },
  { id: 2, name: "Comics" },
  { id: 3, name: "Storytelling" },
  { id: 4, name: "Magazine" },
];

export default function PurchaseReport() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<CategoryName>("Novel");
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


  const getSafeDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const d = parseISO(dateStr);
    return isValid(d) ? d : undefined;
  };

  const subCategoryId = CATEGORIES.find((cat) => cat.name === activeTab)?.id || 1;
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const endDate =
    filters?.endDate || formatDate(new Date());

  const { purchaseReportData, isLoading: isFetching } = usePurchaseReportQuery({
    page: 1,
    pageSize: 10,
    authorId: authorId!,
    startDate: filters.startDate,
    endDate: endDate,
    subCategoryId,
    userId: "All",
    purchaseBy: "All",
  });

  const tableData: PurchaseRow[] = purchaseReportData?.finalResult ?? [];

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const currentDay = new Date().toLocaleDateString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header / Summary Card */}
      <div className="border border-dashed rounded-xl p-6 bg-card/50 hover:border-primary/50 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
          <Wallet className="text-primary" />
          <h1 className="font-bold text-lg text-foreground tracking-wider">
            {"Purchased Report Summary"}
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {" "}
          <ReportCard
            title={"Filter Price"}
            value={purchaseReportData?.filterPrice?.toLocaleString()}
            accent=""
            sub={currentDay}
          />
          <ReportCard
            title={"Filter Wallet"}
            value={purchaseReportData?.filterWallet?.toLocaleString()}
            sub={currentDay}
            accent=""
          />
          <ReportCard
            title={"Filter Bonus"}
            value={purchaseReportData?.filterBonus?.toLocaleString()}
            sub={currentDay}
            accent=""
          />
        </div>
      </div>

      {/* Date Range Section */}
      <div className="rounded-xl border-2 p-6 bg-card shadow-sm flex flex-col gap-8">
        <div className="flex flex-row justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase  mb-4">{t('date_range')}</p>
          {(filters.startDate || filters.endDate) && (
            <Button variant={'destructive'} size={'sm'} className="cursor-pointer" onClick={() => handleFiltersChange({ startDate: "", endDate: "" })}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">{t('start_date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start border-2  rounded-lg", !filters.startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(getSafeDate(filters.startDate)!, "PPP") : "Select start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={getSafeDate(filters.startDate)}
                  onSelect={(d) => handleFiltersChange({ startDate: d ? format(d, "yyyy-MM-dd") : "" })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">{t('end_date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start border-2  rounded-lg", !filters.endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(getSafeDate(filters.endDate)!, "PPP") : "Select end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={getSafeDate(filters.endDate)}
                  onSelect={(d) => handleFiltersChange({ endDate: d ? format(d, "yyyy-MM-dd") : "" })}
                  disabled={filters.startDate ? { before: getSafeDate(filters.startDate)! } : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="border border-border p-3 rounded-lg my-3">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as CategoryName)}
          className="w-full my-5"
        >
          <TabsList className="w-full grid grid-cols-4" variant="line">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.name} className="w-full text-center">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Render content based on active tab */}
          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.id} value={cat.name}>
              <PurchaseReportComponent
                data={tableData}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isFetching={isFetching}
                total={tableData.length}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}