import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment } from "../../../../http/apis/entertainment/comics/comicsCommentApi"
import { toast } from "sonner";

export const useComicsCommentDelCommand = () => {
    const qc = useQueryClient();
    const deleteCommentMutation = useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async (commentId: number) => {
            const res = await deleteComment(commentId)
            return res?.data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["titleComments"] })
            toast.success("Comment deleted successfully")
        }
    })
    return {
        deleteCommentMutation: deleteCommentMutation.mutateAsync,
        isPending: deleteCommentMutation?.isPending
    }
}