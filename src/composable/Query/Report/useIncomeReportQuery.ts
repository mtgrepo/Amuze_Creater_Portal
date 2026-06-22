import { getIncomeReport } from "@/http/apis/report/authorReportApi";
import { useQuery } from "@tanstack/react-query";

export const useIncomeReportQuery = (params: {
  authorId: number;
  page: number;
  limit: number;
}) => {
  const incomeReports = useQuery({
    queryKey: ["total-income-report", params],
    queryFn: async () => {
      const result = await getIncomeReport(params);
      console.log("income report in query", result);
      return result?.data;
    },
    enabled: !!params,
  });
  return {
    incomeReports: incomeReports?.data,
    isLoading: incomeReports?.isLoading,
    isError: incomeReports?.isError,
  };
};
