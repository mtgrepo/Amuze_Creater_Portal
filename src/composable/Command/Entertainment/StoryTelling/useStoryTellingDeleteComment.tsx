import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { deleteComment } from "../../../../http/apis/comment/commentApi";

export const useStoryTellingCommentDelete = () => {
    const queryClient = useQueryClient();
    const deleteCommentMutation = useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async ({type, commentId} : {type: string, commentId: number}) => {
            const res = await deleteComment(type, commentId)
            return res?.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["titleComments"] })
            toast.success("Comment deleted successfully")
        }
    })
    return {
        deleteCommentMutation: deleteCommentMutation.mutateAsync,
        isCommentDeletePending: deleteCommentMutation?.isPending
    }
}