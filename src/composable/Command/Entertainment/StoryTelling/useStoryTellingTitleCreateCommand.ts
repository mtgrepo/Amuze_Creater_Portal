import { createStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useStoryTellingTitleCreateCommand = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createStoryTellingTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      toast.success("Added new storytelling title successfully");
      navigate(-1)
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create new title");
    }
  });

  return {
    createTitleMutation: titleMutation.mutateAsync,
    isStoryCreatePending: titleMutation?.isPending,
  };
};
