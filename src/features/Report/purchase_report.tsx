import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

// Hooks & Helpers
import { decryptAuthData } from "../../lib/helper";
import { usePurchaseReportQuery } from "../../composable/Query/Report/usePurchaseReportQuery";

// Components
import { PurchaseReportComponent } from "@/components/Report/Purchase/purchase_report_component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
import type { ReportFilters } from "../../types/response/report/authorReportResponse";
import type { PurchaseRow } from "@/components/Report/Purchase/column";

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

  const subCategoryId = CATEGORIES.find((cat) => cat.name === activeTab)?.id || 1;

  const { purchaseReportData, isLoading: isFetching } = usePurchaseReportQuery({
    page: 1,
    pageSize: 10,
    authorId: authorId!,
    startDate: filters.startDate,
    endDate: filters.endDate,
    subCategoryId,
    userId: "All",
    purchaseBy: "All",
  });

  const tableData = useMemo<PurchaseRow[]>(() => {
    return (purchaseReportData?.finalResult as PurchaseRow[]) || [];
  }, [purchaseReportData]);

  const handleFiltersChange = (updates: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header / Summary Card */}
      <div className="border border-dashed rounded-xl p-6 bg-card/50 hover:border-primary/50 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
          <Wallet className="text-primary" />
          <h1 className="font-bold text-lg text-foreground tracking-wider">
            {t("income_summary")}
          </h1>
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