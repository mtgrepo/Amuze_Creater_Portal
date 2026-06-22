import { getWeeklyTopContents } from "@/http/apis/report/weeklyTopApi"
import { useQuery } from "@tanstack/react-query"

export const useWeeklyTopContentQuery = () => {
    const weeklyTopContents = useQuery({
        queryKey: ['weekly-top-content'],
        queryFn: async () => {
            const result = await getWeeklyTopContents();
            return result?.data;
        }
    })
    return {
        weeklyTopContents: weeklyTopContents?.data,
        isLoading: weeklyTopContents?.isLoading
    }
}