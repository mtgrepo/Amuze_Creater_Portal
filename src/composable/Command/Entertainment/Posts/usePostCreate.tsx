import { createPost } from "@/http/apis/entertainment/posts/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePostCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      toast.success("Created post successfully");
      navigate("/entertainment/posts")
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create new post");
    }
  });

  return {
    createMutation: createMutation.mutateAsync,
    isCreatePending: createMutation?.isPending,
  };
};
