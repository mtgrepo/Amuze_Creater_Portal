import { updatePost } from "@/http/apis/entertainment/posts/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostUpdate = () => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async ({id, data} : {id: number, data: FormData}) => {
      await updatePost(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      queryClient.invalidateQueries({ queryKey: ["postDetail"] });
      toast.success("Updated post successfully");
    },
    // onError: (error:any) => {
    //   toast.error(error?.response?.data?.message || "Failed to update post");
    // }
  });

  return {
    updateMutation: updateMutation.mutateAsync,
    isUpdatePending: updateMutation?.isPending,
  };
};
