import { deletePostMedia } from "@/http/apis/entertainment/posts/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostMediaDelete = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async ({id, indexId} : {id: number, indexId: number}) => {
      await deletePostMedia(id, indexId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      queryClient.invalidateQueries({ queryKey: ["postDetail"] });
    },
    // onError: (error:any) => {
    //   toast.error(error?.response?.data?.message || "Failed to delete post media");
    // }
  });

  return {
    deleteMediaMutation: deleteMutation.mutateAsync,
    isMediaDeletePending: deleteMutation?.isPending,
  };
};
