import { getAllComments } from "@/http/apis/entertainment/comics/comicsTitleApi"
import { useQuery } from "@tanstack/react-query"

export const useComicsTitleCommentQuery = (id: number) => {
    const commentsList = useQuery({
        queryKey: ['titleComments'],
        queryFn: async () => {
            const res = await getAllComments(id);
            // console.log("cmt in query", res);
            return res?.data 
        }
    })
    return {
        commentsList: commentsList?.data,
        isLoading: commentsList?.isLoading
    }
}