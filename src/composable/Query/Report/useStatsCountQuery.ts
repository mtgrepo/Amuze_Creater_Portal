import { getStatusCount } from "@/http/apis/report/authorReport"
import { useQuery } from "@tanstack/react-query"

export const useStatsCountQuery = (authorId: number) => {
    const statsCount = useQuery({
        queryKey: ['stats-count', authorId],
        queryFn: async () => {
            const result = await getStatusCount(authorId);
            console.log("Stats count in query", result?.data);
            return result?.data
        },
        enabled: !!authorId
    })
    return {
        statsCount: statsCount?.data,
        isLoading: statsCount?.isLoading
    }
}