import { replyComment } from "@/http/apis/comment/commentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCommentStoreCommand = () => {
  const qc = useQueryClient();

  const storeMutation = useMutation({
    mutationKey: ["storeComment"],
    mutationFn: async ({
      category,
      id,
      parentId,
      comment,
    }: {
      category: string;
      id: number;
      parentId: number | null;
      comment: string;
    }) => {
      const res = await replyComment(category, id, parentId, comment);
      return res?.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: [variables.category, "comments", variables.id],
      });

      toast.success(variables.parentId ? "Reply added" : "Comment added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post comment");
    },
  });

  return {
    storeCommentMutation: storeMutation.mutateAsync,
    isPending: storeMutation.isPending,
  };
};
