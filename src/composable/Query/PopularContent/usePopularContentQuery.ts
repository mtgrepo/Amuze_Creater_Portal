import { getPopularByCategory } from "@/http/apis/popularContent/popularContentApi"
import { useQuery } from "@tanstack/react-query"

export const usePopularContentQuery = (category: string) => {
    const popularContents = useQuery({
        queryKey: ['popular-content', category],
        queryFn: async () => {
            const result = await getPopularByCategory(category);
            return result?.data
        }
    })
    return {
        popularContents: popularContents?.data,
        isLoading: popularContents?.isLoading,
        isError: popularContents?.isError
    }
}