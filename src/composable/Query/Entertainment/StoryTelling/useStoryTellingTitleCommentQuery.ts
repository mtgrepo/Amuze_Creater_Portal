import { getStoryTellingTitleComment } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import { useQuery } from "@tanstack/react-query"

export const useStoryTellingTitleCommentQuery = (id: number, page: number, pageSize:number) => {
    const commentsList = useQuery({
        queryKey: ['storyTellingComments', id, page, pageSize],
        queryFn: async () => {
            const res = await getStoryTellingTitleComment(id, page, pageSize);
            return res?.data 
        }
    })
    return {
        storyTellingCommentLists: commentsList?.data,
        isStoryTellingCommentLoading: commentsList?.isLoading
    }
}