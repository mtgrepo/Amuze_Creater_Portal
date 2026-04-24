import { useQuery } from "@tanstack/react-query";
import { getPurchaseReport, type PruchaseReportParams } from "../../../http/apis/report/purchaseReportApi";

export const usePurchaseReportQuery = (params: PruchaseReportParams) => {
    const purchaseReportData = useQuery({
        queryKey: ['purchaseReportData', params?.authorId],
        queryFn: async () => {
            const res = await getPurchaseReport(params);
            return res?.data;
        },
        enabled: !!params?.authorId
    })
    return {
        purchaseReportData: purchaseReportData?.data,
        isLoading: purchaseReportData?.isLoading
    }
}