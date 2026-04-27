import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type {
  ComicPurchaseReportResponse,
  JournalPurchaseResponse,
  NovelPurchaseResponse,
  StoryTellingPurchaseResponse,
} from "../../../types/response/report/purchaseReportResponse";

export type PurchaseRow =  ComicPurchaseReportResponse | NovelPurchaseResponse | StoryTellingPurchaseResponse | JournalPurchaseResponse;

export default function PurchaseReportColumn() {
  const { t } = useTranslation();

  const columns: ColumnDef<PurchaseRow>[] = [
    {
      header: t("no"),
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination?.pageIndex || 0;
        const pageSize = table.getState().pagination?.pageSize || 10;

        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
    },

    {
      accessorKey: "titleName",
      header: t("title"),
      cell: ({ row }) => <div>{row.original.titleName}</div>,
    },
    {
      id: "productDetails",
      header: t("product_details"),
      cell: ({ row }) => {
        const data = row.original;

        const episodeName = "episodeName" in data ? data.episodeName : undefined;

        const magazineEpisodeName = "magazineEpisodeName" in data ? data.magazineEpisodeName : undefined;

        const magazineSeasonName = "magazineSeasonName" in data ? data.magazineSeasonName : undefined;

        return (
          <div className="max-w-75 whitespace-normal wrap-break-word">
            <div className="font-medium">{data.titleName}</div>

            {episodeName && (
              <div className="text-xs text-muted-foreground">
                Episode: {episodeName}
              </div>
            )}

            {magazineSeasonName && (
              <div className="text-xs text-muted-foreground">
                Season: {magazineSeasonName}
              </div>
            )}

            {magazineEpisodeName && (
              <div className="text-xs text-muted-foreground">
                Episode: {magazineEpisodeName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "buyerName",
      header: t("buyer"),
      cell: ({ row }) => <div>{row.original.buyerName}</div>,
    },
    {
      accessorKey: "price",
      header: t("price"),
      cell: ({ row }) => (
        <div>{row.original.price?.toLocaleString?.() ?? 0}</div>
      ),
    },
    {
      accessorKey: "buyingWithWallet",
      header: "Pay(Wallet)",
      cell: ({ row }) => (
        <div>{row.original.buyingWithWallet?.toLocaleString?.() ?? 0}</div>
      ),
    },
    {
      accessorKey: "buyingWithBonus",
      header: "Pay(Bonus)",
      cell: ({ row }) => (
        <div>{row.original.buyingWithBonus?.toLocaleString?.() ?? 0}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => <div>{row.original.created_at || "-"}</div>,
    },
  ];

  return columns;
}
