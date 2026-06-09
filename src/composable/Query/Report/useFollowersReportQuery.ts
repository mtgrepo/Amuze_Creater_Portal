import { getTotalFollowers } from "@/http/apis/report/authorReport"
import { useQuery } from "@tanstack/react-query"

export const useFollowersReportQuery = (params: { authorId: number, page: number, limit: number}) => {
    const followersList = useQuery({
        queryKey: ['followers-list', params],
        queryFn: async () => {
            const result = await getTotalFollowers(params);
            console.log("Followers list in query", result?.data)
            return result?.data
        },
        enabled: !!params
    })
    return {
        followersList: followersList?.data,
        isLoading: followersList?.isLoading,
        isError: followersList?.isError
    }
}