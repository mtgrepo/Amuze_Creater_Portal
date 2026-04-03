import { useMutation, useQueryClient } from "@tanstack/react-query"
import { replyComment } from "../../../../http/apis/entertainment/comics/comicsCommentApi";
import { toast } from "sonner";

export const useComicStoreCommentCommand = () => {
    const qc = useQueryClient();

    const storeCommentMutation = useMutation({
        mutationKey: ["storeComment"],
        mutationFn: async ({ comicId, parentId, comment }: { comicId: number, parentId: number | null, comment: string }) => {
            const res = await replyComment(comicId, parentId!, comment);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["titleComments"] })
            toast.success("Comment added successfully")
        }
    })
    return {
        storeCommentMutation: storeCommentMutation.mutateAsync,
        isPending: storeCommentMutation?.isPending
    }
}