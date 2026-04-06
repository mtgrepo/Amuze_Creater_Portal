import { createStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
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
      toast.success(`Added new storytelling title successfully`);
    },
  });

  return {
    createTitleMutation: titleMutation.mutateAsync,
    isStoryCreatePending: titleMutation?.isPending,
  };
};
