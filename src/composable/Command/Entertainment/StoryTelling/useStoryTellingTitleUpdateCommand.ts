import { updateStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import type { UpdateStoryTitlePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useStoryTellingTitleUpdateCommand = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const titleMutation = useMutation({
    mutationKey : ["storyTellingTitleList"],
    mutationFn: async ({id, data} : {id: number, data: UpdateStoryTitlePayload}) => {
      await updateStoryTellingTitle(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      navigate(-1)
    },
  });

  return {
    updateTitleMutation: titleMutation.mutateAsync,
    isStoryTitleUpdatePending: titleMutation?.isPending,
  };
};
