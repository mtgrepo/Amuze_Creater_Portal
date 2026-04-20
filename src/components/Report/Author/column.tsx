import type { ColumnDef } from "@tanstack/react-table";
import type { AuthorReportResponseDetails } from "../../../types/response/report/authorReportResponse";
import { useTranslation } from "react-i18next";


export default function AuthorReportColumn() {
    const { t } = useTranslation();

  const columns: ColumnDef<AuthorReportResponseDetails>[] = [
    {
        header: t('no'),
        cell: ({ row, table }) => {
            const pageIndex = table.getState()?.pagination?.pageIndex || 0;
            const pageSize = table.getState()?.pagination?.pageSize || 10;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
    },
    {
        // Matches API: "catetoryName"
        accessorKey: "catetoryName",
        header: t('category'),
        cell: ({ row }) => <div>{row.getValue("catetoryName") || "-"}</div>,
    },
    {
        accessorKey: "buyerName",
        header: t('buyer'),
        cell: ({ row }) => <div>{row.getValue("buyerName")}</div>,
    },
    {
        id: "productDetails",
        header: t('product_details'),
        cell: ({ row }) => {
            // Matches API: "productDetail" (singular)
            const product = row.original.productDetail;
            if (!product) return "-";
            return (
                <div className="max-w-75 whitespace-normal warp-break-word">
                    <span className="font-medium text-foreground">
                        {product.productTitleName}
                    </span>
                    {product.productSeasonName && (
                        <span className="text-muted-foreground text-xs block">
                            {product.productSeasonName} - {product.productEpisodeName}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "authorIncome",
        header: t('income'),
        cell: ({ row }) => {
            const income = row.getValue("authorIncome") as number;
            return <div>{income?.toLocaleString() ?? "0"}</div>;
        },
    },
    {
        accessorKey: "purchaseDate",
        header: t('date'),
        cell: ({ row }) => {
            const val = row.getValue("purchaseDate") as string;
            return <div>{val || "-"}</div>;
        },
    },
];
return columns
}
