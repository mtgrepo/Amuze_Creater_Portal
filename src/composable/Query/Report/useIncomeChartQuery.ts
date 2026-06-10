import { getIncomeChartData } from "@/http/apis/report/incomeChartApi"
import { useQuery } from "@tanstack/react-query"

export const useIncomeChartQuery = () => {
    const incomeChartData = useQuery({
        queryKey: ['income-chart-data'],
        queryFn: async () => {
            const result = await getIncomeChartData();
            return result?.data;
        }
    })
    return {
        incomeChartData: incomeChartData?.data,
        isLoading: incomeChartData?.isLoading
    }
}