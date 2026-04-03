import { useQuery } from "@tanstack/react-query"
import { getNovelById } from "../../../../http/apis/entertainment/novel/novelApi";

export const useNovelDetailsQuery = (novelId: number) => {
    const novelDetails = useQuery({
        queryKey: ["novel-details", novelId],
        queryFn: async () => {
            const response = await getNovelById(novelId);
            return response.data;
        },
        enabled: !!novelId, // Only run the query if novelId is truthy
    })
    return {
        novelDetails: novelDetails?.data,
        isNovelDetailsLoading: novelDetails?.isLoading,
        novelDetailsError: novelDetails?.error,
    }
}