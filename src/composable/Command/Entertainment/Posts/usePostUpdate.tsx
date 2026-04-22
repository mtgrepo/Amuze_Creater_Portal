import { updatePost } from "@/http/apis/entertainment/posts/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePostUpdate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const updateMutation = useMutation({
    mutationFn: async ({id, data} : {id: number, data: FormData}) => {
      await updatePost(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      toast.success("Updated post successfully");
      navigate("/entertainment/posts")
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to update post");
    }
  });

  return {
    updateMutation: updateMutation.mutateAsync,
    isUpdatePending: updateMutation?.isPending,
  };
};
