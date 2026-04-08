import { deleteComment } from "@/http/apis/comment/commentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useCommentDelCommand = () => {
    const qc = useQueryClient();

    const deleteCommentMutation = useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async ({ category, commentId }: { 
            category: string, 
            commentId: number,
        }) => {
            const res = await deleteComment(category, commentId);
            return { res: res?.data, category };
        },
        onSuccess: (_data, variables) => {
            // Invalidate the specific list using the dynamic key pattern
            qc.invalidateQueries({ 
                queryKey: [variables.category, 'comments'] 
            });
            
            toast.success("Comment deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    return {
        deleteCommentMutation: deleteCommentMutation.mutateAsync,
        isPending: deleteCommentMutation.isPending
    };
};