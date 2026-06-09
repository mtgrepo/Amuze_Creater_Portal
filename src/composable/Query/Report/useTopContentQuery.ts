import { getTopContent } from "@/http/apis/report/authorReport"
import { useQuery } from "@tanstack/react-query"

export const useTopContentQuery = (params: {authorId: number, type: string}) => {
    const topContentList = useQuery({
        queryKey: ['top-contents', params],
        queryFn: async () => {
            const result = await getTopContent({authorId: params?.authorId, type: params?.type});
            console.log("Top content in query", result?.data);
            return result?.data;
        },
        enabled: !!params
    })
    return {
        topContentList: topContentList?.data,
        isLoading: topContentList?.isLoading,
        isError: topContentList?.isError
    }
}