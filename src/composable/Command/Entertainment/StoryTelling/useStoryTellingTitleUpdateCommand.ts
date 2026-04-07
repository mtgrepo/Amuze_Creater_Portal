import { updateStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import router from "@/router/routes";
import type { UpdateStoryTitlePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStoryTellingTitleUpdateCommand = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationKey : ["storyTellingTitle"],
    mutationFn: async ({id, data} : {id: number, data: UpdateStoryTitlePayload}) => {
      await updateStoryTellingTitle(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      router.navigate('/entertainment/storytelling')
    },
  });

  return {
    updateTitleMutation: titleMutation.mutateAsync,
    isStoryTitleUpdatePending: titleMutation?.isPending,
  };
};
