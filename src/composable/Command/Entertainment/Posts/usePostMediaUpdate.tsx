import {updatePostMedia } from "@/http/apis/entertainment/posts/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostMediaUpdate = () => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async ({id, data} : {id: number, data: FormData}) => {
      await updatePostMedia(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      queryClient.invalidateQueries({ queryKey: ["postDetail"] });
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to update post media");
    }
  });

  return {
    updateMediaMutation: updateMutation.mutateAsync,
    isMediaUpdatePending: updateMutation?.isPending,
  };
};
