import { useQuery } from "@tanstack/react-query"
import { getAuthorReport } from "../../../http/apis/report/authorReport"
import type { AuthorReportResponse } from "../../../types/response/report/authorReportResponse"

export const useAuthorReportQuery = (params: {authorId: number, startDate: string, endDate: string}) => {
    const authorReportList = useQuery<AuthorReportResponse>({
        queryKey: ["authorReport", params],
        queryFn: async () => {
            const res = await getAuthorReport(params)
            // console.log("report in query", res?.data?.reports)
            return res;
        },
        enabled: !!params.authorId, 
    })
    return {
        authorReportList: authorReportList.data,
        isLoading: authorReportList.isLoading,
        isError: authorReportList.isError,
    }
    
}