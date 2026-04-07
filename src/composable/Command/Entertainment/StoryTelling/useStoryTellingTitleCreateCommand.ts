import { createStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStoryTellingTitleCreateCommand = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createStoryTellingTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      router.navigate("/entertainment/storytelling")
    },
  });

  return {
    createTitleMutation: titleMutation.mutateAsync,
    isStoryCreatePending: titleMutation?.isPending,
  };
};
