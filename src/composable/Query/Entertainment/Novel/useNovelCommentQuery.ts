import { getNovelComments } from "@/http/apis/entertainment/novel/novelApi";
import { useQuery } from "@tanstack/react-query"

export const useNovelCommentsQuery = (novelId: number) => {
    const commentsList = useQuery({
        queryKey: ['novelComments', novelId],
        queryFn: async () => {
            const res = await getNovelComments(novelId);
            return res?.data 
        },
        enabled: !!novelId
    })
    return {
        commentsList: commentsList?.data,
        isLoading: commentsList?.isLoading
    }
}