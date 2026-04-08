import { createStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStoryTellingTitleCreateCommand = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createStoryTellingTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      toast.success("Added new storytelling title successfully");
      router.navigate("/entertainment/storytelling")
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
