import { getAllComments } from "@/http/apis/comment/commentApi";
import { useQuery } from "@tanstack/react-query"

export const useCommentQuery = (category: string ,id: number) => {
    const commentsList = useQuery({
        queryKey: [category,'comments', id],
        queryFn: async () => {
            const res = await getAllComments(category,id);
            return res?.data 
        }
    })
    return {
        commentsList: commentsList?.data,
        isLoading: commentsList?.isLoading
    }
}