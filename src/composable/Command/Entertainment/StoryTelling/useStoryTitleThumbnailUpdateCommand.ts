import { updateStoryTellingTitle } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import router from "@/router/routes";
import type { UpdateStoryTitlePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStoryTellingTitleThumbnailUpdateCommand = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationFn: async ({id, data} : {id: number, data: UpdateStoryTitlePayload}) => {
      await updateStoryTellingTitle(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      toast.success(`Added new storytelling title successfully`);
      router.navigate('/entertainment/storytelling')
    },
  });

  return {
    updateTitleMutation: titleMutation.mutateAsync,
    isStoryTitleUpdatePending: titleMutation?.isPending,
  };
};
